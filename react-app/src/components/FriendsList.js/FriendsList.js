/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';


/*************************** COMPONENT IMPORTS ***************************/
import Friend from '../Friend/Friend';
import { getFriends } from '../../store/friends';
import { switchActiveOpen } from '../../store/activeOpen';

/*************************** CSS ***************************/
import './FriendsList.css'

/*************************** HELPER FUNCTION ***************************/
function activeList(bool){
    if(bool){
        return 'friends-list--active'
    } else {
        return 'friends-list'
    }
}
/*************************** COMPONENTS ***************************/
const FriendsList = ({classname}) => {
    const dispatch = useDispatch();
    const location = useLocation()

    const isHome=location.pathname==='/'

    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const open = useSelector(state=>state.open)

    useEffect(()=>{
        if (user){
            dispatch(getFriends(user.id))
        }
    },[dispatch])

    return (
    <>
        {Object.keys(friends).length>0 && <div className={isHome ? 'home__friends-list' : `friends-list ${open.friends ? 'friends-list--active' : ''}`}>
            {isHome ?
            <div className='friends-list__header'>
                Friends
            </div> :
            <div className='friends-list__header' onClick={()=>dispatch(switchActiveOpen('friends'))}>
                Friends
            </div>
            }
            {Object.entries(friends)?.map(([id, friendship])=>(
                <Friend key={id} friendship={friendship}/>
            ))}
        </div>}
    </>
    );
}


/*************************** EXPORT ***************************/
export default FriendsList;
