// import { toHex } from 'web3-utils'
import {
  EthereumAddress,
  EthereumChainActionType,
  EthereumTransactionAction,
  EthereumDecomposeReturn,
} from '../../models'
import { erc20Abi } from '../abis/erc20Abi'
import { getArrayIndexOrNull } from '../../../../helpers'
import { ethereumTrxArgIsNullOrEmpty } from '../../helpers'

interface erc20BurnParams {
  contractAddress: EthereumAddress
  from?: EthereumAddress
  value: number
}

export const composeAction = ({ contractAddress, from, value }: erc20BurnParams) => {
  const contract = {
    abi: erc20Abi,
    parameters: [value],
    method: 'burn',
  }
  return {
    to: contractAddress,
    from,
    contract,
  }
}

export const decomposeAction = (action: EthereumTransactionAction): EthereumDecomposeReturn => {
  const { to, from, contract } = action
  if (contract && contract.method === 'burn') {
    const returnData: Partial<erc20BurnParams> = {
      contractAddress: to,
      from,
      value: getArrayIndexOrNull(contract.parameters, 0) as number,
    }
    const partial = !returnData?.from || ethereumTrxArgIsNullOrEmpty(to)
    return {
      chainActionType: EthereumChainActionType.Erc20Burn,
      args: returnData,
      partial,
    }
  }

  return null
}
