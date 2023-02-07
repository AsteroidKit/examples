import "./App.css";
import "asteroidkit/styles.css";

import { AsteroidKitProvider, ConnectButton, createClient } from "asteroidkit";
import React, { useState } from "react";

import { WagmiConfig } from "wagmi";

import toast from "react-hot-toast";

import { readContract, writeContract, prepareWriteContract } from "@wagmi/core";

import ABI from "./abi.json";

const client = createClient();

const APP_ID = process.env.REACT_APP_ASTEROIDKIT_APPID;

// Mumbai Address
const CONTRACT_ADDRESS = "0x7e6f65af39bE92bA720C2477D5c58d3520E348fd";

const Content = () => {
  const [isLoadingRead, setIsloadingRead] = useState(false);
  const [isLoadingWrite, setIsloadingWrite] = useState(false);

  return (
    <div className="container">
      <div className="content">
        <h1>What is this</h1>
        <p>
          This website is a demo application which intents to demonstrate how to
          use <b>AsteroidKit</b> in a real application. Everytime a user clicks
          to <b>Capture The Flag</b> and signs the message, a new transactions
          is execute and the user wallet address is stored in the blockchain.
        </p>
        <div
          style={{
            display: "flex",
            gap: 18,
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "48px",
          }}
        >
          <button
            className="custom secondary"
            disabled={isLoadingRead || isLoadingWrite}
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
          </button>
          <button
            className="custom primary"
            disabled={isLoadingRead || isLoadingWrite}
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
            {isLoadingWrite ? "WAITING FOR TRANSACTION..." : "CAPTURE THE FLAG"}
          </button>
        </div>
      </div>
    </div>
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
