/*************************** REACT IMPORTS ***************************/
import React from 'react';
import { Link } from 'react-router-dom';


/*************************** COMPONENT IMPORTS ***************************/
import FriendsList from '../FriendsList.js/FriendsList';


/*************************** CSS ***************************/
import './Home.css'

const games = ['https://logonapp.s3-us-west-1.amazonaws.com/connect-4.jpg','','','','','','',]
const commingSoon = 'https://image.freepik.com/free-vector/coming-soon-design_1132-70.jpg'

/*************************** COMPONENTS ***************************/
const Home = () => {

    return (
    <div className='home'>
        <div className='home__game-links-div'>
            <div className='home__game-links'>
                {games.map((game, id)=>(
                    <Link key={id} to={game ? `/games/${id+1}` : '/'} className={`home__game-link ${id===0 ? 'home__game-link-first' : ''}`}>
                        <img className='home__game-link-image' src={game? game:commingSoon}></img>
                        <div className='home__game-link-header'>
                            {game ? 'Fours' : 'New Game Coming Soon'}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
        <FriendsList classname='home__friends-list'/>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Home;
