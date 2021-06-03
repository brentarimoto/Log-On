#################### IMPORTS ####################
import random
from faker import Faker

from app.models import db, User, Friend, Message


#################### FUNCTIONS ####################

# Seeds DirectMessage Data
def seed_messages():

    fake = Faker()

    user_count = len(User.query.all())

    messages = [
        {'sender_id': 1, 'friend_id': 1, "message": 'Rapidash?'},
        {'sender_id': 2, 'friend_id': 1, "message": 'Rapidash'},
    ]

    for _ in range(100):
        sender_id=None
        friends=[]

        while not friends:
            sender_id = random.randint(1,user_count)
            friends = Friend.query.filter((Friend.request_id==sender_id) | (Friend.accept_id==sender_id)).all()

        messages.append(
            {'sender_id': sender_id,
            'friend_id': random.choice(friends).id,
            'message': fake.sentence(nb_words=random.randint(1,15))}
        )

    for message in messages:
        load_message = Message(sender_id=message['sender_id'], friend_id=message['friend_id'], message=message['message'])
        db.session.add(load_message)


    db.session.commit()

# Uses a raw SQL query to TRUNCATE the direct_messages table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_messages():
    db.session.execute('TRUNCATE messages RESTART IDENTITY CASCADE;')
    db.session.commit()
