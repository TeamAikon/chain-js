/* eslint-disable import/newline-after-import */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { ChainFactory, ChainType } from '../../../index'
import { ChainActionType, ChainSettings, ChainForkType, ChainEndpoint, ChainErrorType } from '../../../models'
import { toEthereumPrivateKey, toWei } from '../helpers'
import { EthUnit } from '../models'
;(async () => {
  try {
    const ropstenEndpoints: ChainEndpoint[] = [
      {
        url: new URL('https://ropsten.infura.io/v3/fc379c787fde4363b91a61a345e3620a'),
      },
    ]
    const ropstenPrivate = '12a1a5e255f23853aeac0581e7e5615433de9817cc5a455c8230bd4f91a03bbb'
    const ropstenChainOptions: ChainForkType = {
      chainName: 'ropsten',
      hardFork: 'istanbul',
    }
    // Assuming authorizing account balance is NOT >= 1000 ETH
    const composeEthTransferParams = {
      to: '0x27105356F6C1ede0e92020e6225E46DC1F496b81',
      value: toWei(1000, EthUnit.Ether),
    }

    const ropsten = new ChainFactory().create(ChainType.EthereumV1, ropstenEndpoints, {
      chainForkType: ropstenChainOptions,
    } as ChainSettings)
    await ropsten.connect()

    const transaction = await ropsten.new.Transaction()
    transaction.actions = [ropsten.composeAction(ChainActionType.TokenTransfer, composeEthTransferParams)]
    await transaction.prepareToBeSigned()
    await transaction.validate()
    await transaction.sign([toEthereumPrivateKey(ropstenPrivate)])
    console.log('missing signatures: ', transaction.missingSignatures)
    console.log('send response:', await transaction.send())
  } catch (error) {
    if (error.errorType === ChainErrorType.TxExceededResources) {
      console.log('Expected error:', error.message)
    } else {
      console.log('Unexpected error:', error.errorType)
    }
  }
})()
