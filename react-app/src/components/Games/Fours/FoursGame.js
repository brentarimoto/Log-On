/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';



/*************************** COMPONENT IMPORTS ***************************/
import FoursBoard from '../../../images/FoursBoard.png'
import { foursMove, resetFours } from '../../../store/fours';
import { updateFriendStats } from '../../../store/friends';
import { resetRooms, updateOpponent } from '../../../store/rooms';

import './FoursGame.css'
import { updateGameStats } from '../../../store/gameStats';


/*************************** COMPONENTS ***************************/
const FoursGame = ({socket, userTurn, setUserTurn, setWinner, setGameStart}) => {
    const dispatch = useDispatch()
    const {room_id} = useParams()

    const user = useSelector(state=>state.session.user)
    const rooms = useSelector(state=>state.rooms)
    const fours = useSelector(state=>state.fours)

    const inputs = Array(7).join(".").split(".")
    const slots = Array(42).join(".").split(".")

    useEffect(()=>{
        socket.on("fours_move", ({move, player, winner, loser, tie, winnerStats, loserStats, p1, p2, p1Stats, p2Stats}) => {
            if(move){
                dispatch(foursMove(move[0], move[1], player))
                if(player!==user.id){
                    setUserTurn(true)
                }
            }

            if(winner){
                setWinner(`${user.id===winner ? user.username : rooms[room_id].opponent.username}  Wins!`)

                const userStats= user.id===winner ? winnerStats : loserStats
                const otherStats = user.id===winner ? loserStats : winnerStats
                const opponent_id = user.id===winner ? loser : winner

                dispatch(updateGameStats(1, userStats))
                dispatch(updateFriendStats(opponent_id, 1, otherStats))
                dispatch(updateOpponent(room_id, 1, otherStats))
                setGameStart(false)
            }

            if(tie){
                setWinner('Game is a Tie!')

                const userStats= user.id===p1 ? p1Stats : p2Stats
                const otherStats = user.id===p1 ? p2Stats : p1Stats
                const opponent_id = user.id===p1 ? p2 : p1

                dispatch(updateGameStats(1, userStats))
                dispatch(updateFriendStats(opponent_id, 1, otherStats))
                dispatch(updateOpponent(room_id, 1, otherStats))
                setGameStart(false)
            }
        })
        return ()=>{
            socket.emit('leave_game', {sender_id:user.id, room:room_id})
            dispatch(resetFours())
        }
    },[room_id])

    const handleInput = (e)=>{
        if(e.target.id.includes('Fours_input')){
            const column = e.target.id.split(':')[1]
            socket.emit('fours_move',{sender_id:user.id, column, room:room_id})
            setUserTurn(false)
        }
    }

    return (
        <div className='foursgame'>
            <div className='foursgame__board-container'>
                <div className='foursgame__board'>
                    {inputs.map((el, id)=>(
                        <div key={`Fours_input:${id}`} className={`foursgame__board-input-div foursgame__input${id}`} >
                            <div id={`Fours_input:${id}`} className={`foursgame__input ${(!userTurn || fours.board[id][5]) ? 'foursgame__input--disabled':''}`} onClick={handleInput}></div>
                        </div>
                    ))}
                    {slots.map((el, id)=>{
                        const first = id%7;
                        const second = 6-Math.ceil((id+1)/7)

                        return(
                            <div key={`Fours_input:${first}:${second}`} className={`foursgame__board-slot-div foursgame__slot${id}`}>
                                <div id={`Fours_input:${first}:${second}`} className='foursgame__slot'
                                    style={{backgroundColor: fours.board[first][second]===null ? '' : (fours.board[first][second]===user.id ? 'var(--lightViolet)' : 'var(--lightRed)') }}
                                ></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}


/*************************** EXPORT ***************************/
export default FoursGame;