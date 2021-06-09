/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid'


/*************************** COMPONENT IMPORTS ***************************/
import FoursGame from './FoursGame';
import ProfilePhoto from '../../ProfilePhoto/ProfilePhoto';
import Message from '../../MessageBar/MessageChat/Message';
import {addOpponent, addRoomMessage, joinRoom, leaveRoom, removeOpponent, resetRooms, setOpponent} from '../../../store/rooms'
import {rankImages} from '../../../util/ranks'


/*************************** CSS ***************************/
import './Fours.css'


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
    if(/^\d+$/.test(hash)){
        return hash
    } else if (hash.split(':')[0].includes('Fours')){
        return '1'
    } else{
        return undefined
    }
}

/*************************** HELPER COMPONENTS ***************************/
const FoursPlayer =({user, classname})=>{
    return(
        <div className={`fours__players ${classname}`}>
            <div className='fours__players-pic'>
                <ProfilePhoto profileUser={user}/>
            </div>
            <div className='fours__players-info'>
                <div className='fours__players-username'>
                    {user.username}
                </div>
                <div className='fours__players-rank'>
                    <div className='fours__players-rank-icon' style={{color: `var(--${user.stats[1]?.rank || 'Cardboard'})`}}>
                        <i className={rankImages[user.stats[1]?.rank || 'Cardboard']}></i>
                    </div>
                    {user.stats[1]?.rank || 'Cardboard'}
                </div>
            </div>
        </div>
    )
}

const InviteItem =({friendship, inviteOpen, socket})=>{
    const {game_id} = useParams()

    const user = useSelector(state=>state.session.user)
    const friend = friendship.accepter||friendship.requester
    const fours = useSelector(state=>state.games['1'])

    const handleInvitation =()=>{
        const sender = {id:user.id, username: user.username, profile_photo:user.profile_photo}
        socket.emit("invitations", {sender:user, game:fours, hash:game_id, room:messageHash(user.id, friend.id)})
    }

    return(
        <div className='fours__invite-item' onClick={handleInvitation}>
            <div className='fours__invite-pic'>
                <ProfilePhoto profileUser={friend}/>
            </div>
            <div className='fours__invite-username'>
                {friend.username}
            </div>
        </div>
    )
}


/*************************** COMPONENTS ***************************/
const Fours = ({socket}) => {

    const dispatch = useDispatch()
    const history = useHistory()
    const {game_id} = useParams()

    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const rooms = useSelector(state=>state.rooms)

    const [gameStart, setGameStart] = useState(false)
    const [inviteOpen, setInviteOpen] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(()=>{
        if (!isHome(game_id)){
            socket.emit('join', {room:game_id})

            socket.on("chatroom", ({message}) => {
                dispatch(addRoomMessage(game_id, message))
            })

            socket.on("confirmation", ({sender_id}) => {
                if (sender_id !== user.id){
                    dispatch(setOpponent(game_id, sender_id))
                }
            })

            socket.on("move", ({move}) => {
            })

            socket.on("leave_game",({leave_game, sender_id})=>{
                if (sender_id !== user.id && leave_game){
                    dispatch(removeOpponent(game_id))
                    setGameStart(false)
                }
            })

            return ()=>{
                socket.emit('leave_game', {sender_id:user.id, room:game_id})
                dispatch(resetRooms())
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

    // useEffect(()=>{
    //     if(Object.keys(friends).length){
    //         dispatch(setOpponent(game_id, 2))
    //     }
    // },[friends])

    const handleJoinRoom =()=>{
        const hash = foursHash()
        history.push(`/games/${hash}`)
        dispatch(joinRoom(hash))
    }

    const handleOpenInvite = ()=>{
        setInviteOpen(prev=>!prev)
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
        <div className={`fours ${(!rooms[game_id]?.opponent && isHome(game_id))&& 'fours--pre'}`}>
            <div className='fours__header'>
                {(!rooms[game_id]?.opponent && isHome(game_id) ) &&
                    <button onClick={handleJoinRoom} className='fours__join-room-button'>Create Match</button>
                }
                {(!rooms[game_id]?.opponent && !isHome(game_id) ) &&
                <>
                    <button onClick={handleOpenInvite} className='fours__invite-button'>
                        Invite
                        {inviteOpen &&
                        <div className='fours__invite-list'>
                            {Object.entries(friends).map(([id, friendship])=>(
                                <InviteItem key={id} friendship={friendship} inviteOpen={inviteOpen} socket={socket}/>
                            ))}
                        </div>}
                    </button>
                    <FoursPlayer user={user} classname={'fours__user'}/>
                </>
                }
                {rooms[game_id]?.opponent &&
                    <>
                        <FoursPlayer user={rooms[game_id].opponent} classname={'fours__opponent'}/>
                        <div className='fours__VS'>
                            <h1>VS</h1>
                        </div>
                        <FoursPlayer user={user} classname={'fours__user'}/>
                    </>
                }
            </div>
            {rooms[game_id]?.opponent &&
                <div className='fours__game-container'>
                    <FoursGame />
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