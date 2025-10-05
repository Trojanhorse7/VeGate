import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  console.log("🚀 Deploying VeGate contracts to VeChain TestNet...");
  console.log("Network:", hre.network.name);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // VeBetterDAO X2EarnRewardsPool address (VeChain Testnet)
  const X2EARN_REWARDS_POOL = process.env.X2EARN_REWARDS_POOL || "0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38";
  
  // Your App ID from VeBetterDAO (from .env file)
  const APP_ID = process.env.VEBETTERDAO_APP_ID || "0x0000000000000000000000000000000000000000000000000000000000000000";
  
  console.log("\n📋 VeBetterDAO Configuration:");
  console.log("   X2EarnRewardsPool:", X2EARN_REWARDS_POOL);
  console.log("   App ID:", APP_ID);
  
  if (APP_ID === "0x0000000000000000000000000000000000000000000000000000000000000000") {
    console.log("\n⚠️  WARNING: Using placeholder App ID!");
    console.log("   Register your app at: https://testnet.governance.vebetterdao.org");
    console.log("   Then update APP_ID in this script and redeploy.");
  }
  
  // Deploy VeGate Payment Contract with VeBetterDAO integration
  console.log("\n1️⃣ Deploying VeGate with VeBetterDAO integration...");
  const VeGate = await hre.ethers.getContractFactory("VeGate");
  const veGate = await VeGate.deploy(X2EARN_REWARDS_POOL, APP_ID);
  await veGate.waitForDeployment();
  const veGateAddress = await veGate.getAddress();
  console.log("✅ VeGate deployed to:", veGateAddress);
  
  // Verify configuration
  console.log("\n2️⃣ Verifying configuration...");
  const configuredPool = await veGate.x2EarnRewardsPool();
  const configuredAppId = await veGate.appId();
  console.log("   Configured X2EarnRewardsPool:", configuredPool);
  console.log("   Configured App ID:", configuredAppId);
  console.log("   Base Reward:", "1 B3TR (1 ether)");
  console.log("   Social Impact Multiplier:", "2x");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    veBetterDAO: {
      x2EarnRewardsPool: X2EARN_REWARDS_POOL,
      appId: APP_ID,
      registered: APP_ID !== "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    contracts: {
      VeGate: veGateAddress,
    },
    rewards: {
      baseReward: "1 B3TR",
      socialImpactReward: "2 B3TR",
      automatic: true,
      backendRequired: false
    }
  };
  
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const timestamp = Date.now();
  fs.writeFileSync(
    path.join(deploymentsDir, `testnet-${timestamp}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  fs.writeFileSync(
    path.join(deploymentsDir, "latest-testnet.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n💾 Deployment info saved to:");
  console.log(`   - deployments/testnet-${timestamp}.json`);
  console.log(`   - deployments/latest-testnet.json`);
  
  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Next Steps:");
  console.log("━".repeat(70));
  console.log("1️⃣  Register your app on VeBetterDAO (if not done yet):");
  console.log("   https://testnet.governance.vebetterdao.org/apps");
  console.log("   ");
  console.log("2️⃣  Update APP_ID in this script with your registered app ID");
  console.log("   ");
  console.log("3️⃣  Redeploy if you used placeholder APP_ID");
  console.log("   ");
  console.log("4️⃣  Update packages/sdk/src/vechain/contracts.ts:");
  console.log(`   test.VeGate: "${veGateAddress}"`);
  console.log("   ");
  console.log("5️⃣  Update apps/web/.env.local:");
  console.log(`   NEXT_PUBLIC_VEGATE_CONTRACT=${veGateAddress}`);
  console.log(`   NEXT_PUBLIC_X2EARN_POOL=${X2EARN_REWARDS_POOL}`);
  console.log(`   NEXT_PUBLIC_APP_ID=${APP_ID}`);
  console.log("━".repeat(70));
  console.log("\n💰 Reward System:");
  console.log("   • Normal payment: 1 B3TR (automatic)");
  console.log("   • Social impact: 2 B3TR (automatic)");
  console.log("   • No backend API required!");
  console.log("   • Rewards distributed via VeBetterDAO X2EarnRewardsPool");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
