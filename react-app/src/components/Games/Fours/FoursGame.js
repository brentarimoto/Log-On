/*************************** REACT IMPORTS ***************************/
import React from 'react';



/*************************** COMPONENT IMPORTS ***************************/
import FoursBoard from '../../../images/FoursBoard.png'

import './FoursGame.css'


/*************************** COMPONENTS ***************************/
const FoursGame = ({socket}) => {
    const inputs = Array(7).join(".").split(".")
    const slots = Array(42).join(".").split(".")

    const handleInput = (e)=>{
        socket.emit('move',{move:e.target.id})
    }

    return (
        <div className='foursgame'>
            <div className='foursgame__board-container'>
                <div className='foursgame__board'>
                    {inputs.map((el, id)=>(
                        <div key={`Fours_input:${id}`} className={`foursgame__board-input-div foursgame__input${id}`}>
                            <div id={`Fours_input:${id}`} className='foursgame__input' onClick={handleInput}></div>
                        </div>
                    ))}
                    {slots.map((el, id)=>{
                        const first = id%7;
                        const second = 6-Math.ceil((id+1)/7)

                        return(
                            <div key={`Fours_input:${first}:${second}`} className={`foursgame__board-slot-div foursgame__slot${id}`}>
                                <div id={`Fours_input:${first}:${second}`} className='foursgame__slot'></div>
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