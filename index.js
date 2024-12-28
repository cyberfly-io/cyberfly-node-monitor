import { createLibp2p } from 'libp2p'
import { getLibp2pOptions } from './config.js'
import { getNodes } from './pact-services.js'
import { getNodeInfo } from './node-services.js'
import { multiaddr } from '@multiformats/multiaddr'
import { disableNode } from './pact-services.js'
import { peerIdFromString } from '@libp2p/peer-id'

let bootstrap_nodes = ["/dns4/node.cyberfly.io/tcp/31001/p2p/12D3KooWA8mwP9wGUc65abVDMuYccaAMAkXhKUqpwKUZSN5McDrw"]

const libp2p = await createLibp2p(getLibp2pOptions(bootstrap_nodes))

libp2p.addEventListener('peer:connect', (evt) => {
    const peerId = evt.detail
    console.log('Connection established to:', peerId.toString())
  })



const monitor_nodes = async()=>{
    const nodeData = await getNodeInfo()
    const connectedPeers = nodeData.peers
    console.log(connectedPeers)
    
  getNodes().then(nodes=>{
  
    const data = nodes.result.data
  
      data.forEach(element =>{
        console.log(`Checking ${element.peer_id}`)
        const ma = multiaddr(element.multiaddr)
        const peerId = peerIdFromString(element.peer_id)
        libp2p.peerRouting.findPeer(peerId, {maxTimeout:1000}).then((peerInfo)=>{

          console.log(peerId)

          libp2p.dial(ma).then(d=>console.log(element.peer_id+ ` ${element.multiaddr} ` + ' - dial success')).catch(err=>{
          
            if (!connectedPeers.includes(element.peer_id)){
              console.log("disable", element.peer_id)
            }
            else{
              console.log(element.peer_id+ " - connected to bootstrap node")
            }
          })
        }, (error)=>{
          console.log(element.peer_id, "not found")
          disableNode(element.peer_id, element.multiaddr)
        })
   
      });
  })
}
monitor_nodes()
setInterval(monitor_nodes, 3600000)