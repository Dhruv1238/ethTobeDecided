"use client";

import React, { useState } from "react";
import { attestFitnessChallenge } from "../../helpers/Attest";

const FitnessChallenge = () => {
  const [userAddress, setUserAddress] = useState("");
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAttest = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      setError("Private key is not configured. Please check your .env file.");
      setLoading(false);
      return;
    }

    try {
      const attestationId = await attestFitnessChallenge(userAddress, success, PRIVATE_KEY);
      setResponse(`Attestation successful! Attestation ID: ${attestationId}`);
    } catch (err: any) {
      setError(err.message || "An error occurred during attestation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1>Fitness Challenge Attestation</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          User Address:
          <input
            type="text"
            value={userAddress}
            onChange={e => setUserAddress(e.target.value)}
            placeholder="Enter recipient address"
            style={{ width: "100%", margin: "10px 0", padding: "10px", borderRadius: "5px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Challenge Completed:
          <input
            type="checkbox"
            checked={success}
            onChange={e => setSuccess(e.target.checked)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <button
        onClick={handleAttest}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          background: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Attesting..." : "Attest"}
      </button>

      {response && <p style={{ color: "green", marginTop: "20px" }}>{response}</p>}
      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
};

export default FitnessChallenge;
