#################### IMPORTS ####################
## DEPENDENCIES
from datetime import datetime

## FILES
from .db import db


#################### CLASS ####################
class Message(db.Model):
  __tablename__ = 'messages'

  id = db.Column(db.Integer, primary_key = True)
  sender_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  friend_id = db.Column(db.Integer, db.ForeignKey("friends.id"), nullable=False)
  message = db.Column(db.Text, nullable = False)
  created_at=db.Column(db.DateTime(timezone=True), default=datetime.now())

  sender = db.relationship(
    "User",
    back_populates="messages_sent"
  )

  friendship = db.relationship(
    "Friend",
    back_populates="messages"
  )

  def to_dict(self):
    return {
      "id": self.id,
      "sender_id": self.sender_id,
      "friend_id": self.friend_id,
      'message' : self.message,
      'created_at' : str(self.created_at),
      'sender' : self.sender.to_dict(),
      'friendship' :self.friendship.to_dict_basic(),
    }

  def to_dict_basic(self):
    return {
      "id": self.id,
      "sender_id": self.sender_id,
      "friend_id": self.friend_id,
      'message' : self.message,
      'created_at' : str(self.created_at),
    }
