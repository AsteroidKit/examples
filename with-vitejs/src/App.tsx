import "./App.css";
import "asteroidkit/styles.css";

import { WagmiConfig } from "wagmi";
import { AsteroidKitProvider, ConnectButton, createClient } from "asteroidkit";

const client = createClient();

const APP_ID = import.meta.env.VITE_ASTEROIDKIT_APPID;

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <AsteroidKitProvider appId={APP_ID}>
          <ConnectButton />
        </AsteroidKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
