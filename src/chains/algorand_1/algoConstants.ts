import * as nacl from 'tweetnacl'
import { AlgorandUnit } from './models'

export const ALGORAND_ADDRESS_LENGTH = 58
export const ALGORAND_ADDRESS_BYTES_ONLY_LENGTH = 36
export const ALGORAND_CHECKSUM_BYTE_LENGTH = 4
export const PUBLIC_KEY_LENGTH = nacl.sign.publicKeyLength
export const ALGORAND_EMPTY_CONTRACT_NAME = 'none'
export const ALGORAND_POST_CONTENT_TYPE = { 'content-type': 'application/x-binary' }
/** Number of rounds to wait after the first round for the transaction confirmation */
export const ALGORAND_TRX_COMFIRMATION_ROUNDS = 1000
export const DEFAULT_TIMEOUT_FOR_TRX_CONFIRM = 500
export const DEFAULT_ALGO_UNIT = AlgorandUnit.Microalgo
/** The chain address of the default token contract (if any) */
export const NATIVE_CHAIN_TOKEN_ADDRESS: any = null
/** The symbol for the native token/currency on the chain */
export const NATIVE_CHAIN_TOKEN_SYMBOL = 'algo'
