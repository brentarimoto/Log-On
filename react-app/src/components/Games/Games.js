/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation, useParams } from 'react-router';


/*************************** COMPONENT IMPORTS ***************************/
import Fours from './Fours/Fours'
import switchActiveOpen, { setSpecificActiveOpen } from '../../store/activeOpen'


/*************************** CSS ***************************/
import './Games.css'


/*************************** HELPER VARIABLES ***************************/
const components = {
    1: <Fours />,
}

/*************************** COMPONENTS ***************************/
const Games = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const {game_id} = useParams()

    const user = useSelector(state=>state.session.user)
    const listOpen = useSelector(state=>state.open.friends)

    useEffect(()=>{
        if(listOpen){
            dispatch(setSpecificActiveOpen('friends', false))
        }
    },[dispatch])

    return (
    <div className='games-div'>
        <div className='games'>
            {components[game_id]}
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Games;