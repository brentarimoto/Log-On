#################### IMPORTS ####################
from flask import session
from flask_socketio import SocketIO, emit, join_room, leave_room
import os

from .models import db, Message, Stat, User, Friend
from .games import Fours
from .util import add_win, add_loss, add_tie, rank_up, rank_down, ranks

# Add after deploy
# from engineio.payload import Payload

# Payload.max_decode_packets = 500

# Setting origins variable to all when in dev, actual heroku app-url in production

#################### SETUP ####################
if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://log-on.herokuapp.com",
        "https://log-on.herokuapp.com"
    ]
else:
    origins = "*"

#################### SOCKET INSTANCE ####################
socketio = SocketIO(cors_allowed_origins=origins)

#################### REFERENCE DICTIONARIES ####################
online={}

games={}
rooms={}

#################### HELPER FUNCTIONS ####################



#################### SOCKETS ####################
@socketio.on("connect")
def connect():
    sender_id = int(session['_user_id'])
    if sender_id not in online:
        online[sender_id] = True


@socketio.on("disconnect")
def disconnect():
    sender_id = int(session['_user_id'])
    print('*******************DISCONNECT*******************', sender_id)
    if sender_id in online:
        online.pop(sender_id, None)
        friendships = Friend.query.filter((Friend.accept_id==sender_id) | (Friend.request_id==sender_id) & (Friend.accepted==True)).all()
        friend_ids = [friend.accept_id if friend.accept_id!=sender_id else friend.request_id for friend in friendships]
        online_friends = [friend_id for friend_id in friend_ids if friend_id in online]
        for friend_id in online_friends:
            emit('logoff', {'sender_id':sender_id}, include_self=False, room=f'User:{friend_id}')
        emit('disconnect', room=f'User:{sender_id}')



@socketio.on("logon")
def logon(data):
    print('*******************LOGON*******************')
    sender_id = int(session['_user_id'])
    room=data['room']
    join_room(room)

    friendships = Friend.query.filter((Friend.accept_id==sender_id) | (Friend.request_id==sender_id) & (Friend.accepted==True)).all()
    friend_ids = [friend.accept_id if friend.accept_id!=sender_id else friend.request_id for friend in friendships]
    online_friends = {friend_id:True for friend_id in friend_ids if friend_id in online}
    for friend_id in online_friends:
        emit('logon', {'sender_id':sender_id}, include_self=False, room=f'User:{friend_id}')
    emit('online', {'friends':online_friends}, room=f'User:{sender_id}')

@socketio.on("logoff")
def logoff():
    sender_id = int(session['_user_id'])
    print('*******************LOGOFF*******************', sender_id)
    if sender_id in online:
        online.pop(sender_id, None)
        friendships = Friend.query.filter((Friend.accept_id==sender_id) | (Friend.request_id==sender_id) & (Friend.accepted==True)).all()
        friend_ids = [friend.accept_id if friend.accept_id!=sender_id else friend.request_id for friend in friendships]
        online_friends = [friend_id for friend_id in friend_ids if friend_id in online]
        for friend_id in online_friends:
            emit('logoff', {'sender_id':sender_id}, include_self=False, room=f'User:{friend_id}')
        emit('disconnect', room=f'User:{sender_id}')



@socketio.on("online")
def on_join():
    sender_id = int(session['_user_id'])
    print('***********ONLINE*************', 'sender:', sender_id)
    friendships = Friend.query.filter((Friend.accept_id==sender_id) | (Friend.request_id==sender_id) & (Friend.accepted==True)).all()
    friend_ids = [friend.accept_id if friend.accept_id!=sender_id else friend.request_id for friend in friendships]
    online_friends = {friend_id:True for friend_id in friend_ids if friend_id in online}
    emit('online', {'friends':online_friends}, room=f'User:{sender_id}')


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

    emit("message",{'sender_id':data['sender_id'],'receiver_id':data['receiver_id'],'message':message.to_dict()}, room=data['room'])

@socketio.on("friend_request")
def friend_request(data):
    text=f'Invited sent you a Friend Request'
    emit("friend_request",{'friend_request':{'sender':data['sender'],'request':True, 'text':text, 'hash': f'FriendRequest:{data["sender"]["id"]}'}}, room=data['room'])

@socketio.on("accept_request")
def accept_request(data):
    accept_id=data['sender_id']
    request_id=data['friend_id']
    friendship = Friend.query.filter((Friend.accept_id==accept_id) & (Friend.request_id==request_id)).first()
    if not friendship.accepter or not friendship.requester:
        friendship = Friend.query.filter((Friend.accept_id==accept_id) & (Friend.request_id==request_id)).first()

    if friendship.accepter or friendship.requester:
        emit("accept_request",{'sender_id':accept_id, 'friendship':friendship.to_dict_accepted()}, room=data['room'])

@socketio.on("unfriend")
def unfriend(data):
    print('***********UNFRIEND*************')
    emit("unfriend",{'sender_id':data['sender_id']}, room=data['room'])


@socketio.on("invitations")
def invitations(data):
    text=f'Invited you to a {data["game"]["name"]} game'
    emit("invitations",{'invitation':{'sender':data['sender'],'game':data['game'], 'text':text, 'hash': data['hash']}}, room=data['room'])

