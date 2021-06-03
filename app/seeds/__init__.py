#################### IMPORTS ####################
from flask.cli import AppGroup
from .users import seed_users, undo_users
from .friends import seed_friends, undo_friends
from .messages import seed_messages, undo_messages
from .games import seed_games, undo_games
from .stats import seed_stats, undo_stats



#################### SETUP ####################
# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


#################### COMMANDS ####################
# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_friends()
    seed_messages()
    seed_games()
    seed_stats()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_stats()
    undo_games()
    undo_messages()
    undo_friends()
    undo_users()

# Creates the `flask seed run` command meant to run all commands in one command
@seed_commands.command('run')
def ua():
    undo_stats()
    undo_games()
    undo_messages()
    undo_friends()
    undo_users()
    seed_users()
    seed_friends()
    seed_messages()
    seed_games()
    seed_stats()