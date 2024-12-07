import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

// EAS Contract Address for Base Sepolia
export const EASContractAddress = "0x4200000000000000000000000000000000000021";

// Initialize EAS SDK
const eas = new EAS(EASContractAddress);

// Default provider for Base Sepolia
const provider = ethers.getDefaultProvider("sepolia");

// Connect provider to EAS
eas.connect(provider);

// Schema IDs (replace with actual deployed schema IDs)
export const schemaIds = {
  fitnessChallenge: "0x51a8a63da0f823d83d6355aee1e1643f58247253874fa36a70059b841287960e",
  stakingGoal: "0x51a8a63da0f823d83d6355aee1e1643f58247253874fa36a70059b841287960e",
  rewardDistribution: "0x51a8a63da0f823d83d6355aee1e1643f58247253874fa36a70059b841287960e",
};

// Schema Encoders for each schema
export const encoders = {
  fitnessChallenge: new SchemaEncoder("address user, uint256 timestamp, bool success"),
  stakingGoal: new SchemaEncoder("address user, uint256 timestamp, bool success"),
  rewardDistribution: new SchemaEncoder("address user, uint256 timestamp, bool success"),
};

export default eas;