@socketio.on("chatroom")
def game_chat(data):
    room=data['room']
    print(data['sender'])
    emit("chatroom",{'message':{'sender':data['sender'],'message':data['message']}, 'room':room}, room=room)


#################### FOURS ####################

def fours_result_win_loss(winner, loser):
    statWinner = Stat.query.filter((Stat.user_id==winner) & (Stat.game_id==1)).first()
    if not statWinner:
        statWinner = Stat(user_id=winner, game_id=1, times_played=1, wins=1, losses=0, ties=0, rank='Cardboard', points=10)
        db.session.add(statWinner)
    else:
        add_win(statWinner)

    statLoser = Stat.query.filter((Stat.user_id==loser) & (Stat.game_id==1)).first()
    if not statLoser:
        statLoser = Stat(user_id=loser, game_id=1, times_played=1, wins=0, losses=1, ties=0, rank='Cardboard', points=0)
        db.session.add(statLoser)
    else:
        add_loss(statLoser)
    db.session.commit()

    return [statWinner, statLoser]


@socketio.on("join_fours")
def join_fours(data):
    room=data['room']
    opponent=data.get('opponent',None)

    if not rooms.get(room) and not opponent:
        join_room(room)
        rooms[room]=[data['sender_id']]
    elif not rooms.get(room) and opponent:
        text = 'The game you were trying to join does not exist!'
        emit("join_fours",{'error':{'text':text, 'hash':f'User:{data["sender_id"]}'}}, room=f'User:{data["sender_id"]}')
    elif rooms.get(room) and len(rooms.get(room))<2:
        join_room(room)
        rooms[room].append(data['sender_id'])
        emit("join_fours",{'sender_id':data['sender_id']}, room=data['room'])
    elif not len(rooms.get(room))<2:
        text = 'The game you were trying to join was full!'
        emit("join_fours",{'error':{'text':text, 'hash':f'User:{data["sender_id"]}'}}, room=f'User:{data["sender_id"]}')

@socketio.on("leave_fours")
def leave_fours(data):
    room=data['room']
    if room!='home':
        if (data['sender_id'] in rooms[room]):
            rooms[room].remove(data['sender_id'])
        if len(rooms[room])<=0:
            rooms.pop(room, None)
    leave_room(room)

@socketio.on("start_game")
def start_game(data):
    ## Variables ##
    room=data['room']
    p1=data['p1']
    p2=data['p2']

    ## Game Create ##
    games[room] = Fours(p1, p2)

    # Emit Result
    emit("start_game",{'sender_id':p1, 'gamestart':True}, room=data['room'])

@socketio.on("reset_game")
def reset_game(data):
    ## Variables ##
    room=data['room']
    sender_id=data['sender_id']
    game=games[room]

    ## Game Reset ##
    game.reset_game()

    # Emit Result
    emit("reset_game",{'sender_id':sender_id, 'reset':True}, room=data['room'])

@socketio.on("leave_game")
def leave_game(data):
    room=data['room']
    if data['sender_id'] in rooms[room]:
        res={'sender_id':data['sender_id']}
        if games.get(room):
            game=games.get(room)
            if not game.win or not game.tie:
                winner = game.p1 if game.p1!=data['sender_id'] else game.p2
                loser = data['sender_id']
                statWinner, statLoser = fours_result_win_loss(winner, loser)
                res['winnerStats']=statWinner.to_dict()
                res['loserStats']=statLoser.to_dict()
                res['loser']=loser
            games.pop(room, None)
        emit("leave_game",res, room=data['room'])

@socketio.on("fours_move")
def fours_move(data):
    ## Variables ##
    room=data['room']
    game=games[room]
    column = data['column']
    player = data['sender_id']

    ## Game Move ##
    result = game.make_move(player, int(column))

    ## Results ##
    res={}


    # Win Result
    if result.get('win'):
        winner=result['winner']
        loser = game.p1 if game.p1!=result['winner'] else game.p2

        res['winner']=winner
        res['loser'] = loser
        statWinner, statLoser = fours_result_win_loss(winner, loser)

        res['winnerStats']=statWinner.to_dict()
        res['loserStats']=statLoser.to_dict()

    if result.get('tie'):
        res['tie']=True
        p1Stat = Stat.query.filter((Stat.user_id==game.p1) & (Stat.game_id==1)).first()
        if not p1Stat:
            p1Stat = Stat(user_id=game.p1, game_id=1, times_played=1, wins=0, losses=0, ties=1, rank='Cardboard', points=5)
            db.session.add(p1Stat)
        else:
            add_tie(p1Stat)

        p2Stat = Stat.query.filter((Stat.user_id==game.p2) & (Stat.game_id==1)).first()
        if not p2Stat:
            p2Stat = Stat(user_id=game.p2, game_id=1, times_played=1, wins=0, losses=0, ties=1, rank='Cardboard', points=5)
            db.session.add(p2Stat)
        else:
            add_tie(p2Stat)
        db.session.commit()

        res['p1Stats']=p1Stat.to_dict()
        res['p2Stats']=p2Stat.to_dict()
        res['p1']=game.p1
        res['p2']=game.p2

    if result.get('move'):
        res['move']=result['move']
        res['player']=player

    # Emit Result
    emit("fours_move",res, room=data['room'])