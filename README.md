
<div align="center">
   <h1>Welcome to Log On!</h1>
</div>

<div align="center">
  <img src="https://github.com/CodingInRhythm/slack_clone/blob/main/wiki/images/logo.png">
</div>

[Log On](https://woofwoof-app.herokuapp.com/) is an OMGPOP(RIP) and [Facebook](https://www.slack.com) inspired website. Here users can log on to chat with friends and play fun, family-friendly games!

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
- Users can sign up, and log in

### Friends
- Users can see all their friends
- Users can send and accept friend requests
- Users can unfriend any existing friends

### DMs
- Users can see all conversations on the side bar
- Users can send and receive messages from other users.
- Users with whom you communicate will have green status if they are online.
![dms](https://github.com/CodingInRhythm/slack_clone/blob/main/wiki/images/ui-dms.png)

### Search
- Users can search all channels, including channels that user does not belongs to
- Users can search all other users
![search](https://github.com/CodingInRhythm/slack_clone/blob/main/wiki/images/ui-search.png)

### Notifications
- User can see red notifications with the number of unread messages on the sidebar to the right of the dm or channel.

![notifications](https://github.com/CodingInRhythm/slack_clone/blob/main/wiki/images/ui-notifications.png)

### Live chat
- Live chat is implemented by using Socket.io library. It enables real-time, bidirectional and event-based communication.
- It works in both channels and DMs


## Installation
This project can be run by following these steps:

- Clone the repo into your desired folder.
- Run `pipenv install` from the root project directory.
- Run `npm install` from the react-app directory
- Create a .env file in the root directory (use .env.example).
- Run `pipenv shell` command
- Run `flask run` command from the root directory and `npm start` from the react-app directory

## Future Improvements

- Ability to create private channels
- Implement event-based fetching on scrolled
- Bookmark the messages
- live `typing ...` notification

For additional information, checkout our [Wiki](https://github.com/CodingInRhythm/slack_clone/wiki) page.

> Developed By: [Brent Arimoto](https://github.com/brentarimoto), [Nurs Asanov](https://github.com/nasanov), [Alex Clough](https://github.com/CodingInRhythm), [Zane Preudhomme](https://github.com/zpreudhomme)
