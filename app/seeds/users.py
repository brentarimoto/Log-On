#################### IMPORTS ####################
from faker import Faker

from app.models import db, User


#################### FUNCTIONS ####################

# Seeds User Data
def seed_users():

    fake = Faker()

    users = [
        {'username':'Demo', 'email':'demo@aa.io', 'password':'password','firstname':'Demo','lastname':'Demo',},
        {'username':'pokewong_go', 'email':'jesse@wong.com', 'password':'password','firstname':'Jesse','lastname':'Wong',},
        {'username':'super_smash_brads', 'email':'brad@simpson.com', 'password':'password','firstname':'Brad','lastname':'Simpson',},
        {'username':'senyo_cards_to_the_graveyard', 'email':'senyo@agawu.com', 'password':'password','firstname':'Senyo','lastname':'Agawu',},
        {'username':'jesse_zee_game_ez_life', 'email':'jesse@warren.com', 'password':'password','firstname':'Jesse','lastname':'Warren',},
        {'username':'chris_oneywan_kenobi', 'email':'chris@oney.com', 'password':'password','firstname':'Chris','lastname':'Oney',},
        {'username':'wingardium_oliviosa', 'email':'olivia@byrnes.com', 'password':'password','firstname':'Olivia','lastname':'Byrnes',},
        {'username':'await_dispatch(JM)', 'email':'JM@alan.com', 'password':'password','firstname':'JM','lastname':'Alan',},
        {'username':'extremely_famous_person', 'email':'famous@person.com', 'password':'password', 'firstname':None, 'lastname':None},
    ]

    for _ in range(50):
        users.append({'username':fake.user_name(),
        'email':fake.free_email(),
        'password':fake.password(length=10),
        'firstname':fake.first_name(),
        'lastname':fake.last_name()})

    for user in users:
        load_user = User(username=user['username'], email=user['email'], password=user['password'], firstname=user['firstname'], lastname=user['lastname'])
        db.session.add(load_user)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
