#################### IMPORTS ####################
## DEPENDENCIES
from flask import session
## FILES
from .db import db


#################### CLASS ####################
class Friend(db.Model):
  __tablename__ = 'friends'

  id = db.Column(db.Integer, primary_key = True)
  request_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  accept_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  accepted = db.Column(db.Boolean, nullable = False, default = False)
  declined = db.Column(db.Boolean, nullable = False, default = False)

  requester = db.relationship(
    "User",
    back_populates="friends_requested",
    foreign_keys=[request_id]
  )

  accepter = db.relationship(
    "User",
    back_populates="friends_accepted",
    foreign_keys=[accept_id]
  )

  messages = db.relationship(
    "Message",
    back_populates="friendship",
    cascade='all, delete-orphan',
  )


  def to_dict(self):
    return {
      "id": self.id,
      "request_id": self.request_id,
      "accept_id": self.accept_id,
      'accepted' : self.accepted,
      'declined' : self.declined,
      'requester' : self.requester.to_dict() if self.requester.id!=int(session['_user_id']) else None,
      'accepter' : self.accepter.to_dict() if self.accepter.id!=int(session['_user_id']) else None,
      'last_message' : [message.to_dict() for message in self.messages if self.messages.index(message)==len(self.messages)-1],
    }


  def to_dict_accepted(self):
    return {
      "id": self.id,
      "request_id": self.request_id,
      "accept_id": self.accept_id,
      'accepted' : self.accepted,
      'declined' : self.declined,
      'requester' : self.requester.to_dict() if self.requester.id==int(session['_user_id']) else None,
      'accepter' : self.accepter.to_dict() if self.accepter.id==int(session['_user_id']) else None,
      'last_message' : [message.to_dict() for message in self.messages if self.messages.index(message)==len(self.messages)-1],
    }

  def to_dict_basic(self):
    return {
      "id": self.id,
      "request_id": self.request_id,
      "accept_id": self.accept_id,
      'accepted' : self.accepted,
      'declined' : self.declined,
    }
