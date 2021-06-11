/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useParams, NavLink } from 'react-router-dom';


/*************************** COMPONENT IMPORTS ***************************/
import { setSpecificActiveOpen } from '../../store/activeOpen'
import { getAllMessages, getMessages } from '../../store/messages';
import Message from '../MessageBar/MessageChat/Message';
import NotificationBubble from '../NotificationBubble/NotificationBubble';
import UserModal from '../User/UserModal';


/*************************** CSS ***************************/
import './MessagesPage.css'

/*************************** HELPER FUNCTION ***************************/
import messageHash from '../../util/messageHash'


/*************************** HELPER COMPONENT ***************************/

const FriendMessage = ({friend_id}) => {
    const friendship = useSelector(state=>state.friends[friend_id])
    const messages = useSelector(state=>state.messages[friend_id])
    const notificationsNum = useSelector(state=>state.notifications.messages[friend_id])

    if (!friendship){
        return null
    }

    const friend = friendship.accepter || friendship.requester

    let lastMessage;

    if(messages){
        lastMessage = Object.values(messages)[Object.values(messages).length-1]
    } else{
        lastMessage = friendship.last_message[0]
    }


    return(
        <NavLink activeClassName='messagespage--active' className='messagespage__friend' to={`/messages/${friend.id}`}>
            <div className='messagespage__friend-photo'>
                <UserModal friend={friend} friend_id={friendship.id}/>
                <NotificationBubble notificationsNum={notificationsNum} message={true}/>
            </div>
            <div className='messagespage__friend-username'>
                {friend?.username}
            </div>
            {lastMessage &&
            <div className='messagespage__friend-lastmessage-div'>
                <div className='messagespage__friend-lastmessage'>
                    {lastMessage.sender.username}: {lastMessage.message}
                </div>
            </div>}
        </NavLink>
    )
}

const FriendChat = ({socket}) => {
    const {friend_id} = useParams()
    const inputRef = useRef(null)
    const dispatch = useDispatch()

    const user = useSelector(state=>state.session.user)
    const notificationsNum = useSelector(state=>state.notifications.messages[friend_id])
    const messages = useSelector(state=>state.messages[friend_id])
    const friendship = useSelector(state=>state.friends[friend_id])

    const [message, setMessage] = useState('')

    useEffect(()=>{
        inputRef.current.focus()
        if(!messages && friendship){
            dispatch(getMessages(friendship.id, friend_id))
        }
    },[friendship])

    const onEnterPress =(e)=>{
        if(e.key=='Enter'){
            e.preventDefault()
            if(message.length>0){
                socket.emit("message", {sender_id:user.id,receiver_id:friend_id,friend_id:friendship.id, message, room:messageHash(user.id, friend_id)})
                setMessage('')
            }
        }
    }

    return(
        <>
            <div className='messagespage__chat-div'>
                <div className='messagespage__chat'>
                    {messages &&
                        Object.entries(messages).reverse().map(([id, message])=>(
                            <Message key={id} message={message}/>
                        ))
                    }
                </div>
            </div>
            <div className='messagespage__input-div'>
                <textarea
                    ref={inputRef}
                    className='messagespage__input'
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    onKeyDown={onEnterPress}
                ></textarea>
            </div>
        </>
    )
}

/*************************** COMPONENTS ***************************/
const MessagesPage = ({socket}) => {
    const dispatch = useDispatch()

    const friends = useSelector(state=>state.friends)
    const listOpen = useSelector(state=>state.open.friends)

    useEffect(()=>{
        if(listOpen){
            dispatch(setSpecificActiveOpen('friends', false))
        }
    },[dispatch])

    return (
    <div className='messagespage-container'>
        <div className='messagespage-div'>
            <div className='messagespage'>
                <div className='messagespage__friends-div'>
                    <div className='messagespage__friends-header'>
                        <h2>Chats</h2>
                        {/* <input type='text'></input> */}
                    </div>
                    <div className='messagespage__friends'>
                        {Object.entries(friends).map(([friend_id, friendship])=>(
                            <FriendMessage key={friend_id} friend_id={friend_id} friendship={friendship}/>
                        ))}
                    </div>
                </div>
                <Switch>
                    <Route path='/messages/:friend_id'>
                        <FriendChat socket={socket}/>
                    </Route>
                </Switch>
            </div>
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default MessagesPage;