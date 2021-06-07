/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid'
import { io } from "socket.io-client";
import { switchActiveOpen } from '../../../store/activeOpen';


/*************************** COMPONENT IMPORTS ***************************/
import Message from '../../MessageBar/MessageChat/Message';
import {addRoomMessage, joinRoom} from '../../../store/rooms'


/*************************** CSS ***************************/
import './Fours.css'

/*************************** SOCKET VARIABLE ***************************/
let socket;


/*************************** HELPER FUNCTION ***************************/
function foursHash(){
    return `Fours:${uuid()}`
  }


/*************************** COMPONENTS ***************************/
const Fours = () => {

    const dispatch = useDispatch()

    const user = useSelector(state=>state.session.user)
    const rooms = useSelector(state=>state.rooms)

    const [inRoom, setInRoom] = useState(null)
    const [gameStart, setGameStart] = useState(false)
    const [chatRoom, setChatRoom] = useState([])
    const [message, setMessage] = useState('')

    useEffect(()=>{
        socket=io()
        if (inRoom){
            socket.on('connect', () => {
                socket.emit('join', {room:inRoom})
            })
        }

        socket.on("chatroom", ({message}) => {
            dispatch(addRoomMessage(inRoom, message))
        })

        return ()=>{
            socket.disconnect()
        }

    },[inRoom])

    const handleJoinRoom =()=>{
        const hash = foursHash()
        setInRoom(hash)
        dispatch(joinRoom(hash))
    }

    const onEnterPress =(e)=>{
        if(e.key=='Enter'){
            e.preventDefault()
            if(message.length>0){
                socket.emit("chatroom", {sender:user, message, room:inRoom})
                setMessage('')
            }
        }
    }

    return (
        <div className='fours'>
            <div className='fours__header'>
                <button onClick={handleJoinRoom} className='Join Room'>Join Room</button>
            </div>
            {gameStart &&
                <div className='fours__board'>
                </div>
            }
            {inRoom &&
            <div className='fours__info'>
                <div className='fours__players'>
                    <div>

                    </div>
                </div>
                <div className='fours__info-messages'>
                    <div className='fours__info-chat-div'>
                        {rooms[inRoom].reverse()?.map((message, id)=>(
                            <Message key={`${id}-${inRoom}`} message={message}/>
                        ))}
                    </div>
                    <div className='fours__info-input-div'>
                        <textarea
                            className='messagechat__input'
                            value={message}
                            onChange={(e)=>setMessage(e.target.value)}
                            onKeyDown={onEnterPress}
                        ></textarea>
                    </div>
                </div>
            </div>}

        </div>
    );
}


/*************************** EXPORT ***************************/
export default Fours;