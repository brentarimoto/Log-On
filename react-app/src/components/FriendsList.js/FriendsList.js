/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';


/*************************** COMPONENT IMPORTS ***************************/
import Friend from '../Friend/Friend';
import { getFriends } from '../../store/friends';
import { switchActiveOpen } from '../../store/activeOpen';

/*************************** CSS ***************************/
import './FriendsList.css'
import { getGames } from '../../store/games';

/*************************** HELPER FUNCTION ***************************/
function activeList(bool){
    if(bool){
        return 'friends-list--active'
    } else {
        return 'friends-list'
    }
}
/*************************** COMPONENTS ***************************/
const FriendsList = () => {
    const dispatch = useDispatch();
    const location = useLocation()

    const isHome=location.pathname==='/'


    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const open = useSelector(state=>state.open)
    const notifications = useSelector(state=>state.notifications.messages)

    const [notificationCount, setNotificationCount] = useState(0)
    const [loaded, setLoaded] = useState(false)

    useEffect(()=>{
        if (user){
            dispatch(getFriends(user.id))
            dispatch(getGames())
        }
    },[user])

    useEffect(()=>{
        setNotificationCount(Object.values(notifications).reduce((el,sum)=>sum+el, 0))
    },[notifications])

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
                Friends
                {notificationCount>0 &&
                <div className='friends-list__notifications'>
                    {notificationCount}
                </div>
                }
            </div>
            <div className='friends-list__list'>
                {Object.entries(friends)?.map(([id, friendship])=>(
                    <Friend key={id} friendship={friendship}/>
                ))}
            </div>
        </div>
    );
}


/*************************** EXPORT ***************************/
export default FriendsList;
