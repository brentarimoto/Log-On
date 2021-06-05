/*************************** REACT IMPORTS ***************************/
import React from 'react';


/*************************** COMPONENT IMPORTS ***************************/
import FriendsList from '../FriendsList.js/FriendsList';
import MessageBar from '../MessageBar/MessageBar';


/*************************** CSS ***************************/
import './Home.css'

/*************************** COMPONENTS ***************************/
const Home = () => {

    return (
    <div className='home'>
        <div className='home__game-links'>
            Home
        </div>
        <FriendsList classname='home__friends-list'/>
        <MessageBar />
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Home;
