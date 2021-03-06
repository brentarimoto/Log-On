#################### IMPORTS ####################
import random
from faker import Faker

from app.models import db, User, Game, Stat


#################### FUNCTIONS ####################

# Seeds Stat Data
def seed_stats():

    fake = Faker()

    users= User.query.all()
    game_count = len(Game.query.all())

    stats = [
        {'user_id': 1,
        'game_id': 1,
        'times_played': 11,
        'wins': 9,
        'losses': 1,
        'ties': 2,
        'rank': 'Cardboard',
        'points': 90,},
    ]

    users=[user for user in users if user.id!=1]

    for _ in range(40):
        user = random.choice(users)
        user_id = user.id
        users.remove(user)
        game_id = random.randint(1,game_count)
        times_played=random.randint(1,75)
        wins=random.randint(1,times_played)

        value=times_played-wins if times_played-wins>=1 else 0

        losses=random.randint(1,value) if value else 0
        ties=value-losses if value-losses>=1 else 0
        total_points = (wins*10)+(ties*5)-(losses*10);
        total_points = total_points if total_points>=0 else 0
        number_ranks = 0;
        while total_points>=100:
            total_points-=100
            number_ranks+=1
        points=total_points;
        rank = ['Cardboard','Iron','Bronze','Silver','Gold', 'Platinum', 'Diamond', 'Master', 'Kami'][number_ranks]

        stats.append(
            {'user_id': user_id,
            'game_id': game_id,
            'times_played': times_played,
            'wins': wins,
            'losses': losses,
            'ties': ties,
            'rank': rank,
            'points': points,}
        )

    for stat in stats:
        load_stat = Stat(
                    user_id=stat['user_id'],
                    game_id=stat['game_id'],
                    times_played=stat['times_played'],
                    wins=stat['wins'],
                    losses=stat['losses'],
                    ties=stat['ties'],
                    rank=stat['rank'],
                    points=stat['points'],)
        db.session.add(load_stat)


    db.session.commit()

# Uses a raw SQL query to TRUNCATE the stats table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key
def undo_stats():
    db.session.execute('TRUNCATE stats RESTART IDENTITY CASCADE;')
    db.session.commit()
