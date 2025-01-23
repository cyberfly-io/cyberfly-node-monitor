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
    .execution(`(free.cyberfly_node.get-all-active-nodes)`)
    .setMeta({
      chainId: '1',
      senderAccount: 'cyberfly-account-gas',
      gasLimit: 1000000000,
      gasPrice: 0.00001
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

    const utxn = Pact.builder.execution(`(free.cyberfly_node.disable-node-admin "${peerId}" "${multiaddr}" "inactive")`)
    .addSigner(keyPair.publicKey, (withCapability)=>[
      withCapability('free.cyberfly-account-gas-station.GAS_PAYER', 'cyberfly-account-gas', { int: 1 }, 1.0),
      withCapability('free.cyberfly_node.ADMIN_GUARD'),
      withCapability('free.cyberfly_node.BANK_DEBIT'),
      withCapability('free.cyberfly_node.DISABLENODE', peerId)
    ])
    .setMeta({chainId:"1",senderAccount:"cyberfly-account-gas", gasLimit:2000, gasPrice:0.0000001})
    .setNetworkId("testnet04")
    .createTransaction();
    const  signTransaction = createSignWithKeypair({publicKey:keyPair.publicKey, secretKey:keyPair.secretKey})
    const signedTx = await signTransaction(utxn)
    const res = await client.local(signedTx)
    if(res.result.status=="success"){
      const txn = await client.submit(signedTx)
      console.log("disabling - "+peerId)
      console.log(txn)
    }
    else{
      console.log(res)
    }
     
  }

  export const createNodeContractAccount = async(account)=>{

    const utxn = Pact.builder.execution(`(free.cyberfly_node.create-cyberfly-user-guard "k:f53af5c83e21316f10bdca39c9353fafdb317326f430eb4cd143bdf3faa5ba88" 100.0 "${account}")`)
    .addSigner(keyPair.publicKey, (withCapability)=>[
      withCapability('free.cyberfly-account-gas-station.GAS_PAYER', 'cyberfly-account-gas', { int: 1 }, 1.0),
      withCapability('free.cyberfly_token.TRANSFER', "k:f53af5c83e21316f10bdca39c9353fafdb317326f430eb4cd143bdf3faa5ba88", account, 100.0)
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


  export const createFaucetContractAccount = async(account)=>{

    const utxn = Pact.builder.execution(`(free.cyberfly_faucet.create-cyberfly-faucet-user-guard "k:f53af5c83e21316f10bdca39c9353fafdb317326f430eb4cd143bdf3faa5ba88" 5000000.0 "${account}")`)
    .addSigner(keyPair.publicKey, (withCapability)=>[
      withCapability('free.cyberfly-account-gas-station.GAS_PAYER', 'cyberfly-account-gas', { int: 1 }, 1.0),
      withCapability('free.cyberfly_token.TRANSFER', "k:f53af5c83e21316f10bdca39c9353fafdb317326f430eb4cd143bdf3faa5ba88", account, 5000000.0)
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
  /*export const withdrawFunds = async(account)=>{

    const utxn = Pact.builder.execution(`(free.cyberfly_node.withdraw-funds "${account}" 50.0)`)
    .addSigner(keyPair.publicKey, (withCapability)=>[
      withCapability('free.cyberfly-account-gas-station.GAS_PAYER', 'cyberfly-account-gas', { int: 1 }, 1.0),
      withCapability('free.cyberfly.TRANSFER', account,"k:f53af5c83e21316f10bdca39c9353fafdb317326f430eb4cd143bdf3faa5ba88", 50.0),
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
     
  }*/


  export const createCyberflyTokenAccount = async(account)=>{
    const utxn = Pact.builder.execution(`(free.cyberfly_token.create-account "${account}" (read-keyset "ks") )`)
    .addSigner(keyPair.publicKey, (withCapability)=>[
      withCapability('free.cyberfly-account-gas-station.GAS_PAYER', 'cyberfly-account-gas', { int: 1 }, 1.0),
    ])
    .addData("ks", { keys: [account.split(":")[1]], pred: 'keys-all' })
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


