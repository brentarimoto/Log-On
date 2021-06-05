#################### IMPORTS ####################
## DEPENDENCIES
from flask import Blueprint, jsonify, session
from flask_login import login_required

## FILES
from app.models import db, User


#################### SETUP ####################
search_routes = Blueprint('search', __name__)


#################### ROUTES ####################

@search_routes.route('/<value>')
@login_required
def search(value):
    users = User.query.filter(User.username.ilike(f'{value}%') | User.email.ilike(f'{value}%')).limit(10).all()
    return {"users": [user.to_dict_basic() for user in users]}

@search_routes.route('/user/<int:user_id>')
@login_required
def search_user(user_id):
    user = User.query.get(user_id)
    return {"user": user.to_dict()}
