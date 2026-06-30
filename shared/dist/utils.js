import Decimal from "decimal.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { base58xmr } from "@scure/base";
export function validateTokensInput(input, decimal_point = 12) {
    if (typeof input === 'number') {
        input = input.toString();
    }
    if (input === "") {
        return {
            valid: false,
            error: 'Invalid input',
        };
    }
    input = input.replace(/[^0-9.,]/g, '');
    const MAX_NUMBER = new Decimal(2).pow(64).minus(1);
    if (decimal_point < 0 || decimal_point > 18) {
        return {
            valid: false,
            error: 'Invalid decimal point',
        };
    }
    const dotInput = input.replace(/,/g, '.');
    const decimalDevider = new Decimal(10).pow(decimal_point);
    const maxAllowedNumber = MAX_NUMBER.div(decimalDevider);
    const minAllowedNumber = new Decimal(1).div(decimalDevider);
    const rounded = (() => {
        if (dotInput.replace('.', '').length > 20) {
            const decimalParts = dotInput.split('.');
            if (decimalParts.length === 2 && decimalParts[1].length > 1) {
                const beforeDotLength = decimalParts[0].length;
                const roundedInput = new Decimal(dotInput).toFixed(Math.max(20 - beforeDotLength, 0));
                if (roundedInput.replace(/./g, '').length <= 20) {
                    return roundedInput;
                }
            }
            return false;
        }
        else {
            return dotInput;
        }
    })();
    const decimalsAmount = dotInput.split('.')[1]?.length || 0;
    if (decimalsAmount > decimal_point) {
        return {
            valid: false,
            error: 'Invalid amount - too many decimal points',
        };
    }
    if (rounded === false) {
        return {
            valid: false,
            error: 'Invalid amount - number is too big or has too many decimal points',
        };
    }
    const dotInputDecimal = new Decimal(rounded);
    if (dotInputDecimal.gt(maxAllowedNumber)) {
        return {
            valid: false,
            error: 'Invalid amount - number is too big',
        };
    }
    if (dotInputDecimal.lt(minAllowedNumber)) {
        return {
            valid: false,
            error: 'Invalid amount - number is too small',
        };
    }
    return {
        valid: true
    };
}
export function generateSecureMessageForSigning({ domain, address, statement, uri, nonce, expirationTime, isTestnet }) {
    // C0/C1 controls (covers \n, \r, \t, NUL, DEL, …) plus Unicode line/paragraph
    // separators (U+2028/U+2029), which split('\n') would not catch but still break
    // the positional, line-based message layout.
    const CONTROL_CHARS = /[\p{Cc}\p{Zl}\p{Zp}]/u;
    for (const field of ['domain', 'address', 'statement', 'uri', 'nonce']) {
        const value = { domain, address, statement, uri, nonce }[field];
        if (CONTROL_CHARS.test(value)) {
            return { success: false, error: 'CONTROL_CHARACTERS_NOT_ALLOWED' };
        }
    }
    if (nonce.length < 8) {
        return {
            success: false,
            error: 'NONCE_TOO_SHORT'
        };
    }
    let result = '';
    result += `${domain} wants you to sign in with your Zano account:\n`;
    result += `${address}\n`;
    result += `\n`;
    result += `${statement}\n`;
    result += `\n`;
    result += `URI: ${uri}\n`;
    result += `Version: 1\n`;
    result += `Chain ID: ${isTestnet ? 'zano:testnet' : 'zano:mainnet'}\n`;
    result += `Nonce: ${nonce}\n`;
    result += `Expiration Time: ${expirationTime.toISOString()}`;
    return {
        success: true,
        message: result
    };
}
export function parseSecureMessageForSigning({ message, }) {
    // The message layout is fixed and positional (see
    // generateSecureMessageForSigning):
    //
    //   0: "{domain} wants you to sign in with your Zano account:"
    //   1: {address}
    //   2: ""
    //   3: {statement}
    //   4: ""
    //   5+: "Key: value" fields (URI, Version, Chain ID, Nonce, Expiration Time)
    const HEADER_SUFFIX = ' wants you to sign in with your Zano account:';
    const HEADER_LINE_COUNT = 5;
    // A "Version: ..." line is the cheap signal that this is a secure message at
    // all, independent of whether it fully parses.
    const isSecureMessage = /(\r|\n)Version:.*/g.test(message);
    const lines = message.split('\n');
    if (lines.length < HEADER_LINE_COUNT ||
        !lines[0].endsWith(HEADER_SUFFIX) ||
        lines[2] !== '' ||
        lines[4] !== '') {
        return {
            success: true,
            parsingResult: { isSecureMessage, isValidSecureMessage: false }
        };
    }
    const domain = lines[0].slice(0, -HEADER_SUFFIX.length);
    const address = lines[1];
    const statement = lines[3];
    // The remaining lines are "Key: value" fields and may appear in any order.
    const fields = new Map();
    for (const line of lines.slice(HEADER_LINE_COUNT)) {
        const separatorIndex = line.indexOf(': ');
        if (separatorIndex === -1) {
            continue;
        }
        fields.set(line.slice(0, separatorIndex), line.slice(separatorIndex + 2));
    }
    const uri = fields.get('URI');
    const version = fields.get('Version');
    const chainId = fields.get('Chain ID');
    const nonce = fields.get('Nonce');
    const expirationTimeRaw = fields.get('Expiration Time');
    // Every field that carries a value we expose must be present.
    if (domain.length === 0 ||
        uri === undefined ||
        version === undefined ||
        chainId === undefined ||
        nonce === undefined ||
        expirationTimeRaw === undefined) {
        return {
            success: true,
            parsingResult: { isSecureMessage, isValidSecureMessage: false }
        };
    }
    // Fixed-value fields must match what generateSecureMessageForSigning emits,
    // and the nonce carries the same minimum length it enforces.
    if (nonce.length < 8 ||
        version !== '1' ||
        (chainId !== 'zano:mainnet' && chainId !== 'zano:testnet')) {
        return {
            success: true,
            parsingResult: { isSecureMessage, isValidSecureMessage: false }
        };
    }
    // Expiration Time must be a valid timestamp that has not already passed.
    const expirationTime = new Date(expirationTimeRaw);
    if (Number.isNaN(expirationTime.getTime()) ||
        expirationTime.getTime() <= Date.now()) {
        return {
            success: true,
            parsingResult: { isSecureMessage, isValidSecureMessage: false }
        };
    }
    return {
        success: true,
        parsingResult: {
            isSecureMessage: true,
            isValidSecureMessage: true,
            values: {
                domain,
                address,
                statement,
                uri,
                nonce,
                expirationTime,
                chainId,
                version
            }
        }
    };
}
function readVarint(buf, start) {
    let result = 0n;
    let shift = 0n;
    let i = start;
    while (true) {
        const byte = buf[i++];
        result |= BigInt(byte & 0x7f) << shift;
        if ((byte & 0x80) === 0) {
            break;
        }
        shift += 7n;
    }
    return [result, i];
}
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
export function getPkeyFromAddress({ address }) {
    let blob;
    try {
        blob = base58xmr.decode(address);
    }
    catch {
        return null;
    }
    // Layout: varint(prefix) | data | checksum(4)
    const ADDRESS_CHECKSUM_SIZE = 4;
    if (blob.length < ADDRESS_CHECKSUM_SIZE) {
        return null;
    }
    const body = blob.subarray(0, blob.length - ADDRESS_CHECKSUM_SIZE);
    const checksum = blob.subarray(blob.length - ADDRESS_CHECKSUM_SIZE);
    const expectedChecksum = keccak_256(body).subarray(0, ADDRESS_CHECKSUM_SIZE);
    for (let i = 0; i < ADDRESS_CHECKSUM_SIZE; i++) {
        if (checksum[i] !== expectedChecksum[i]) {
            return null;
        }
    }
    // Skip the prefix varint; `account_public_address` begins with the
    // 32-byte spend_public_key, followed by the 32-byte view_public_key.
    const [, dataStart] = readVarint(body, 0);
    const data = body.subarray(dataStart);
    const PUBLIC_KEY_SIZE = 32;
    if (data.length < PUBLIC_KEY_SIZE * 2) {
        return null;
    }
    return bytesToHex(data.subarray(0, PUBLIC_KEY_SIZE));
}
//# sourceMappingURL=utils.js.map