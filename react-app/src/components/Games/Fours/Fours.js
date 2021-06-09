/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid'
import { io } from "socket.io-client";


/*************************** COMPONENT IMPORTS ***************************/
import Message from '../../MessageBar/MessageChat/Message';
import {addOpponent, addRoomMessage, joinRoom, leaveRoom, setOpponent} from '../../../store/rooms'


/*************************** CSS ***************************/
import './Fours.css'


/*************************** SOCKET VARIABLE ***************************/
let socket;


/*************************** HELPER FUNCTION ***************************/
function foursHash(){
    return `Fours:${uuid()}`
}

function messageHash(userId, friendId){
    return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}

function isHome(game_id){
    return /^\d+$/.test(game_id)
}

const gameChooser = (hash)=>{
    console.log(hash)

    if(/^\d+$/.test(hash)){
        return hash
    } else if (hash.split(':')[0].includes('Fours')){
        return '1'
    } else{
        return undefined
    }
}

/*************************** COMPONENTS ***************************/
const Fours = () => {

    const dispatch = useDispatch()
    const history = useHistory()
    const {game_id} = useParams()

    const user = useSelector(state=>state.session.user)
    const rooms = useSelector(state=>state.rooms)
    const fours = useSelector(state=>state.games['1'])

    const [gameStart, setGameStart] = useState(false)
    const [playersIn, setPlayersIn] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(()=>{

        if (!isHome(game_id)){
            socket=io()
            socket.on('connect', () => {
                socket.emit('join', {room:game_id})
            })

            socket.on("chatroom", ({message}) => {
                dispatch(addRoomMessage(game_id, message))
            })

            socket.on("confirmation", ({sender_id}) => {
                console.log(sender_id, typeof sender_id, sender_id !== user.id)
                if (sender_id !== user.id){
                    dispatch(setOpponent(game_id, sender_id))
                    setPlayersIn(true)
                }
            })

            return ()=>{
                socket.emit('leave', {room:game_id})
                socket.disconnect()
            }
        }
    },[game_id])

    useEffect(()=>{
        if(rooms[game_id]){
            if(rooms[game_id].opponent){
                socket.emit("confirmation", {sender_id:user.id, room:game_id})
            }
        }
    },[game_id])

    const handleJoinRoom =()=>{
        const hash = foursHash()
        history.push(`/games/${hash}`)
        dispatch(joinRoom(hash))
    }

    const handleInvitation =()=>{
        const sender = {id:user.id, username: user.username, profile_photo:user.profile_photo}
        socket.emit("invitations", {sender:user, game:fours, hash:game_id, room:messageHash(user.id, 2)})
    }

    const onEnterPress =(e)=>{
        if(e.key=='Enter'){
            e.preventDefault()
            if(message.length>0){
                const sender = {id:user.id, username: user.username, profile_photo:user.profile_photo}
                socket.emit("chatroom", {sender:sender, message, room:game_id})
                setMessage('')
            }
        }
    }

    if(!isHome(game_id) && !rooms[game_id]){
        if(gameChooser(game_id)){
            return <Redirect to={`/games/${gameChooser(game_id)}`} />
        } else{
            return <Redirect to='/'/>
        }
    }


    return (
        <div className='fours'>
            <div className='fours__header'>
                {(!rooms[game_id]?.opponent && isHome(game_id) ) &&
                    <button onClick={handleJoinRoom} className='fours__join-room-button'>Create Match</button>
                }
                {(!rooms[game_id]?.opponent && !isHome(game_id) ) &&
                    <button onClick={handleInvitation} className='fours__invite-button'>Invite</button>
                }
                {rooms[game_id]?.opponent &&
                    <p>OtherThing</p>
                }
            </div>
            {gameStart &&
                <div className='fours__board'>
                </div>
            }
            {!isHome(game_id) &&
            <div className='fours__chat'>
                <div className='gamechat__messages-div'>
                    <div className='gamechat__messages'>
                        <div className='gamechat__chat-div'>
                            {rooms[game_id]?.messages.map((message, id)=>(
                                <Message key={`${id}-${game_id}`} message={message}/>
                            ))}
                        </div>
                        <div className='gamechat__input-div'>
                            <textarea
                                className='messagechat__input'
                                value={message}
                                onChange={(e)=>setMessage(e.target.value)}
                                onKeyDown={onEnterPress}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
            }

        </div>
    );
}


/*************************** EXPORT ***************************/
export default Fours;