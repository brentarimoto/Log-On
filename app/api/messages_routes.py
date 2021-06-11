#################### IMPORTS ####################
## DEPENDENCIES
from flask import Blueprint, jsonify, session
from flask_login import login_required

## FILES
from app.models import db, Message, Friend


#################### SETUP ####################
messages_routes = Blueprint('messages', __name__)


#################### ROUTES ####################

@messages_routes.route('/')
@login_required
def all_messages():
    friendships = Friend.query.filter((Friend.accept_id==int(session['_user_id'])) | (Friend.request_id==int(session['_user_id']))).all()
    message_friendships = [friendship for friendship in friendships if len(friendship.messages)>0]
    friend_ids = [friendship.accept_id if (friendship.accept_id!=int(session['_user_id'])) else friendship.request_id for friendship in message_friendships]

    return {"messages": {friend_id:{} for friend_id in friend_ids}}

@messages_routes.route('/<int:friendship_id>')
@login_required
def message(friendship_id):
    messages = Message.query.filter(Message.friend_id==int(friendship_id)).all()
    return {"messages": {f'{message.id}':message.to_dict() for message in messages}}