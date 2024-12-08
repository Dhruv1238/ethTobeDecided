"use client";

import { useEffect, useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import ChatSearchBar from "~~/components/ChatSearchBar";
import { NewHeader } from "~~/components/NewHeader";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { config } from "~~/utils/rainbowConfig";
import { usePathname } from "next/navigation";

// Create clients outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
const apolloClient = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      <div>
        {!isLoginPage && <NewHeader />}
        <main>{children}</main>
        {!isLoginPage && <ChatSearchBar />}
      </div>
      <Toaster />
    </>
  );
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar height="3px" color="#2299dd" />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <ApolloProvider client={apolloClient}>
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </ApolloProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};