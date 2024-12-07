import eas from "./EAS";

// Function to verify attestation
export async function verifyAttestation(attestationId: string) {
    try {
        // Fetch attestation details
        const attestation = await eas.getAttestation(attestationId);

        if (!attestation) {
            throw new Error("Attestation not found");
        }

        console.log("Attestation details:", attestation);

        // Example: Check if the attestation is valid
        if (attestation.revoked) {
            throw new Error("Attestation has been revoked");
        }

        return {
            isValid: true,
            attestation,
        };
    } catch (error) {
        console.error("Error verifying attestation:", error);
        return {
            isValid: false,
            error: error.message,
        };
    }
}
