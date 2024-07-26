
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

## Usage

### Importing the Library

```typescript
import ZanoWallet from 'zano_web3';
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

## Contributing

If you find any issues or want to contribute, please create a pull request or submit an issue.
