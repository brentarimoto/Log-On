#################### IMPORTS ####################
## DEPENDENCIES
from flask import Blueprint, jsonify, session, request
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


@friends_routes.route('/<int:user_id>', methods=['POST'])
@login_required
def send_request(user_id):
    friendship = Friend.query.filter((Friend.request_id==session['_user_id']) & (Friend.accept_id==user_id)).first()

    if friendship:
        return {'errors':['Request already exists']},409

    friend = Friend(
        request_id=session['_user_id'],
        accept_id=user_id,
    )
    db.session.add(friend)
    db.session.commit()
    return {'user': friend.accepter.to_dict()}


@friends_routes.route('/<int:user_id>', methods=['PATCH'])
@login_required
def decline_request(user_id):
    friend = Friend.query.filter((Friend.accept_id==session['_user_id']) & (Friend.request_id==user_id)).first()

    if not friend:
        return {'errors':['Not a friend.']}, 400


    if friend.accepted:
        return {'errors':['Already a friend.']}, 400

    friend.declined=True
    db.session.commit()
    return {'user': friend.requester.to_dict()}



@friends_routes.route('/<int:user_id>', methods=['PUT'])
@login_required
def request_decision(user_id):
    friend = Friend.query.filter((Friend.accept_id==session['_user_id']) & (Friend.request_id==user_id)).first()

    if not friend:
        return {'errors':['Not a friend.']}, 400


    if friend.accepted:
        return {'errors':['Already a friend.']}, 400

    if request.json['version']=='accepted':
        friend.accepted=True
        db.session.commit()
        return {'friend': friend.to_dict()}
    else:
        friend.declined=True
        db.session.commit()
        return {'user':friend.requester.to_dict()}

@friends_routes.route('/<int:friend_id>', methods=['DELETE'])
@login_required
def delete_friend(friend_id):
    user=None;
    friendship = Friend.query.get(friend_id)
    if friendship.requester.id!=int(session['_user_id']):
        friendship.accepted=False
        user=friendship.requester
    else:
        user=friendship.accepter
        db.session.delete(friendship)
    db.session.commit()

    return {'user': user.to_dict()}
