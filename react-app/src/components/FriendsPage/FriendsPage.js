/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';


/*************************** COMPONENT IMPORTS ***************************/
import { setSpecificActiveOpen } from '../../store/activeOpen'
import UserSearchModal from '../User/UserSearchModal';


/*************************** CSS ***************************/
import './FriendsPage.css'

/*************************** COMPONENTS ***************************/
const FriendsPage = ({socket}) => {
    const dispatch = useDispatch()
    const location = useLocation()

    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const listOpen = useSelector(state=>state.open.friends)

    useEffect(()=>{
        if(listOpen){
            dispatch(setSpecificActiveOpen('friends', false))
        }
    },[dispatch])

    return (
    <div className='friendspage-container'>
        <div className='friendspage-div'>
            <div className='friendspage'>
                <div className='friendspage__header'>
                    <h1>Friends</h1>
                    <input type='text'></input>
                </div>
                <div className='friendspage__friends'>
                    {Object.entries(friends).map(([id, friendship])=>{
                        const friend = friendship.accepter || friendship.requester
                        return(
                            <UserSearchModal key={friend.id} user={friend} classname='friendspage'/>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default FriendsPage;