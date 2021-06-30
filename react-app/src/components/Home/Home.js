/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';


/*************************** COMPONENT IMPORTS ***************************/
import { setSpecificActiveOpen } from '../../store/activeOpen';


/*************************** CSS ***************************/
import './Home.css'


/*************************** HELPER VARIABLES ***************************/
const commingSoon = 'https://image.freepik.com/free-vector/coming-soon-design_1132-70.jpg'

/*************************** COMPONENTS ***************************/
const Home = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const listOpen = useSelector(state=>state.open.friends)
    const user = useSelector(state=>state.session.user)
    const games = useSelector(state=>state.games)


    useEffect(()=>{
        if(!listOpen){
            dispatch(setSpecificActiveOpen('friends', true))
        }
    },[dispatch])

    useEffect(()=>{
        if(localStorage.getItem('authorizing') && user){
            const pathname=localStorage.getItem('authorizing')
            localStorage.removeItem('authorizing')
            history.push(pathname)
        } else if (localStorage.getItem('authorizing') && !user){
            localStorage.removeItem('authorizing')
        }
    },[user])

    return (
    <div className='home'>
        <div className='home__game-links-div'>
            <div className='home__game-links'>
                {Object.entries(games).map(([id, game], count)=>(
                    <Link key={id} to={`/games/${id}/home`} className={`home__game-link ${count===0 ? 'home__game-link-first' : ''}`}>
                        <img className='home__game-link-image' src={game.picture} alt='game'></img>
                        <div className='home__game-link-header'>
                            {game.name}
                        </div>
                    </Link>
                ))}
                {/* {['','','','','',''].map((el, id)=>(
                    <Link key={id} to='/' className='home__game-link'>
                        <img className='home__game-link-image' src={commingSoon} alt='game'></img>
                        <div className='home__game-link-header'>
                            New Game Coming Soon
                        </div>
                    </Link>
                ))} */}
            </div>
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Home;
