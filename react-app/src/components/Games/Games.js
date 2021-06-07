/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import switchActiveOpen, { setSpecificActiveOpen } from '../../store/activeOpen'


/*************************** CSS ***************************/
import './Games.css'

/*************************** COMPONENTS ***************************/
const Games = () => {
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(setSpecificActiveOpen('friends', false))
    },[dispatch])

    return (
    <div className='games'>
        Games
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Games;