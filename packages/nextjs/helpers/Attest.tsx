import { NO_EXPIRATION, EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

// EAS Contract Address for Base Sepolia
const EASContractAddress = "0x4200000000000000000000000000000000000015";

// Schema IDs (replace with actual deployed schema IDs)
const schemaIds = {
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

// Generalized attestation function
export async function attestToSchema(
    schemaKey: keyof typeof schemaIds,
    attestationData: { name: string, value: any, type: string }[],
    signer: any
) {
    try {
        // Ensure signer is connected
        if (!signer) {
            throw new Error("No signer provided");
        }

        const eas = new EAS(EASContractAddress);
        eas.connect(signer);

        const schemaId = schemaIds[schemaKey];
        const encoder = encoders[schemaKey];

        if (!schemaId || !encoder) {
            throw new Error(`Schema ${schemaKey} not defined`);
        }

        // Encode attestation data
        const encodedData = encoder.encodeData(attestationData);

        // Ensure recipient is a valid address
        const recipient = attestationData.find(item => item.name === 'user')?.value;
        if (!recipient) {
            throw new Error("Recipient address is required");
        }

        // Create attestation
        const tx = await eas.attest({
            schema: schemaId,
            data: {
                recipient: recipient,
                expirationTime: NO_EXPIRATION,
                revocable: true, // Changed to true for more flexibility
                data: encodedData,
            },
        });

        // Wait for transaction confirmation
        const receipt = await tx.wait();

        // Extract attestation ID
        const attestationId = receipt.logs[0].topics[1];
        
        console.log(`Attestation created successfully. Transaction receipt: ${tx.receipt}`);
        console.log(`Attestation ID: ${attestationId}`);

        return attestationId;
    } catch (error) {
        console.error("Attestation Error:", error);
        throw error;
    }
}

// Example usage for fitness challenge attestation
export async function attestFitnessChallenge(
    userAddress: string,
    success: boolean,
    signer: any
) {
    return attestToSchema("fitnessChallenge", [
        { name: "user", value: userAddress, type: "address" },
        { name: "timestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
        { name: "success", value: success, type: "bool" },
    ], signer);
}