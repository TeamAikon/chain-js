// import { toHex } from 'web3-utils'
import {
  EthereumAddress,
  EthereumTransactionAction,
  EthereumDecomposeReturn,
  EthereumChainActionType,
} from '../../models'
import { erc721Abi } from '../abis/erc721Abi'
import { toEthereumAddress, ethereumTrxArgIsNullOrEmpty } from '../../helpers'
import { getArrayIndexOrNull } from '../../../../helpers'

interface erc721TransferFromParams {
  contractAddress: EthereumAddress
  from?: EthereumAddress
  transferFrom: EthereumAddress
  to: EthereumAddress
  tokenId: number
}

export const composeAction = ({ contractAddress, from, transferFrom, to, tokenId }: erc721TransferFromParams) => {
  const contract = {
    abi: erc721Abi,
    parameters: [transferFrom, to, tokenId],
    method: 'transferFrom',
  }
  return {
    to: contractAddress,
    from,
    contract,
  }
}

export const decomposeAction = (action: EthereumTransactionAction): EthereumDecomposeReturn => {
  const { to, from, contract } = action
  if (contract && contract.abi === erc721Abi && contract.method === 'transferFrom') {
    const returnData: Partial<erc721TransferFromParams> = {
      contractAddress: to,
      from,
      transferFrom: toEthereumAddress(getArrayIndexOrNull(contract.parameters, 0) as string),
      to: toEthereumAddress(getArrayIndexOrNull(contract.parameters, 1) as string),
      tokenId: getArrayIndexOrNull(contract.parameters, 2) as number,
    }
    const partial = !returnData?.from || ethereumTrxArgIsNullOrEmpty(to)
    return {
      chainActionType: EthereumChainActionType.Erc721TransferFrom,
      args: returnData,
      partial,
    }
  }
  return null
}
