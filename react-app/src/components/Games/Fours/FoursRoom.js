/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useParams } from 'react-router';
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
import { resetFours } from '../../../store/fours';


/*************************** HELPER FUNCTION ***************************/
function foursHash(){
    return `Fours:${uuid()}`
}

function messageHash(userId, friendId){
    return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}


/*************************** HELPER COMPONENTS ***************************/
const FoursPlayer =({user, classname})=>{
    const currentUser = useSelector(state=>state.session.user)
    const gameStats = useSelector(state=>state.gameStats)

    if(currentUser.id===user.id){
        user.stats=gameStats
    }

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
    const {game_id, room_id} = useParams()

    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const rooms = useSelector(state=>state.rooms)

    const [gameStart, setGameStart] = useState(false)
    const [roomOwner, setRoomOwner] = useState(false)
    const [userTurn, setUserTurn] = useState(false)
    const [inviteOpen, setInviteOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [winner, setWinner] = useState(null)

    useEffect(()=>{
        console.log(room_id)
        if (room_id){
            socket.emit('join', {room:game_id})

            socket.on("chatroom", ({message, room}) => {
                dispatch(addRoomMessage(room, message))
            })

            socket.on("confirmation", ({sender_id}) => {
                if (sender_id !== user.id){
                    dispatch(setOpponent(game_id, sender_id))
                    setRoomOwner(true)
                }
            })

            socket.on("start_game", ({sender_id, gamestart}) => {
                if(sender_id!==user.id && gamestart){
                    setGameStart(true)
                }
            })

            socket.on("reset_game", ({sender_id, reset}) => {
                if(sender_id!==user.id && reset){
                    dispatch(resetFours())
                    setWinner(null)
                    setGameStart(true)
                }
            })

            socket.on("leave_game",({leave_game, sender_id})=>{
                if (sender_id !== user.id && leave_game){
                    dispatch(removeOpponent(game_id))
                    dispatch(resetFours())
                    setGameStart(false)
                    setRoomOwner(true)
                }
            })

            return ()=>{
                console.log('UNMOUNT')
                socket.removeAllListeners("chatroom")
                socket.removeAllListeners("confirmation")
                socket.removeAllListeners("start_game")
                socket.removeAllListeners("reset_game")
                socket.removeAllListeners("leave_game")
                socket.emit('leave_game', {sender_id:user.id, room:game_id})
                socket.emit('leave', {room:game_id})
                dispatch(resetRooms())
                dispatch(resetFours())
            }
        }
    },[room_id])

    useEffect(()=>{
        if(rooms[game_id]?.opponent){
            socket.emit("confirmation", {sender_id:user.id, room:game_id})
        }
    },[game_id])

    const handleJoinRoom =()=>{
        const hash = foursHash()
        history.push(`/games/1/${hash}`)
        dispatch(joinRoom(hash))
    }

    const handleOpenInvite = ()=>{
        setInviteOpen(prev=>!prev)
    }

    const handleStart = ()=>{
        if(!winner){
            socket.emit('start_game',{p1:user.id, p2:rooms[game_id].opponent.id, room:game_id})
            setUserTurn(true)
        } else{
            socket.emit('reset_game',{sender_id:user.id, room:game_id})
            dispatch(resetFours())
        }
        setWinner(null)
        setGameStart(true)
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


    return (
        <div className={`fours ${!room_id && 'fours--pre'}`}>
            <Switch>
                <Route path='/games/1' exact={true}>
                    <div className='fours__header'>
                        <button onClick={handleJoinRoom} className='fours__join-room-button'>Create Match</button>
                    </div>
                </Route>
                <Route path='/games/1/:room_id' exact={true}>
                    {room_id}
                    {/* <div className='fours__header'>
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
                                    {gameStart && <h1>VS</h1>}
                                    {(!gameStart && !roomOwner) &&
                                    <h2>Waiting On Start...</h2>
                                    }
                                    {(!gameStart && roomOwner) &&
                                    <button className='fours__start-button' onClick={handleStart}>{winner? 'Restart' : 'Start'}</button>
                                    }

                                </div>
                                <FoursPlayer user={user} classname={'fours__user'}/>
                            </>
                        }
                    </div>
                    {rooms[game_id]?.opponent &&
                        <div className='fours__game-container'>
                            {winner &&
                            <div className='foursgame__winner'>
                                {winner}
                            </div>}
                            <FoursGame socket={socket} userTurn={userTurn} setUserTurn={setUserTurn} winner={winner} setWinner={setWinner} setGameStart={setGameStart}/>
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
                    } */}
                </Route>
            </Switch>
        </div>
    );
}


/*************************** EXPORT ***************************/
export default Fours;