// import axios from 'axios';

// interface BaseAuthData {
//     address: string;
//     signature: string;
//     message: string;
// }

// interface AliasAuth extends BaseAuthData {
//     alias: string;
// }

// interface PkeyAuth extends BaseAuthData {
//     pkey: string;
// }

// type AuthData = AliasAuth | PkeyAuth;


// interface ValidationParams {
//     buff: string;
//     sig: string;
//     alias?: string;
//     pkey?: string;
// }


// async function validateWallet(rpcUrl: string, authData: AuthData) {

//     async function fetchZanoApi(method: string, params: any) {
//         return await axios.post(
//             rpcUrl, 
//             {
//                 "id": 0,
//                 "jsonrpc": "2.0",
//                 "method": method,
//                 "params": params,
//             }
//         ).then(res => res.data);    
//     }

//     const { message, address, signature } = authData;

//     const alias = (authData as AliasAuth).alias || undefined;
//     const pkey = (authData as PkeyAuth).pkey || undefined;

//     if (!message || (!alias && !pkey) || !signature) {
//         return false;
//     }

//     const validationParams: ValidationParams = {
//         "buff": Buffer.from(message).toString("base64"),
//         "sig": signature
//     };

//     if (alias) {
//         validationParams['alias'] = alias;
//     } else {
//         validationParams['pkey'] = pkey;
//     }

//     const response = await fetchZanoApi(
//         'validate_signature', 
//         validationParams
//     );

//     const valid = response?.result?.status === 'OK';

//     if (!valid) {
//         return false;
//     }

//     if (alias) {
//         const aliasDetailsResponse = await fetchZanoApi(
//             'get_alias_details', 
//             {
//                 "alias": alias,
//             }
//         );
    
//         const aliasDetails = aliasDetailsResponse?.result?.alias_details;
//         const aliasAddress = aliasDetails?.address;
    
//         const addressValid = !!aliasAddress && aliasAddress === address;

//         if (!addressValid) {
//             return false;
//         }
//     }

//     return valid;
// }

// export default validateWallet;