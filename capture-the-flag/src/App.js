import "./App.css";
import "asteroidkit/styles.css";

import { AsteroidKitProvider, ConnectButton, createClient } from "asteroidkit";
import React from "react";

import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  WagmiConfig,
} from "wagmi";
import ABI from "./abi.json";

const client = createClient();

const APP_ID = process.env.REACT_APP_ASTEROIDKIT_APPID;

// Mumbai Address
const CONTRACT_ADDRESS = "0x7e6f65af39bE92bA720C2477D5c58d3520E348fd";

const Content = () => {
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "capture",
  });

  const { isLoading: isLoadingWrite, write } = useContractWrite(config);

  const { refetch, isRefetching } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "holder",
  });

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
            disabled={isRefetching}
            onClick={async () => {
              const result = await refetch();

              if (!result.data) {
                throw new Error("Error while fetching");
              }

              alert("Flag is been held by " + result.data);
            }}
          >
            GET WHO'S HOLDING THE FLAG
          </button>
          <button
            className="custom primary"
            disabled={write === undefined || isLoadingWrite}
            onClick={() => {
              write();
            }}
          >
            CAPTURE THE FLAG
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
