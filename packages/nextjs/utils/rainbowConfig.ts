import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, base, baseSepolia, optimism, sepolia } from 'viem/chains';
import scaffoldConfig from "~~/scaffold.config";

const targetNetworks = Object.values(scaffoldConfig.targetNetworks);

const projectId = "0320c6b4b914f49872b81d4d7af430c1";

export const config = getDefaultConfig({
    appName: 'StakeFit',
    projectId: '0320c6b4b914f49872b81d4d7af430c1',
    chains: [
      mainnet,
      base,
      baseSepolia,
      optimism,
      sepolia,
      ...targetNetworks,
    ],
    ssr: true, // Enable server-side rendering
  });
  
  export { targetNetworks as chains };