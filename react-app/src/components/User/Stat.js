/*************************** REACT IMPORTS ***************************/
import React from 'react';


/*************************** HELPER OBJECT ***************************/
import './Stat.css'


/*************************** HELPER OBJECTS ***************************/
const image = {
  'Cardboard': 'fas fa-box-open',
  'Iron':'fas fa-weight-hanging',
  'Bronze':'fas fa-bell',
  'Silver': 'fas fa-coins',
  'Gold':'fas fa-trophy',
  'Platinum': 'fas fa-ring',
  'Diamond':'fas fa-gem',
  'Master': 'fas fa-meteor',
  'Kami':'fas fa-sun',
}

/*************************** COMPONENTS ***************************/

function Stat({stat}) {
  return (
      <div className='user__stat'>
          <h1 className='user__stat-game'>
            {stat.game.name}
          </h1>
          <div className='user__stat-rank-info'>
            <div className='user__stat-text-div'>
              <label htmlFor='rank' className='user__stat-labels'>Rank</label>
              <h2 name='rank' className='user__stat-rank'>{stat.rank}</h2>
            </div>
            <div className='user__stat-text-div'>
              <label htmlFor='points' className='user__stat-labels'>Points</label>
              <h2 name='points' className='user__stat-points'>{stat.points}/100</h2>
            </div>
            <div class="user__stat-bar">
              <div class="user__stat-bar-complete" style={{height:'20px',width:`${stat.points}%`}}></div>
            </div>
          </div>
          <div className='user__stat-img' style={{color: `var(--${stat.rank})`}}>
            <i className={image[stat.rank]}></i>
            <div className='user__stat-border'></div>
          </div>
          <div className='user__stat-wlt'>
            <div className='user__stat-text-div'>
              <label htmlFor='wins' className='user__stat-labels'>Wins</label>
              <h2 name='wins' className='user__stat-wins'>{stat.wins}</h2>
            </div>
            <div className='user__stat-text-div'>
              <label htmlFor='losses' className='user__stat-labels'>Losses</label>
              <h2 name='losses' className='user__stat-losses'>{stat.losses}</h2>

            </div>
            <div className='user__stat-text-div'>
              <label htmlFor='ties' className='user__stat-labels'>Ties</label>
              <h2 name='ties' className='user__stat-ties'>{stat.ties}</h2>

            </div>
          </div>
      </div>
  );
}


/*************************** EXPORT ***************************/

export default Stat;