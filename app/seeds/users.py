#################### IMPORTS ####################
from faker import Faker
import requests
import random

from app.models import db, User


#################### FUNCTIONS ####################

def randPoke():
    num = random.randint(0,500)
    pokemon = requests.get(f'https://pokeapi.co/api/v2/pokemon/{num}').json()
    if pokemon['sprites']['other']['dream_world']['front_default']:
        return pokemon['sprites']['other']['dream_world']['front_default']
    else:
        return pokemon['sprites']['front_default']

def jessePoke():
    pokemon = requests.get(f'https://pokeapi.co/api/v2/pokemon/78').json()
    if pokemon['sprites']['other']['dream_world']['front_default']:
        return pokemon['sprites']['other']['dream_world']['front_default']
    else:
        return pokemon['sprites']['front_default']


# Seeds User Data
def seed_users():

    fake = Faker()

    users = [
        {'username':'Demo', 'email':'demo@aa.io', 'password':'password','firstname':'Demo','lastname':'Demo','profile_photo':randPoke()},
        {'username':'pokewong_go', 'email':'jesse@wong.com', 'password':'password','firstname':'Jesse','lastname':'Wong','profile_photo':jessePoke()},
        {'username':'super_smash_brads', 'email':'brad@simpson.com', 'password':'password','firstname':'Brad','lastname':'Simpson','profile_photo':randPoke()},
        {'username':'senyo_cards_to_the_graveyard', 'email':'senyo@agawu.com', 'password':'password','firstname':'Senyo','lastname':'Agawu','profile_photo':randPoke()},
        {'username':'jesse_zee_game_ez_life', 'email':'jesse@warren.com', 'password':'password','firstname':'Jesse','lastname':'Warren','profile_photo':randPoke()},
        {'username':'chris_oneywan_kenobi', 'email':'chris@oney.com', 'password':'password','firstname':'Chris','lastname':'Oney','profile_photo':randPoke()},
        {'username':'wingardium_oliviosa', 'email':'olivia@byrnes.com', 'password':'password','firstname':'Olivia','lastname':'Byrnes','profile_photo':randPoke()},
        {'username':'await_dispatch(JM)', 'email':'JM@alan.com', 'password':'password','firstname':'JM','lastname':'Alan','profile_photo':randPoke()},
        {'username':'extremely_famous_person', 'email':'famous@person.com', 'password':'password', 'firstname':None, 'lastname':None,'profile_photo':randPoke()},
    ]

    for _ in range(50):
        users.append({'username':fake.user_name(),
        'email':fake.free_email(),
        'password':fake.password(length=10),
        'firstname':fake.first_name(),
        'lastname':fake.last_name(),
        'profile_photo':randPoke()})

    for user in users:
        load_user = User(username=user['username'], email=user['email'], password=user['password'], firstname=user['firstname'], lastname=user['lastname'], profile_photo=user['profile_photo'])
        db.session.add(load_user)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
