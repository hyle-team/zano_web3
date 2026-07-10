
# ZanoWallet

`zano_web3` is a TypeScript library for interacting with the ZanoWallet extension in the browser. It allows you to connect to a user's ZanoWallet, handle authentication, and manage wallet credentials.

## Features

- **Easy Integration**: Simplifies the process of connecting to the ZanoWallet extension.
- **Local Storage Support**: Optionally store wallet credentials in local storage.
- **Customizable**: Offers hooks for various connection lifecycle events.
- **Error Handling**: Provides a structured way to handle errors during the connection process.
- **Alias Management**: Allows retrieving and creating aliases.

## Installation

To install `zano_web3`, use npm or yarn:

```bash
npm install zano_web3
```

or

```bash
yarn add zano_web3
```

# WEB API (extension): 

## Usage

### Importing the Library

```typescript
import ZanoWallet from 'zano_web3/web';
```

### Creating a ZanoWallet Instance

```typescript
const zanoWallet = new ZanoWallet();
```

# Server api (Wallet RPC, Daemon):

#### Methods

- `updateWalletRpcUrl(rpcUrl: string)`: Updates the wallet RPC URL.
- `updateDaemonRpcUrl(rpcUrl: string)`: Updates the daemon RPC URL.
- `getAssetsList()`: Retrieves the list of assets.
- `getAssetDetails(assetId: string)`: Retrieves details of a specific asset.
- `getAssetInfo(assetId: string)`: Retrieves info of a specific asset.
- `sendTransfer(assetId: string, address: string, amount: string)`: Sends a transfer to an address.
- `getBalances()`: Retrieves the balances.
- `validateWallet(rpcUrl: string, authData: AuthData)`: Validates the wallet.
- `getAliasDetails(alias:string)` : Retrieves information about a specific address alias.
- `fetchDaemon(method: string, params: any)`: Fetches daemon with given method & params and returns an AxiosResponse object.
- `fetchWallet(method: string, params: any)`: Fetches wallet with given method & params and returns an AxiosResponse object.


#### 1. **Updating Wallet RPC URL**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    // Update the wallet RPC URL
    await zanoServerAPI.updateWalletRpcUrl("http://new_wallet_url:11211/json_rpc");

    console.log("Wallet RPC URL updated.");
})();
```

#### 2. **Updating Daemon RPC URL**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    // Update the daemon RPC URL
    await zanoServerAPI.updateDaemonRpcUrl("http://new_daemon_url:11211/json_rpc");

    console.log("Daemon RPC URL updated.");
})();
```

#### 3. **Getting the List of Assets**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    // Get the list of assets
    const assets = await zanoServerAPI.getAssetsList();

    console.log("Assets List:", assets);
})();
```

#### 4. **Getting Asset Details**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    // Get details of a specific asset by ID
    const assetId = "example-asset-id";
    const assetDetails = await zanoServerAPI.getAssetDetails(assetId);

    console.log(`Details for Asset ID ${assetId}:`, assetDetails);
})();
```

#### 5. **Getting Asset Info**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    // Get info for a specific asset by ID
    const assetId = "example-asset-id";
    const assetInfo = await zanoServerAPI.getAssetInfo(assetId);

    console.log(`Info for Asset ID ${assetId}:`, assetInfo);
})();
```

#### 6. **Sending a Transfer**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    // Send a transfer
    const assetId = "example-asset-id";
    const address = "recipient-address";
    const amount = "10.5"; // in asset units

    try {
        const transferResult = await zanoServerAPI.sendTransfer(assetId, address, amount);
        console.log("Transfer successful:", transferResult);
    } catch (error) {
        console.error("Transfer failed:", error.message);
    }
})();
```

#### 7. **Getting Balances**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    // Get the balances
    const balances = await zanoServerAPI.getBalances();

    console.log("Balances:", balances);
})();
```

#### 8. **Validating a Wallet**

```javascript
import { ServerWallet } from "zano_web3/server";
import { AuthData } from "./types";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    // Validate wallet using AuthData
    const authData: AuthData = {
        message: "message to sign",
        address: "wallet-address",
        signature: "signature",
        alias: "wallet-alias"
    };

    try {
        const isValid = await zanoServerAPI.validateWallet(authData);
        console.log("Wallet validation:", isValid ? "Valid" : "Invalid");
    } catch (error) {
        console.error("Validation failed:", error.message);
    }
})();
```

#### 9. **Get Alias details**

```javascript
import { ServerWallet } from "zano_web3/server";

const alias = "alias";

(async (alias) => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    try {
        const aliasDetails = await zanoServerAPI.getAliasDetails(alias);
        console.log(aliasDetails);
    } catch (error) {
        console.error(error.message);
    }
})(alias);
```

#### 10. **Fetch Daemon**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    try {
        // Fetch daemon and retrieve a response (e.g., the getinfo method)
        const getInfoResponse = await zanoServerAPI.fetchDaemon("getinfo", {
            "flags": 1048575
        });

        console.log("Info:", getInfoResponse.data.result);
    } catch (error) {
        console.error('Error fetching getinfo:', error);
    }
    
})();
```

#### 11. **Fetch Wallet**

```javascript
import { ServerWallet } from "zano_web3/server";

(async () => {
    const zanoServerAPI = new ServerWallet({
        walletUrl: "http://127.0.0.1:11211/json_rpc",
        daemonUrl: "http://127.0.0.1:11211/json_rpc"
    });

    try {
        // Fetch wallet and retrieve a response (e.g., the getaddress method)
        const getAddressResponse = await zanoServerAPI.fetchWallet("getaddress", {});

        console.log("Address Info:", getAddressResponse.data.result);
    } catch (error) {
        console.error('Error fetching getaddress:', error);
    }
    
})();
```

## Requirements

- Correct RPC URLs for the wallet and daemon.

# Shared logic
## Usage
### validateTokensInput util
validateTokensInput function checks whether a numeric or string value can be used as an amount for an asset with the specified DP.

```typescript
import { validateTokensInput } from "zano_web3/shared";

let isValidAmount = validateTokensInput("18446744.073709551615", 12); // true

isValidAmount = validateTokensInput("18446744.073709551616", 12); // false
```