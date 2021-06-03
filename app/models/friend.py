#################### IMPORTS ####################
## FILES
from .db import db


#################### CLASS ####################
class Friend(db.Model):
  __tablename__ = 'friends'

  id = db.Column(db.Integer, primary_key = True)
  request_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  accept_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  accepted = db.Column(db.Boolean, nullable = False, default = False)

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
    back_populates="friendship"
  )

  def to_dict(self):
    return {
      "id": self.id,
      "request_id": self.request_id,
      "accept_id": self.accept_id,
      'accepted' : self.accepted,
      'requester' : self.requester.to_dict(),
      'accepter' :self.accepter.to_dict(),
      'messages' : [message.to_dict_basic() for message in self.messages],
    }

  def to_dict_basic(self):
    return {
      "id": self.id,
      "request_id": self.request_id,
      "accept_id": self.accept_id,
      'accepted' : self.accepted,
    }
