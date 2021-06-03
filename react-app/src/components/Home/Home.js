/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import Friend from '../Friend/Friend';
import { getFriends } from '../../store/friends';


/*************************** CSS ***************************/
import './Home.css'

/*************************** COMPONENTS ***************************/
const Home = () => {
    const dispatch = useDispatch();
    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)

    useEffect(()=>{
        dispatch(getFriends(user.id))
    },[dispatch])

    return (
    <div className='home'>
        <div className='home__game-links'>
            Home
        </div>
        <div className='home__friends-list-div'>
            <div className='home__friends-list'>
                {Object.entries(friends)?.map(([id, friendship])=>(
                    <Friend key={id} friendship={friendship}/>
                ))}
            </div>
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Home;
