/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useLocation, useParams, NavLink } from 'react-router-dom';


/*************************** COMPONENT IMPORTS ***************************/
import { setSpecificActiveOpen } from '../../store/activeOpen'
import { getAllMessages } from '../../store/messages';
import NotificationBubble from '../NotificationBubble/NotificationBubble';
import UserModal from '../User/UserModal';


/*************************** CSS ***************************/
import './MessagesPage.css'


/*************************** HELPER COMPONENT ***************************/

const FriendMessage = ({user_id}) => {
    const friendship = useSelector(state=>state.friends[user_id])
    const messages = useSelector(state=>state.messages[user_id])
    const notificationsNum = useSelector(state=>state.notifications.messages[user_id])

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

const FriendChat = ({friendship, socket}) => {
    const {user_id} = useParams()
    const inputRef = useRef(null)

    const notificationsNum = useSelector(state=>state.notifications.messages[user_id])
    const messages = useSelector(state=>state.messages[user_id])

    const [message, setMessage] = useState('')

    useEffect(()=>{
        inputRef.current.focus()
        // if(Object.values(messages).length<1){
        //     dispatch(getMessage(user_id))
        // }
    },[])

    // const onEnterPress =(e)=>{
    //     if(e.key=='Enter'){
    //         e.preventDefault()
    //         if(message.length>0){
    //             socket.emit("message", {sender_id:user.id,receiver_id:userId,friend_id:friendship.id, message, room:messageHash(userId, user.id)})
    //             setMessage('')
    //         }
    //     }
    // }

    return(
        <>
            <div className='messagespage__chat'>

            </div>
            <div className='messagespage__input'>
                <textarea
                    ref={inputRef}
                    className='messagespage__input'
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    // onKeyDown={onEnterPress}
                ></textarea>
            </div>
        </>
    )
}

/*************************** COMPONENTS ***************************/
const MessagesPage = ({socket}) => {
    const dispatch = useDispatch()
    const location = useLocation()

    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const messages = useSelector(state=>state.messages)
    const listOpen = useSelector(state=>state.open.friends)

    const [chats, setChats] = useState([])

    useEffect(()=>{
        if(listOpen){
            dispatch(setSpecificActiveOpen('friends', false))
        }
    },[dispatch])

    useEffect(()=>{
        const array = Object.entries(friends)
        const filtered = array.filter(([id, friendship])=>{
            return friendship.last_message[0] || (messages[id] && Object.values(messages[id]).length>0)
        })
        setChats(filtered)
    },[friends,messages])


    console.log(chats)

    return (
    <div className='messagespage-container'>
        <div className='messagespage-div'>
            <div className='messagespage'>
                <div className='messagespage__friends-div'>
                    <div className='messagespage__friends-header'>
                        <h2>Chats</h2>
                        <input type='text'></input>
                    </div>
                    <div className='messagespage__friends'>
                        {chats.map(([user_id, friendship])=>(
                            <FriendMessage key={user_id} user_id={user_id} />
                        ))}
                    </div>
                </div>
                <Switch>
                    <Route path='/messages/:user_id'>
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