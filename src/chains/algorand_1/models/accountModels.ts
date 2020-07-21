import { AlgorandPublicKey } from './cryptoModels'
import { AlgorandNewKeysOptions, AlgorandMultiSigOptions } from './generalModels'

export type AlgorandCreateAccountOptions = {
  publicKey?: AlgorandPublicKey
  newKeysOptions?: AlgorandNewKeysOptions
  multiSigOptions?: AlgorandMultiSigOptions
}

/** Type of account to create */
export enum AlgorandNewAccountType {
  /** Native account for chain type (Algorand, etc.) */
  Native = 'Native',
}