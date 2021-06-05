#################### IMPORTS ####################
import random
from faker import Faker

from app.models import db, User, Friend


#################### FUNCTIONS ####################

# Seeds Friend Data
def seed_friends():

    fake = Faker()

    user_count = len(User.query.all())

    friends = [
        {'request_id': 1, 'accept_id': 2, 'accepted': True},
        {'request_id': 3, 'accept_id': 1, 'accepted': False, 'declined':False},
        {'request_id': 1, 'accept_id': 4, 'accepted': True},
        {'request_id': 1, 'accept_id': 5, 'accepted': True},
        {'request_id': 1, 'accept_id': 6, 'accepted': True},
        {'request_id': 1, 'accept_id': 7, 'accepted': True},
        {'request_id': 1, 'accept_id': 8, 'accepted': True},
        {'request_id': 1, 'accept_id': 9, 'accepted': False, 'declined':True},
    ]

    for _ in range(200):
        request_id = random.randint(1,user_count)
        accept_id = random.randint(1,user_count)

        array=[friend for friend in friends if (friend['request_id']==request_id and friend['accept_id']==accept_id) or (friend['request_id']==accept_id and friend['accept_id']==request_id)]

        if not array:
            friends.append(
                {'request_id': request_id,
                'accept_id': accept_id,
                'accepted': True if random.randint(1,20)!=1 else False}
            )

    for friend in friends:
        load_friend = Friend(request_id=friend['request_id'], accept_id=friend['accept_id'], accepted=friend['accepted'])
        db.session.add(load_friend)


    db.session.commit()

# Uses a raw SQL query to TRUNCATE the friends table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_friends():
    db.session.execute('TRUNCATE friends RESTART IDENTITY CASCADE;')
    db.session.commit()
