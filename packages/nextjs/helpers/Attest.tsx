import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import eas, { schemaIds, encoders } from "./EAS";
import { ethers } from "ethers";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "viem/chains";

// Generalized attestation function
export async function attestToSchema(
    schemaKey: keyof typeof schemaIds,
    attestationData: any,
    // privateKey: string
) {
    try {
        const schemaId = schemaIds[schemaKey];
        const encoder = encoders[schemaKey];

        if (!schemaId || !encoder) {
            throw new Error(`Schema ${schemaKey} not defined`);
        }

        // Encode attestation data
        const encodedData = encoder.encodeData(attestationData);

        // Initialize signer (replace with your wallet setup)
        const wallet = new ethers.Wallet(privateKey, ethers.getDefaultProvider("base-sepolia"));

        // Connect wallet to EAS
        eas.connect(wallet);

        // Create attestation
        const tx = await eas.attest({
            schema: schemaId,
            data: {
                recipient: attestationData[0].value, // Assume recipient is the first field
                expirationTime: NO_EXPIRATION, // Never expires
                revocable: false, // Cannot be revoked
                data: encodedData,
            },
        });

        console.log(`Transaction hash for ${schemaKey}:`, tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log(`${schemaKey} attestation created successfully:`, receipt);

        // Extract attestation ID from logs
        const attestationId = receipt.logs[0].topics[1];
        console.log(`${schemaKey} Attestation ID:`, attestationId);
        return attestationId;
    } catch (error) {
        console.error(`Error attesting to ${schemaKey}:`, error);
        throw error;
    }
}

// Example usage for fitness challenge attestation
export async function attestFitnessChallenge(
    userAddress: string,
    success: boolean,
    // privateKey: string
) {
    return attestToSchema("fitnessChallenge", [
        { name: "user", value: userAddress, type: "address" },
        { name: "timestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
        { name: "success", value: success, type: "bool" },
    ]);
}
