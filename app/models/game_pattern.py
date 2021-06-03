#################### IMPORTS ####################
## FILES
from .db import db


#################### CLASS ####################
class GamePattern(db.Model):
  __tablename__ = 'game_patterns'

  id = db.Column(db.Integer, primary_key = True)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)
  previous_move = db.Column(db.String(255), nullable=True, default=0)
  next_move = db.Column(db.String(255), nullable=True, default=0)

  user = db.relationship(
    "User",
    back_populates="game_patterns"
  )

  game = db.relationship(
    "Game",
    back_populates="player_patterns"
  )

  def to_dict(self):
    return {
      "id": self.id,
      "user_id": self.user_id,
      "game_id": self.game_id,
      'previous_moves' : self.previous_move,
      'next_move' : self.next_move,
      'user' : self.user.to_dict_basic(),
      'game' : self.game.to_dict_basic(),
    }

  def to_dict_basic(self):
    return {
      "id": self.id,
      "user_id": self.user_id,
      "game_id": self.game_id,
      'previous_moves' : self.previous_move,
      'next_move' : self.next_move
    }
