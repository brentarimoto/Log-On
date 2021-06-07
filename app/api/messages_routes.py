#################### IMPORTS ####################
## DEPENDENCIES
from flask import Blueprint, jsonify, session
from flask_login import login_required

## FILES
from app.models import db, Message


#################### SETUP ####################
messages_routes = Blueprint('messages', __name__)


#################### ROUTES ####################

@messages_routes.route('/<int:friendship_id>')
@login_required
def message(friendship_id):
    messages = Message.query.filter(Message.friend_id==int(friendship_id)).all()
    return {"messages": {f'{message.id}':message.to_dict() for message in messages}}