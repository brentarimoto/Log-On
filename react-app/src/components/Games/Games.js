/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation, useParams } from 'react-router';


/*************************** COMPONENT IMPORTS ***************************/
import Fours from './Fours/Fours'
import switchActiveOpen, { setSpecificActiveOpen } from '../../store/activeOpen'


/*************************** CSS ***************************/
import './Games.css'


/*************************** HELPER FUNCTION ***************************/
const gameChooser = (hash)=>{

    if(/^\d+$/.test(hash)){
        return hash
    } else if (hash.split(':')[0].includes('Fours')){
        return '1'
    } else{
        return undefined
    }
}

/*************************** HELPER VARIABLES ***************************/
const components = {
    1: <Fours />,
}


/*************************** HELPER VARIABLES ***************************/

const GameDecider = ({socket})=>{
    const {game_id} = useParams()

    if (gameChooser(game_id)==='1'){
        return(
            <Fours socket={socket}/>
        )
    } else{
        return (
            <Redirect to='/' />
        )
    }
}

/*************************** COMPONENTS ***************************/
const Games = ({socket}) => {
    const dispatch = useDispatch()
    const location = useLocation()

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
            <GameDecider socket={socket}/>
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Games;