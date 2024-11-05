
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

To create a `ZanoWallet` instance, you need to provide configuration options via the `ZanoWalletParams` interface.

```typescript
const zanoWallet = new ZanoWallet({
    authPath: '/api/auth', // Custom server path for authentication
    useLocalStorage: true, // Store wallet credentials in local storage (default: true)
    aliasRequired: false,  // Whether an alias is required (optional)
    customLocalStorageKey: 'myWalletKey', // Custom key for local storage (optional)
    customNonce: 'customNonceValue', // Custom nonce for signing (optional)
    disableServerRequest: false, // Disable server request after signing (optional)

    onConnectStart: () => {
        console.log('Connecting to ZanoWallet...');
    },
    onConnectEnd: (data) => {
        console.log('Connected:', data);
    },
    onConnectError: (error) => {
        console.error('Connection error:', error);
    },
    beforeConnect: async () => {
        console.log('Preparing to connect...');
    },
    onLocalConnectEnd: (data) => {
        console.log('Local connection established:', data);
    }
});
```

### React / Next.js

For React or Next.js projects, you can use the `useZanoWallet` hook to create a `ZanoWallet` instance:

```tsx

import { useZanoWallet } from 'zano_web3/web';

const MyComponent = () => {
    const zanoWallet = useZanoWallet({
        // same options as for ZanoWallet constructor
    });

    return (
        <div>
            <button onClick={() => zanoWallet.connect()}>Connect to ZanoWallet</button>
        </div>
    );
};
```

### Connecting to ZanoWallet

To initiate the connection process, call the `connect` method:

```typescript
await zanoWallet.connect();
```

### Handling Wallet Credentials

You can manually manage wallet credentials using `getSavedWalletCredentials` and `setWalletCredentials` methods:

```typescript
const credentials = zanoWallet.getSavedWalletCredentials();
if (credentials) {
    console.log('Stored credentials:', credentials);
}

zanoWallet.setWalletCredentials({
    nonce: 'newNonce',
    signature: 'newSignature',
    publicKey: 'newPublicKey'
});
```

### Retrieving Wallet Data

You can retrieve the wallet data using the `getWallet` method:

```typescript
const wallet = await zanoWallet.getWallet();
console.log('Wallet data:', wallet);
```

### Getting Address by Alias

To get an address by alias, use the `getAddressByAlias` method:

```typescript
const address = await zanoWallet.getAddressByAlias('exampleAlias');
console.log('Address:', address);
```

### Creating an Alias

To create a new alias, use the `createAlias` method:

```typescript
const newAliasData = await zanoWallet.createAlias('newAlias');
console.log('Alias created:', newAliasData);
```


## Exported Types

The following TypeScript interfaces are exported by the `zano_web3` library.
You can import them directly from library:

```typescript
import { Wallet, Asset, Transfer, Transaction } from 'zano_web3';
```

```typescript
export interface Asset {
    name: string;
    ticker: string;
    assetId: string;
    decimalPoint: number;
    balance: string;
    unlockedBalance: string;
}

export interface Transfer {
    amount: string;
    assetId: string;
    incoming: boolean;
}

export interface Transaction {
    isConfirmed: boolean;
    txHash: string;
    blobSize: number;
    timestamp: number;
    height: number;
    paymentId: string;
    comment: string;
    fee: string;
    isInitiator: boolean;
    transfers: Transfer[];
}

export interface Wallet {
    address: string;
    alias: string;
    balance: string;
    assets: Asset[];
    transactions: Transaction[];
}
```

## Requirements

- ZanoWallet browser extension must be installed.


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

## Requirements

- Correct RPC URLs for the wallet and daemon.