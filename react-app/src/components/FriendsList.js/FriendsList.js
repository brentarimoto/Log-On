/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';


/*************************** COMPONENT IMPORTS ***************************/
import Friend from '../Friend/Friend';
import { getFriends } from '../../store/friends';
import { switchActiveOpen } from '../../store/activeOpen';

/*************************** CSS ***************************/
import './FriendsList.css'
import { getGames } from '../../store/games';


/*************************** COMPONENTS ***************************/
const FriendsList = ({socket}) => {
    const dispatch = useDispatch();
    const location = useLocation()

    const isHome=location.pathname==='/'


    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const open = useSelector(state=>state.open)
    const notifications = useSelector(state=>state.notifications.messages)
    const games = useSelector(state=>state.games)
    const online = useSelector(state=>state.online)


    const [notificationCount, setNotificationCount] = useState(0)
    const [onlineFriends, setOnlineFriends] = useState([])

    useEffect(()=>{
        if (user && !games[1]){
            dispatch(getFriends(user.id))
            dispatch(getGames())
        }
    },[user, dispatch])

    useEffect(()=>{
        setNotificationCount(Object.keys(online).reduce((sum, id)=>{
            const add = notifications[id] || 0
            return sum+add
        },0))
    },[notifications, online])

    useEffect(()=>{
        const onlineArray = Object.entries(friends).filter(([id, friendship])=>{
            return online[id]
        })
        setOnlineFriends(onlineArray)
    },[online, friends])

    const handleFriendsList = ()=>{
        if(!isHome){
            dispatch(switchActiveOpen('friends'))
        }
    }

    if (!user){
        return null
    }

    return (
        <div
        className={isHome ? 'home__friends-list' : `friends-list ${open.friends ? 'friends-list--active' : ''}`}
        >
            <div className={`friends-list__header ${notificationCount>0 && 'friends-list__header--active'}`} onClick={handleFriendsList}>
                Friends {Object.keys(online).length>0 && `(${Object.keys(online).length})${Object.keys(online)}`}
                {(notificationCount>0 && !open.friends) &&
                <div className='friends-list__notifications'>
                    {notificationCount}
                </div>
                }
            </div>
            <div className='friends-list__list'>
                {onlineFriends.map(([id, friendship])=>(
                    <Friend key={id} friendship={friendship} socket={socket}/>
                ))}
            </div>
        </div>
    );
}


/*************************** EXPORT ***************************/
export default FriendsList;
