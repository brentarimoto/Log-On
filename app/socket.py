from flask import session
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from .models import db, Message, Stat, User
from .games import Fours
from .util import add_win, add_loss, add_tie, rank_up, rank_down, ranks

# Add after deploy
# from engineio.payload import Payload

# Payload.max_decode_packets = 500

# Setting origins variable to all when in dev, actual heroku app-url in production

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://log-on.herokuapp.com",
        "https://log-on.herokuapp.com"
    ]
else:
    origins = "*"

# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)

# create games container
games={}


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


@socketio.on("invitations")
def invitations(data):
    text=f'Invited you to a {data["game"]["name"]} game'
    emit("invitations",{'invitation':{'sender':data['sender'],'game':data['game'], 'text':text, 'hash': data['hash']}}, room=data['room'])

@socketio.on("confirmation")
def confirmation(data):
    print('*****************Confirmation********************')
    emit("confirmation",{'sender_id':data['sender_id']}, room=data['room'])

@socketio.on("chatroom")
def game_chat(data):
    room=data['room']
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
    print('*****************Leave Game********************')
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