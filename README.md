
<div align="center">
   <img src="https://github.com/brentarimoto/Log-On/blob/main/react-app/src/images/Log-On-Icon.png">
   <h1>Welcome to Log On!</h1>
</div>

[Log On](https://woofwoof-app.herokuapp.com/) is an OMGPOP and [Facebook](https://www.slack.com) inspired website. Here users can log on to chat with friends and play fun, family-friendly games!

## Technologies
- React/Redux
- Python
- Flask
- SQLAlchemy
- PostgresQL
- WebSockets

## Features
#### Splash Page
![gif]()

### Database Schema
![db]()

### Authentication
- Users can sign up, log in, and log out.
- Users can use a demo log in to try the site.
- Logged out users will only have access to the splash page
![Auth]()

### Friends
- Users can friend other users on the platform
- Users can unfriend existing friends
- Users can see all their friends, and their info
![friends]()

### Live Chat/Messages
- Users can see online chats anywhere or all chats on the messages page
- Users can send and receive messages to/from other users.
- Useres can delete any of their own messages.
- Online Users can be seen in online users list.
- During an active game, users can message with others users in the same game
![messages]()

### Search
- Users can search for any users through the search bar.
![search]()

### Game
- Users can join and leave gamerooms.
- Users can invite other users to games
- Users can play other users in a game. 
![game]()

### Notifications
- User will see a red bubble for notifications. 
- User will receive a notification on a new message, game invitation, game error, or friend request
- Users can send notifications based on the items listed above
- Users can remove notifications by either manually removing them, or following the notification to the correct page.
![notifications]()

### Game Stats
- Users can see their own and other players games stats.
- Users can create or edit stats by playing the specified game.
- Game stats will be updated automatically once a game is played.
- A ranking system is in place (soon to be improved upon) for each player based on win/loss/tie ratio.
![notifications]()

## Installation
This project can be run by following these steps:

- Clone the repo into your desired folder.
- Run `pipenv install` from the root project directory.
- Run `npm install` from the react-app directory
- Create a database with a user.
- Create a .env file in the root directory (use .env.example).
- Run `pipenv shell` command
- Run `flask run` command from the root directory and `npm start` from the react-app directory


## Highlighted Features
- Ability to, in real time, interact with logged on friends through message and by playing a game.
- Small implementations meant to simplify user experiences like user modal pop ups to check user stats, notifications, etc.


## Future Improvements

- Ability to play against random users
- An improved ranking system
- Ability to play against the computer (with a self improving algorithm)
- New Games
- Permanent notifications without being logged on
- Improved messaging system with typing notification

For additional information, checkout our [Wiki](https://github.com/brentarimoto/Log-On/wiki) page.

> Developed By: [Brent Arimoto](https://github.com/brentarimoto)
