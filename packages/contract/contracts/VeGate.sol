// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IX2EarnRewardsPool.sol";

/**
 * @title VeGate
 * @dev Smart contract for gasless QR-code payment solution on VeChainThor
 * Supports fee delegation (VIP-191), B3TR rewards via VeBetterDAO, and social impact payments
 * 
 * Features:
 * - Automatic 1 B3TR reward per successful payment
 * - 2x rewards (2 B3TR) for social impact payments
 * - Direct integration with VeBetterDAO X2EarnRewardsPool
 * - No backend API required - fully on-chain
 * 
 * @author VeGate Team
 */
contract VeGate is ReentrancyGuard, AccessControl {
    bytes32 public constant SPONSOR_ROLE = keccak256("SPONSOR_ROLE");
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");

    struct Bill {
        address receiver;
        address token; // Token contract address
        uint256 amount;
        bool paid;
        bool socialImpact; // Donation/impact payment flag
        string category; // Donation, Subscription, E-commerce, Utility
        uint256 createdAt;
        uint256 paidAt;
        address payer;
        uint256 b3trReward;
        bytes32 bridgeId; // For cross-chain payments
    }

    // VeBetterDAO X2EarnRewardsPool integration
    IX2EarnRewardsPool public x2EarnRewardsPool;
    bytes32 public appId;
    
    // Reward constants - Fixed 1 B3TR per payment
    uint256 public constant BASE_REWARD = 1 ether; // 1 B3TR (18 decimals)
    uint256 public constant SOCIAL_IMPACT_MULTIPLIER = 2; // 2x for social impact
    
    mapping(bytes32 => Bill) public bills;
    mapping(address => bytes32[]) public userCreatedBills;
    mapping(address => bytes32[]) public userPaidBills;
    mapping(address => uint256) public totalRewardsEarned;
    
    uint256 public totalBills;
    uint256 public totalPaidBills;
    uint256 public totalSocialImpactBills;
    uint256 public totalRewardsDistributed;
    
    event BillCreated(
        bytes32 indexed billId,
        address indexed receiver,
        address indexed token,
        uint256 amount,
        bool socialImpact,
        string category,
        uint256 timestamp
    );
    
    event BillPaid(
        bytes32 indexed billId,
        address indexed payer,
        address indexed receiver,
        address token,
        uint256 amount,
        uint256 b3trReward,
        bool socialImpact,
        uint256 timestamp
    );

    event RewardDistributed(
        address indexed recipient,
        uint256 amount,
        bytes32 indexed billId,
        uint256 timestamp
    );

    event RewardDistributionFailed();

    event BridgePaymentInitiated(
        bytes32 indexed billId,
        bytes32 indexed bridgeId,
        address indexed payer,
        uint256 timestamp
    );

    event BridgePaymentCompleted(
        bytes32 indexed billId,
        bytes32 indexed bridgeId,
        uint256 timestamp
    );

    error BillAlreadyExists();
    error BillNotFound();
    error BillAlreadyPaid();
    error InvalidAmount();
    error InsufficientBalance();
    error TransferFailed();
    error Unauthorized();
    error InvalidCategory();

    /**
     * @dev Constructor
     * @param _x2EarnRewardsPool Address of VeBetterDAO X2EarnRewardsPool contract
     * @param _appId Your unique app ID from VeBetterDAO (must be approved)
     */
    constructor(
        address _x2EarnRewardsPool,
        bytes32 _appId
    ) {
        x2EarnRewardsPool = IX2EarnRewardsPool(_x2EarnRewardsPool);
        appId = _appId;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SPONSOR_ROLE, msg.sender);
    }

    /**
     * @dev Create a new bill with unique ID
     * @param billId Unique identifier for the bill
     * @param token Token address
     * @param amount Amount to be paid
     * @param socialImpact Whether this is a donation/impact payment
     * @param category Bill category (Donation, Subscription, E-commerce, Utility)
     */
    function createBill(
        bytes32 billId,
        address token,
        uint256 amount,
        bool socialImpact,
        string calldata category
    ) external {
        if (bills[billId].receiver != address(0)) {
            revert BillAlreadyExists();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }
        if (!_isValidCategory(category)) {
            revert InvalidCategory();
        }

        bills[billId] = Bill({
            receiver: msg.sender,
            token: token,
            amount: amount,
            paid: false,
            socialImpact: socialImpact,
            category: category,
            createdAt: block.timestamp,
            paidAt: 0,
            payer: address(0),
            b3trReward: 0,
            bridgeId: bytes32(0)
        });

        userCreatedBills[msg.sender].push(billId);
        totalBills++;
        
        if (socialImpact) {
            totalSocialImpactBills++;
        }

        emit BillCreated(
            billId,
            msg.sender,
            token,
            amount,
            socialImpact,
            category,
            block.timestamp
        );
    }

    /**
     * @dev Pay an existing bill (standard method)
     * @param billId ID of the bill to pay
     */
    function payBill(bytes32 billId) external payable nonReentrant {
        _processBillPayment(billId, msg.sender);
    }

    /**
     * @dev Pay a bill with fee delegation (VIP-191 compatible)
     * Sponsor pays the gas, payer provides the payment
     * @param billId ID of the bill to pay
     * @param payer Address of the actual payer
     */
    function payBillSponsored(
        bytes32 billId,
        address payer
    ) external payable nonReentrant onlyRole(SPONSOR_ROLE) {
        _processBillPayment(billId, payer);
    }

    /**
     * @dev Mark bill as paid from cross-chain bridge
     * @param billId ID of the bill
     * @param bridgeId Bridge transaction ID
     * @param payer Address of the payer
     */
    function completeBridgePayment(
        bytes32 billId,
        bytes32 bridgeId,
        address payer
    ) external onlyRole(SPONSOR_ROLE) nonReentrant {
        Bill storage bill = bills[billId];
        
        if (bill.receiver == address(0)) {
            revert BillNotFound();
        }
        if (bill.paid) {
            revert BillAlreadyPaid();
        }

        // Mark bill as paid (tokens already bridged and transferred)
        bill.paid = true;
        bill.paidAt = block.timestamp;
        bill.payer = payer;
        bill.bridgeId = bridgeId;

        userPaidBills[payer].push(billId);
        totalPaidBills++;

        // Calculate and distribute B3TR reward
        uint256 reward = _calculateReward(bill.amount, bill.socialImpact);
        bill.b3trReward = reward;
        _distributeReward(payer, reward, billId);

        emit BridgePaymentCompleted(billId, bridgeId, block.timestamp);
        emit BillPaid(
            billId,
            payer,
            bill.receiver,
            bill.token,
            bill.amount,
            reward,
            bill.socialImpact,
            block.timestamp
        );
    }

    /**
     * @dev Internal function to process bill payment
     */
    function _processBillPayment(bytes32 billId, address payer) internal {
        Bill storage bill = bills[billId];
        
        if (bill.receiver == address(0)) {
            revert BillNotFound();
        }
        if (bill.paid) {
            revert BillAlreadyPaid();
        }

        // Transfer tokens
        IERC20 token = IERC20(bill.token);
        if (token.balanceOf(payer) < bill.amount) {
            revert InsufficientBalance();
        }
        
        bool success = token.transferFrom(payer, bill.receiver, bill.amount);
        if (!success) {
            revert TransferFailed();
        }

        // Update bill status
        bill.paid = true;
        bill.paidAt = block.timestamp;
        bill.payer = payer;

        userPaidBills[payer].push(billId);
        totalPaidBills++;

        // Calculate and distribute B3TR reward
        uint256 reward = _calculateReward(bill.amount, bill.socialImpact);
        bill.b3trReward = reward;
        _distributeReward(payer, reward, billId);

        emit BillPaid(
            billId,
            payer,
            bill.receiver,
            bill.token,
            bill.amount,
            reward,
            bill.socialImpact,
            block.timestamp
        );
    }

    /**
     * @dev Calculate B3TR reward based on social impact
     * Returns fixed 1 B3TR for normal payments, 2 B3TR for social impact
     */
    function _calculateReward(uint256 /* amount */, bool socialImpact) internal pure returns (uint256) {
        if (socialImpact) {
            return BASE_REWARD * SOCIAL_IMPACT_MULTIPLIER; // 2 B3TR
        }
        return BASE_REWARD; // 1 B3TR
    }

    /**
     * @dev Distribute B3TR rewards via VeBetterDAO X2EarnRewardsPool
     * Uses transaction hash and bill ID as proof
     * @param recipient Address receiving the reward
     * @param amount Amount of B3TR to distribute
     * @param billId Bill identifier used as proof
     */
    function _distributeReward(address recipient, uint256 amount, bytes32 billId) internal {
        if (amount == 0) return;
        
        // Prepare proof arrays
        string[] memory proofTypes = new string[](2);
        proofTypes[0] = "text";  // Bill ID
        proofTypes[1] = "text";  // Transaction will be indexed on-chain
        
        string[] memory proofValues = new string[](2);
        proofValues[0] = _bytes32ToString(billId);
        proofValues[1] = "VeGate payment completed";
        
        // Impact tracking
        string[] memory impactCodes = new string[](1);
        impactCodes[0] = "payment";
        
        uint256[] memory impactValues = new uint256[](1);
        impactValues[0] = 1; // Count of payments
        
        // Description based on social impact
        Bill storage bill = bills[billId];
        string memory description = bill.socialImpact
            ? "User completed social impact payment via VeGate"
            : "User completed payment via VeGate";
        
        // Distribute reward through VeBetterDAO
        try x2EarnRewardsPool.distributeRewardWithProof(
            appId,
            amount,
            recipient,
            proofTypes,
            proofValues,
            impactCodes,
            impactValues,
            description
        ) {
            totalRewardsEarned[recipient] += amount;
            totalRewardsDistributed += amount;
            emit RewardDistributed(recipient, amount, billId, block.timestamp);
        } catch {
            // If VeBetterDAO distribution fails, emit event but don't revert payment
            // This ensures payment goes through even if rewards pool is empty
            emit RewardDistributionFailed();
        }
    }
    
    /**
     * @dev Convert bytes32 to string for proof
     */
    function _bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        bytes memory bytesArray = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            uint8 value = uint8(_bytes32[i]);
            bytesArray[i * 2] = _toHexChar(value / 16);
            bytesArray[i * 2 + 1] = _toHexChar(value % 16);
        }
        return string(bytesArray);
    }
    
    /**
     * @dev Convert uint8 to hex character
     */
    function _toHexChar(uint8 value) internal pure returns (bytes1) {
        if (value < 10) {
            return bytes1(uint8(48 + value)); // 0-9
        }
        return bytes1(uint8(87 + value)); // a-f
    }

    /**
     * @dev Validate bill category
     */
    function _isValidCategory(string calldata category) internal pure returns (bool) {
        bytes32 categoryHash = keccak256(bytes(category));
        return (
            categoryHash == keccak256("Donation") ||
            categoryHash == keccak256("Subscription") ||
            categoryHash == keccak256("E-commerce") ||
            categoryHash == keccak256("Utility")
        );
    }

    /**
     * @dev Get bill details
     */
    function getBill(bytes32 billId) external view returns (Bill memory) {
        return bills[billId];
    }

    /**
     * @dev Get all bills created by a user
     */
    function getUserCreatedBills(address user) external view returns (bytes32[] memory) {
        return userCreatedBills[user];
    }

    /**
     * @dev Get all bills paid by a user
     */
    function getUserPaidBills(address user) external view returns (bytes32[] memory) {
        return userPaidBills[user];
    }

    /**
     * @dev Get user's total B3TR rewards earned
     */
    function getUserRewards(address user) external view returns (uint256) {
        return totalRewardsEarned[user];
    }

    /**
     * @dev Check bill status
     */
    function billStatus(bytes32 billId) external view returns (
        bool exists,
        bool isPaid,
        bool isSocialImpact,
        uint256 reward
    ) {
        Bill memory bill = bills[billId];
        exists = bill.receiver != address(0);
        isPaid = bill.paid;
        isSocialImpact = bill.socialImpact;
        reward = bill.b3trReward;
    }

    /**
     * @dev Generate a unique bill ID
     */
    function generateBillId(
        address user,
        uint256 nonce,
        uint256 timestamp
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(user, nonce, timestamp));
    }

    /**
     * @dev Add sponsor address
     */
    function addSponsor(address sponsor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SPONSOR_ROLE, sponsor);
    }

    /**
     * @dev Remove sponsor address
     */
    function removeSponsor(address sponsor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SPONSOR_ROLE, sponsor);
    }
}
