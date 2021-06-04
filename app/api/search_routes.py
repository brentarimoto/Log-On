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
    users = User.query.filter(User.firstname.ilike(f'{value}%') | User.lastname.ilike(f'{value}%') | User.username.ilike(f'{value}%') | User.email.ilike(f'{value}%')).limit(10).all()
    return {"users": [user.to_dict() for user in users]}
