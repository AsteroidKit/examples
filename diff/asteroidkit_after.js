import "./App.css";
import "asteroidkit/styles.css";

import React from "react";
import { WagmiConfig } from "wagmi";
import { AsteroidKitProvider, ConnectButton, createClient } from "asteroidkit";

const client = createClient();

function App() {
  return (
    <WagmiConfig client={client}>
      <AsteroidKitProvider appId="YOUR_APP_ID">
        <ConnectButton />
      </AsteroidKitProvider>
    </WagmiConfig>
  );
}

export default App;
