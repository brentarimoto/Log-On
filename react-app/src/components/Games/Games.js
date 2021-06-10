/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation, useParams } from 'react-router';


/*************************** COMPONENT IMPORTS ***************************/
import Fours from './Fours/Fours'
import switchActiveOpen, { setSpecificActiveOpen } from '../../store/activeOpen'


/*************************** CSS ***************************/
import './Games.css'

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
            <Switch>
                <Route path='/games/1/:room_id'>
                    <Fours socket={socket}/>
                </Route>
                <Route path='/games/1'>
                    <Redirect to='/games/1/home'/>
                </Route>
                <Route>
                    <Redirect to='/'/>
                </Route>
            </Switch>
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Games;