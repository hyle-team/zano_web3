
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

The library also exports several TypeScript interfaces for handling various aspects of the wallet and transactions:

### Asset

Represents a digital asset within the wallet.

- **name**: The name of the asset.
- **ticker**: The ticker symbol of the asset.
- **assetId**: A unique identifier for the asset.
- **decimalPoint**: The number of decimal places the asset uses.
- **balance**: The total balance of the asset in the wallet.
- **unlockedBalance**: The portion of the balance that is unlocked and available for use.

### Transfer

Describes a transfer of assets, either incoming or outgoing.

- **amount**: The amount of the asset transferred.
- **assetId**: The identifier of the asset being transferred.
- **incoming**: A boolean indicating whether the transfer is incoming (`true`) or outgoing (`false`).

### Transaction

Details a transaction within the wallet.

- **isConfirmed**: Indicates whether the transaction is confirmed.
- **txHash**: The hash of the transaction.
- **blobSize**: The size of the transaction blob.
- **timestamp**: The timestamp when the transaction was made.
- **height**: The blockchain height at which the transaction was included.
- **paymentId**: An optional payment identifier associated with the transaction.
- **comment**: An optional comment about the transaction.
- **fee**: The transaction fee paid.
- **isInitiator**: A boolean indicating if the wallet initiated the transaction.
- **transfers**: An array of `Transfer` objects representing the transfers involved in the transaction.

### Wallet

Represents the main wallet structure, containing information about the user's wallet.

- **address**: The address of the wallet.
- **alias**: An optional alias for the wallet.
- **balance**: The total balance of the wallet.
- **assets**: An array of `Asset` objects representing the different assets held in the wallet.
- **transactions**: An array of `Transaction` objects representing the transaction history of the wallet.


## Requirements

- ZanoWallet browser extension must be installed.

## Contributing

If you find any issues or want to contribute, please create a pull request or submit an issue.
