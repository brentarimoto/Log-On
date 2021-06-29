/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import { setSpecificActiveOpen } from '../../store/activeOpen';


/*************************** CSS ***************************/
import './AboutMe.css'

/*************************** COMPONENTS ***************************/
const AboutMe = () => {
    const dispatch = useDispatch()

    const listOpen = useSelector(state=>state.open.friends)

    useEffect(()=>{
        if(listOpen){
            dispatch(setSpecificActiveOpen('friends', false))
        }
    },[dispatch])

    return (
    <div className='aboutme-container'>
        <div className='aboutme-div'>
            <div className='aboutme'>
                <h1 className='aboutme__header'>Developer: Brent Arimoto</h1>
                <a className='aboutme__pic-div' href='https://brentarimoto.github.io/' target="_blank" rel="noopener noreferrer">
                    <img className='aboutme__pic' src='https://brentarimoto.s3.us-west-1.amazonaws.com/Headshot.jpg' alt='headshot'></img>
                </a>
                <h2 className='aboutme__repo'>
                    <a href='https://github.com/brentarimoto' target="_blank" rel="noopener noreferrer">Log On Github Repo</a>
                </h2>
                <h2 className='aboutme__email'>
                    <a href="mailto: brentarimoto@gmail.com">brentarimoto@gmail.com</a>
                </h2>
                <div className='aboutme__links'>
                    <a className='aboutme__link' href='https://www.linkedin.com/in/brent-arimoto/' target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin"></i>
                        <h4 className="aboutme__link-text">LinkedIn</h4>
                    </a>
                    <a className='aboutme__link' href='https://angel.co/u/brentarimoto' target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-angellist"></i>
                        <h4 className="aboutme__link-text">AngelList</h4>
                    </a>
                    <a className='aboutme__link' href='https://github.com/brentarimoto/Log-On' target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i>
                        <h4 className="aboutme__link-text">GitHub</h4>
                    </a>
                </div>

            </div>
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default AboutMe;