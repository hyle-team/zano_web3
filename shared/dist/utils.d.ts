export declare function validateTokensInput(input: string | number, decimal_point?: number): {
    valid: boolean;
    error: string;
} | {
    valid: boolean;
    error?: undefined;
};
export type GenerateSecureMessageForSigningResult = {
    success: true;
    message: string;
} | {
    success: false;
    error: 'NONCE_TOO_SHORT' | 'CONTROL_CHARACTERS_NOT_ALLOWED';
};
export declare function generateSecureMessageForSigning({ domain, address, statement, uri, nonce, expirationTime, isTestnet }: {
    domain: string;
    address: string;
    statement: string;
    uri: string;
    nonce: string;
    expirationTime: Date;
    isTestnet?: boolean;
}): GenerateSecureMessageForSigningResult;
export type ParseSecureMessageForSigningResult = {
    success: true;
    parsingResult: {
        isSecureMessage: true;
        isValidSecureMessage: true;
        values: {
            domain: string;
            address: string;
            statement: string;
            uri: string;
            nonce: string;
            expirationTime: Date;
            chainId: string;
            version: string;
        };
    } | {
        isSecureMessage: boolean;
        isValidSecureMessage: false;
    };
} | {
    success: false;
    error: never;
};
export declare function parseSecureMessageForSigning({ message, }: {
    message: string;
}): ParseSecureMessageForSigningResult;
/**
 * Extracts the public spend key (`pkey`) from a Zano address.
 *
 * This is a pure-TS port of the decode path used by the native
 * `zano-node-util` addon (`base58::decode_addr` -> parse `account_public_address`):
 *   1. CryptoNote block-based base58 decode of the address.
 *   2. Split the blob into `varint(prefix) | data | checksum(4)`.
 *   3. Verify the checksum (first 4 bytes of keccak-256 over `prefix | data`).
 *   4. Read the `spend_public_key` (first 32 bytes of `data`) as the pkey.
 *
 * The `pkey` accepted by the `validate_signature` daemon RPC is exactly this
 * spend public key, so this can be used to bind a claimed address to a pkey.
 *
 * @returns The spend public key as a lowercase hex string, or `null` if the
 *          address is malformed (too short, checksum mismatch, or missing key).
 */
export declare function getPkeyFromAddress({ address }: {
    address: string;
}): string | null;
