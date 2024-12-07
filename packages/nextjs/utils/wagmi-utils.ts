import { useEffect, useState } from "react";
import type { JsonRpcProvider, JsonRpcSigner } from "ethers";
import { ethers } from "ethers";
import { type HttpTransport, PublicClient, WalletClient } from "viem";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;

  if (!chain) {
    throw new Error("Chain not found");
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback") {
    const providers = (transport.transports as ReturnType<HttpTransport>[]).map(
      ({ value }) => new ethers.JsonRpcProvider(value?.url, network),
    );
    if (providers.length === 1) return providers[0];
    return new ethers.FallbackProvider(providers);
  }
  return new ethers.JsonRpcProvider(transport.url, network);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;

  if (!chain) {
    throw new Error("Chain not found");
  }

  if (!account) {
    throw new Error("Account not found");
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  return new ethers.JsonRpcSigner(provider, account.address);
}

export function useSigner() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  
  useEffect(() => {
    async function getSigner() {
      if (!walletClient || !isConnected) {
        console.warn("Wallet not connected");
        setSigner(undefined);
        return;
      }

      try {
        const tmpSigner = walletClientToSigner(walletClient);
        setSigner(tmpSigner);
        
        // Additional wallet connection verification
        try {
          const address = await tmpSigner.getAddress();
          console.log("Connected wallet address:", address);
        } catch (addressError) {
          console.error("Error getting wallet address:", addressError);
          setSigner(undefined);
        }
      } catch (signerError) {
        console.error("Error creating signer:", signerError);
        setSigner(undefined);
      }
    }

    getSigner();
  }, [walletClient, isConnected]);

  return {
    signer,
    isWalletConnected: !!signer
  };
}

export function useProvider() {
  const publicClient = usePublicClient();

  const [provider, setProvider] = useState<JsonRpcProvider | undefined>(undefined);
  useEffect(() => {
    async function getProvider() {
      if (!publicClient) return;

      const tmpProvider = publicClientToProvider(publicClient);

      setProvider(tmpProvider as unknown as JsonRpcProvider);
    }

    getProvider();
  }, [publicClient]);
  return provider;
}

// Utility function to request wallet connection
export async function requestWalletConnection() {
  try {
    // This assumes you're using wagmi's connect method
    // You might need to import and use the appropriate connect method
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return true;
  } catch (error) {
    console.error("Wallet connection error:", error);
    return false;
  }
}