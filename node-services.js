export const getNodeInfo = async()=>{

  
    // Construct the URL using the current protocol and the retrieved host
    const url = "https://node.cyberfly.io/api";
    const res =await fetch(url, {headers:{ 'Accept': 'application/json',
    'Content-Type': 'application/json'}})
    const data = await res.json()
     return data
  }