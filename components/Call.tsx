import { useEffect, useState, useRef } from "preact/hooks";


function ButtonCall() {

    const socket = useRef<any>(null)

    const url = 'ws://localhost:8000/websocket'
    let webSocket

    useEffect(()=>{
        try{
            socket.current = new WebSocket(url)
        }catch(err){
            console.log('err', err)
        }

        if(!socket.current){
            return
        }
        socket.current.onmessage = (event:any) => {
            console.log('hello', event.data)
        };
        
    },[])


  return (
    <button onClick={()=>{
        socket.current.send(JSON.stringify({
            type: 'store_user',
            name: 'hudson',
            username: 'hudson@gamil.com'
            
        }));
    }}>
        click
    </button>

  );
}

export default ButtonCall;
