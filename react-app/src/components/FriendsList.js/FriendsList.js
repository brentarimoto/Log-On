/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import Friend from '../Friend/Friend';
import { getFriends } from '../../store/friends';

/*************************** CSS ***************************/

/*************************** HELPER FUNCTION ***************************/
/*************************** COMPONENTS ***************************/
const FriendsList = ({classname}) => {
    const dispatch = useDispatch();
    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)

    useEffect(()=>{
        dispatch(getFriends(user.id))
    },[dispatch])

    return (
    <>
        {Object.keys(friends).length>0 && <div className={classname}>
            {Object.entries(friends)?.map(([id, friendship])=>(
                <Friend key={id} friendship={friendship}/>
            ))}
        </div>}
    </>
    );
}


/*************************** EXPORT ***************************/
export default FriendsList;
