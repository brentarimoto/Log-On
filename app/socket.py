from flask import session
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from .models import db, Message

# Add after deploy
# from engineio.payload import Payload

# Payload.max_decode_packets = 500

# Setting origins variable to all when in dev, actual heroku app-url in production

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://log-on.herokuapp.com",
        "http://log-on.herokuapp.com"
    ]
else:
    origins = "*"

# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)


@socketio.on("join")
def on_join(data):
    room=data['room']
    join_room(room)


@socketio.on('leave')
def on_leave(data):
    room=data['room']
    leave_room(room)


@socketio.on("message")
def message(data):
    '''
    listening for 'chat' event.  Message received is data.  We emit message (data param) back to everyone on chat channel,
    broadcast True means all connected users will receive message,
    will want to change this.
    '''
    message = Message(sender_id = data['sender_id'], friend_id = data['friend_id'], message=data['message'])
    db.session.add(message)
    db.session.commit()
    print(data['room'])

    emit("message",{'sender_id':data['sender_id'],'receiver_id':data['receiver_id'],'message':message.to_dict()}, room=data['room'])


@socketio.on("invitations")
def invitations(data):
    text=f'Invited you to a {data["game"]["name"]} game'
    emit("invitations",{'invitation':{'sender':data['sender'],'game':data['game'], 'text':text, 'hash': data['hash']}}, room=data['room'])

@socketio.on("confirmation")
def confirmation(data):
    emit("confirmation",{'sender_id':data['sender_id']}, room=data['room'])

@socketio.on("chatroom")
def game_chat(data):
    emit("chatroom",{'message':{'sender':data['sender'],'message':data['message']}}, room=data['room'])

@socketio.on("leave_game")
def leave_game(data):
    print('LEAVE GAME')
    emit("leave_game",{"leave_game":True, 'sender_id':data['sender_id']}, room=data['room'])

#### Fours ####

games={}

@socketio.on("start_game")
def start_game(data):
    room=data['room']

    games[room] = room
    emit("start_game",{}, room=data['room'])


@socketio.on("fours_move")
def fours_move(data):
    room=data['room']
    move = data['move']

    print(games[room])
    emit("fours_move",{}, room=data['room'])