import { EosEntityName, EosActionStruct, EosDecomposeReturn, EosSymbol, EosChainActionType } from '../../../models'
import {
  getFirstAuthorizationIfOnlyOneExists,
  toEosEntityName,
  toEosEntityNameOrNull,
  toEosAsset,
  EosAssetHelper,
} from '../../../helpers'
import { NATIVE_CHAIN_TOKEN_ADDRESS } from '../../../eosConstants'

const actionName = 'transfer'
export interface EosTokenTransferParams {
  fromAccountName: EosEntityName
  toAccountName: EosEntityName
  contractName: EosEntityName
  amount: string
  symbol: EosSymbol
  memo?: string
  permission: EosEntityName
}

export const composeAction = ({
  contractName = toEosEntityName(NATIVE_CHAIN_TOKEN_ADDRESS),
  fromAccountName,
  toAccountName,
  amount,
  symbol,
  memo,
  permission,
}: EosTokenTransferParams): EosActionStruct => ({
  account: contractName,
  name: actionName,
  authorization: [
    {
      actor: fromAccountName,
      permission,
    },
  ],
  data: {
    from: fromAccountName,
    to: toAccountName,
    quantity: toEosAsset(amount, symbol),
    memo: memo || '',
  },
})

export const decomposeAction = (action: EosActionStruct): EosDecomposeReturn => {
  const { name, data, account, authorization } = action

  if (name === actionName && data?.from && data?.to) {
    // If there's more than 1 authorization, we can't be sure which one is correct so we return null
    const auth = getFirstAuthorizationIfOnlyOneExists(authorization)
    const quantityAsset = new EosAssetHelper(null, null, data.quantity)
    const returnData: EosTokenTransferParams = {
      contractName: toEosEntityName(account),
      fromAccountName: toEosEntityName(data.from),
      toAccountName: toEosEntityName(data.to),
      amount: quantityAsset.amount,
      symbol: quantityAsset.symbol,
      memo: data?.memo,
      permission: toEosEntityNameOrNull(auth?.permission),
    }
    const partial = !returnData?.permission
    return {
      chainActionType: EosChainActionType.EosTokenTransfer,
      args: returnData,
      partial,
    }
  }

  return null
}
