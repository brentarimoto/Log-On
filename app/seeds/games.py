#################### IMPORTS ####################
from app.models import db, Game


#################### FUNCTIONS ####################

# Seeds Game Data
def seed_games():

    games = [
        {'name': 'Fours'},
    ]

    for game in games:
        load_game = Game(name=game['name'])
        db.session.add(load_game)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the games table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_games():
    db.session.execute('TRUNCATE games RESTART IDENTITY CASCADE;')
    db.session.commit()
