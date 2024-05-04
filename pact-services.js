import { createClient, Pact, createSignWithKeypair } from '@kadena/client';
import { getKeyPairsFromSeedPhrase } from './utils.js';
import { config } from 'dotenv';

const client = createClient('https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact',)
config();

const keyPair = getKeyPairsFromSeedPhrase(process.env.SEED_PHRASE)

const getNodeInfo = async (peerId) =>{
    const unsignedTransaction = Pact.builder
    .execution(`(free.cyberfly_node.get-node "${peerId}")`)
    .setMeta({
      chainId: '1',
      senderAccount: 'cyberfly-account-gas',
      gasLimit: 2000,
      gasPrice: 0.0000001
    })
    // set networkId
    .setNetworkId('testnet04')
    // create transaction with hash
    .createTransaction();
    
  // Send it or local it
  const res = await client.local(unsignedTransaction, { signatureVerification:false, preflight:false});
  return res
  }


  export const getNodes = async () =>{
    const unsignedTransaction = Pact.builder
    .execution(`(free.cyberfly_node.get-all-nodes)`)
    .setMeta({
      chainId: '1',
      senderAccount: 'cyberfly-account-gas',
      gasLimit: 55000,
      gasPrice: 0.0000001
    })
    // set networkId
    .setNetworkId('testnet04')
    // create transaction with hash
    .createTransaction();

  // Send it or local it
  const res = await client.local(unsignedTransaction, { signatureVerification:false, preflight:false});
  return res
  }


  export const disableNode = async(peerId, multiaddr)=>{

    const utxn = Pact.builder.execution(`(free.cyberfly_node.update-node-admin "${peerId}" "${multiaddr}" "inactive")`)
    .addSigner(keyPair.publicKey, (withCapability)=>[
      withCapability('free.cyberfly-account-gas-station.GAS_PAYER', 'cyberfly-account-gas', { int: 1 }, 1.0),
      withCapability('free.cyberfly_node.ADMIN_GUARD')
    ])
    .setMeta({chainId:"1",senderAccount:"cyberfly-account-gas", gasLimit:2000, gasPrice:0.0000001})
    .setNetworkId("testnet04")
    .createTransaction();
    const  signTransaction = createSignWithKeypair({publicKey:keyPair.publicKey, secretKey:keyPair.secretKey})
    const signedTx = await signTransaction(utxn)
    const res = await client.local(signedTx)
    if(res.result.status=="success"){
      const txn = await client.submit(signedTx)
      console.log(txn)
    }
    else{
      console.log(res)
    }
     
  }