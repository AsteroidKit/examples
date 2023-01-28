import "./App.css";
import "asteroidkit/styles.css";

import React from "react";
import { WagmiConfig } from "wagmi";
import { AsteroidKitProvider, ConnectButton, createClient } from "asteroidkit";

const client = createClient();

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <AsteroidKitProvider appId="123">
          <ConnectButton />
        </AsteroidKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
