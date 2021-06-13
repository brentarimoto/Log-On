/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useParams, NavLink } from 'react-router-dom';


/*************************** COMPONENT IMPORTS ***************************/
import Message from '../MessageBar/MessageChat/Message';
import NotificationBubble from '../NotificationBubble/NotificationBubble';
import UserModal from '../User/UserModal';
import { readMessageNotification, resetMessageNotifications } from '../../store/notifications';
import { setSpecificActiveOpen } from '../../store/activeOpen'
import { getMessages } from '../../store/messages';
import { setMessagePage } from '../../store/messagepage';


/*************************** CSS ***************************/
import './MessagesPage.css'

/*************************** HELPER FUNCTION ***************************/
import messageHash from '../../util/messageHash'


/*************************** HELPER COMPONENT ***************************/

const FriendMessage = ({friend_id}) => {
    const dispatch = useDispatch()

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

    const handleFriendMessageClick  = ()=>{
        if (notificationsNum){
            dispatch(readMessageNotification(friend_id))
        }
    }


    return(
        <NavLink activeClassName='messagespage--active' className='messagespage__friend' to={`/messages/${friend.id}`} onClick={handleFriendMessageClick}>
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
    const dispatch = useDispatch()
    const inputRef = useRef(null)
	const bottomRef = useRef(null)

    const user = useSelector(state=>state.session.user)
    const messages = useSelector(state=>state.messages[friend_id])
    const friendship = useSelector(state=>state.friends[friend_id])

    const [message, setMessage] = useState('')

    useEffect(()=>{
        dispatch(setMessagePage(friend_id))
        return()=>{
            dispatch(setMessagePage(null))
        }
    },[friend_id])

    useEffect(()=>{
        inputRef.current.focus()
        if(!messages && friendship){
            dispatch(getMessages(friendship.id, friend_id))
        }
    },[friendship])

	useEffect(() => {
		if(bottomRef.current){
			scrollToBottom()
		}
	}, [messages])

	const scrollToBottom = () => {
		bottomRef.current.scrollIntoView({ behavior: "auto" })
	}

    const onEnterPress =(e)=>{
        if(e.key==='Enter'){
            e.preventDefault()
            if(message.length>0){
                socket.emit("message", {sender_id:user.id,receiver_id:parseInt(friend_id),friend_id:friendship.id, message, room:messageHash(user.id, friend_id)})
                setMessage('')
            }
        }
    }

    return(
        <>
            <div className='messagespage__chat-div'>
                <div className='messagespage__chat'>
					<div ref={bottomRef}/>
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
    const notifications = useSelector(state=>state.notifications.messages)

    useEffect(()=>{
        if(listOpen){
            dispatch(setSpecificActiveOpen('friends', false))
        }
    },[dispatch])

    const handleAllRead = ()=>{
        if(Object.values(notifications).reduce((el,sum)=>sum+el, 0)>0){
            dispatch(resetMessageNotifications())
        }
    }

    return (
    <div className='messagespage-container'>
        <div className='messagespage-div'>
            <div className='messagespage'>
                <div className='messagespage__friends-div'>
                    <div className='messagespage__friends-header'>
                        <h2 className='messagespage__friends-header-text'>Chats</h2>
                        <div className='messagespage__friends-allread' onClick={handleAllRead}>Mark All Read</div>
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