#################### IMPORTS ####################
## DEPENDENCIES
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

## FILES
from .db import db


#################### CLASS ####################
class User(db.Model, UserMixin):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(40), nullable = False, unique = True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  hashed_password = db.Column(db.String(255), nullable = False)
  firstname = db.Column(db.String(40), nullable=True)
  lastname = db.Column(db.String(40), nullable=True)
  profile_photo = db.Column(db.String(255), nullable=True)

  friends_requested = db.relationship(
    "Friend",
    back_populates="requester",
    foreign_keys='Friend.request_id',
    cascade='all, delete-orphan'
  )

  friends_accepted = db.relationship(
    "Friend",
    back_populates="accepter",
    foreign_keys='Friend.accept_id',
    cascade='all, delete-orphan'
  )

  messages_sent = db.relationship(
    "Message",
    back_populates="sender",
    cascade='all, delete-orphan'
  )

  stats = db.relationship(
    "Stat",
    back_populates="user"
  )

  game_patterns = db.relationship(
    "GamePattern",
    back_populates="user"
  )

  @property
  def password(self):
    return self.hashed_password


  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)

  def to_dict(self):
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      'firstname' : self.firstname,
      'lastname' : self.lastname,
      'profile_photo' : self.profile_photo,
      'friends_requested' : [user.to_dict_basic() for user in self.friends_requested],
      'friends_accepted' : [user.to_dict_basic() for user in self.friends_accepted],
      'messages_sent' : [message.to_dict_basic() for message in self.messages_sent],
      'stats' : [game.to_dict() for game in self.stats],
    }

  def to_dict_basic(self):
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      'firstname' : self.firstname,
      'lastname' : self.lastname,
      'profile_photo' : self.profile_photo,
    }
