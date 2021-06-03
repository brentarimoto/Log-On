#################### IMPORTS ####################
## DEPENDENCIES
from flask import Blueprint, jsonify
from flask_login import login_required

## FILES
from app.models import Friend


#################### SETUP ####################
friends_routes = Blueprint('friends', __name__)


#################### ROUTES ####################

@friends_routes.route('/<int:user_id>')
@login_required
def get_friends(user_id):
    friends = Friend.query.filter((Friend.accepted==True) & ((Friend.request_id==user_id) | (Friend.accept_id==user_id))).all()
    return {'friends': [friend.to_dict() for friend in friends]}
