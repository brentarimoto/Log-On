#################### IMPORTS ####################
## DEPENDENCIES
from flask import Blueprint, jsonify, session
from flask_login import login_required

## FILES
from app.models import db, Friend


#################### SETUP ####################
friends_routes = Blueprint('friends', __name__)


#################### ROUTES ####################

@friends_routes.route('/<int:user_id>')
@login_required
def get_friends(user_id):
    friends = Friend.query.filter((Friend.accepted==True) & ((Friend.request_id==user_id) | (Friend.accept_id==user_id))).all()
    return {'friends': [friend.to_dict() for friend in friends]}


@friends_routes.route('/<int:friend_id>', methods=['DELETE'])
@login_required
def delete_friends(friend_id):
    id=None;
    friendship = Friend.query.get(friend_id)
    if friendship.requester.id!=int(session['_user_id']):
        friendship.accepted=False
        id=friendship.requester.id
    else:
        id=friendship.accepter.id
        db.session.delete(friendship)
    db.session.commit()
    print(id)

    return {'friend_id': id}
