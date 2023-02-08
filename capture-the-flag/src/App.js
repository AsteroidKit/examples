import "asteroidkit/styles.css";
import "./App.css";

import { AsteroidKitProvider, ConnectButton, createClient } from "asteroidkit";
import React, { useState } from "react";

import { prepareWriteContract, readContract, writeContract } from "@wagmi/core";
import {
  useAccount,
  useBalance,
  useNetwork,
  useSwitchNetwork,
  WagmiConfig,
} from "wagmi";

import toast from "react-hot-toast";

import Button from "@mui/material/Button";

import { Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import ABI from "./abi.json";

const client = createClient();

const APP_ID = process.env.REACT_APP_ASTEROIDKIT_APPID;

// Mumbai Address
const CONTRACT_ADDRESS = "0x7e6f65af39bE92bA720C2477D5c58d3520E348fd";

const Content = () => {
  const { address, isDisconnected } = useAccount();
  const { data } = useBalance({ address, watch: true });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [isLoadingRead, setIsloadingRead] = useState(false);
  const [isLoadingWrite, setIsloadingWrite] = useState(false);

  const wrongNetwork = chain?.network !== "maticmum";

  return (
    <Container maxWidth="md">
      <Typography variant="h3" pt={4} pb={2} textAlign="center">
        What is this
      </Typography>
      <Typography textAlign="center">
        This website is a demo application which intents to demonstrate how to
        use <b>AsteroidKit</b> in a real application. Everytime a user clicks to{" "}
        <b>Capture The Flag</b> and signs the message, a new transactions is
        execute and the user wallet address is stored in the blockchain.
      </Typography>
      <div
        style={{
          display: "flex",
          gap: 18,
          flexDirection: "column",
          justifyContent: "center",
          marginTop: "48px",
        }}
      >
        {isDisconnected && (
          <Typography variant="h5" color="error" textAlign="center" pt={4}>
            Please connect your wallet first
          </Typography>
        )}

        {wrongNetwork && !isDisconnected && (
          <Box>
            <Button
              color="error"
              fullWidth
              variant="outlined"
              onClick={() => {
                switchNetwork(80001);
              }}
            >
              Switch to Polygon Mumbai
            </Button>
          </Box>
        )}

        {!isDisconnected && !wrongNetwork && (
          <>
            <Box pb={2}>
              <Typography fontSize="1.2rem">Balance</Typography>
              {!!data ? (
                <Typography fontSize="1.4rem" fontWeight={700}>
                  {data?.formatted} {data?.symbol}
                </Typography>
              ) : (
                <div>Loading...</div>
              )}
              {data?.value?.isZero() && (
                <Box display="flex" flexDirection="column" pt={3}>
                  <Typography color="error" textAlign="center">
                    Seems like you don't have enough balance. In order to pay
                    for transaction gas fees, faucets are required.
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    href="https://faucet.polygon.technology/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Request faucets
                  </Button>
                </Box>
              )}
            </Box>

            <Button
              variant="outlined"
              color="primary"
              disabled={isLoadingRead || isLoadingWrite || isDisconnected}
              onClick={async () => {
                setIsloadingRead(true);
                readContract({
                  address: CONTRACT_ADDRESS,
                  abi: ABI,
                  functionName: "holder",
                })
                  .then((data) => {
                    toast.custom(
                      <div
                        style={{
                          display: "flex",
                          padding: "8px 22px",
                          border: "1px solid black",
                          transition: "all 0.3s",
                          borderRadius: 8,
                          gap: 8,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "white",
                          boxShadow: "5px 5px 27px -2px rgba(0,0,0,0.39)",
                        }}
                      >
                        <div>Flag is been held by</div>
                        <b>{data}</b>
                      </div>
                    );
                  })
                  .catch((e) => {
                    console.error(e);
                    toast.error(
                      "Error while fecthing contract. Check logs for more details"
                    );
                  })
                  .finally(() => setIsloadingRead(false));
              }}
            >
              GET WHO'S HOLDING THE FLAG
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              disabled={
                isLoadingRead ||
                isLoadingWrite ||
                isDisconnected ||
                data?.value?.isZero()
              }
              onClick={async () => {
                setIsloadingWrite(true);

                const config = await prepareWriteContract({
                  address: CONTRACT_ADDRESS,
                  abi: ABI,
                  functionName: "capture",
                });

                writeContract(config)
                  .then(async (data) => {
                    await data.wait();
                    toast.success("Flag holder updated");
                  })
                  .catch((e) => {
                    console.error(e);
                    toast.error(
                      "Error whilhe calling capture method. Check logs for more details"
                    );
                  })
                  .finally(() => setIsloadingWrite(false));
              }}
            >
              {isLoadingWrite
                ? "WAITING FOR TRANSACTION..."
                : "CAPTURE THE FLAG"}
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <AsteroidKitProvider appId={APP_ID}>
          <div className="header-menu">
            <span className="header-text">Capture de Flag</span>
            <ConnectButton />
          </div>
          <Content />
        </AsteroidKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
