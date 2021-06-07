#################### IMPORTS ####################
## DEPENDENCIES
from flask import Blueprint, jsonify
from flask_login import login_required

## FILES
from app.models import db, Game


#################### SETUP ####################
games_routes = Blueprint('games', __name__)


#################### ROUTES ####################
@games_routes.route('/')
# @login_required
def get_games():
    games = Game.query.all()
    return {"games": {game.id:{'info':game.to_dict(),'invitations':{}} for game in games}}
