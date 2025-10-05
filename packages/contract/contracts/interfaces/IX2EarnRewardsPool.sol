// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IX2EarnRewardsPool
 * @dev Interface for VeBetterDAO X2Earn Rewards Pool
 * Allows apps to distribute B3TR rewards to users for sustainable actions
 * 
 * Testnet Address: 0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38
 * @notice This is a simplified interface with only the functions we need
 */
interface IX2EarnRewardsPool {
    /**
     * @dev Event emitted when a reward is distributed with proof
     */
    event RewardDistributed(
        uint256 amount,
        bytes32 indexed appId,
        address indexed receiver,
        string proof,
        address indexed distributor
    );

    /**
     * @dev Distribute rewards to user with proof of sustainable action
     * @param appId Your unique app ID from VeBetterDAO
     * @param amount Amount of B3TR tokens to distribute
     * @param receiver Address of the user receiving the reward
     * @param proofTypes Array of proof types (e.g., ["link", "text"])
     * @param proofValues Array of proof values (e.g., [transactionHash, billId])
     * @param impactCodes Array of impact categories (e.g., ["payment", "transaction"])
     * @param impactValues Array of impact values (e.g., [billAmount, 1])
     * @param description Human-readable description of the action
     */
    function distributeRewardWithProof(
        bytes32 appId,
        uint256 amount,
        address receiver,
        string[] memory proofTypes,
        string[] memory proofValues,
        string[] memory impactCodes,
        uint256[] memory impactValues,
        string memory description
    ) external;

    /**
     * @dev Check available funds for an app
     * @param appId Your app ID
     * @return Available balance in the rewards pool
     */
    function availableFunds(bytes32 appId) external view returns (uint256);

    /**
     * @dev Check if distribution is paused for an app
     * @param appId Your app ID
     * @return True if paused, false otherwise
     */
    function isDistributionPaused(bytes32 appId) external view returns (bool);
}
