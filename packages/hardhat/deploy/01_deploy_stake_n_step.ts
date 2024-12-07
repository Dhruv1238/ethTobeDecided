import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the StepStakeDynamicNFT contract using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployStepStakeDynamicNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("StepStakeDynamicNFT", {
    from: deployer,
    // No constructor arguments needed for this contract
    args: [],
    log: true,
    autoMine: true, // Makes deployment faster on local networks
  });

  // Get the deployed contract to interact with it after deploying
  const stepStakeDynamicNFT = await hre.ethers.getContract<Contract>("StepStakeDynamicNFT", deployer);
  console.log("🚀 StepStakeDynamicNFT deployed:", stepStakeDynamicNFT);
};

export default deployStepStakeDynamicNFT;

deployStepStakeDynamicNFT.tags = ["StepStakeDynamicNFT"];