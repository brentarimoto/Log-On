#################### IMPORTS ####################
## FILES
from .db import db

ranks=['Cardboard','Iron','Bronze','Silver','Gold', 'Platinum', 'Diamond', 'Master', 'Kami']

#################### CLASS ####################
class Stat(db.Model):
  __tablename__ = 'stats'

  id = db.Column(db.Integer, primary_key = True)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)
  times_played = db.Column(db.Integer, nullable=True, default=0)
  wins = db.Column(db.Integer, nullable=True, default=0)
  losses = db.Column(db.Integer, nullable=True, default=0)
  ties = db.Column(db.Integer, nullable=True, default=0)
  rank = db.Column(db.String(40), nullable=True, default='Cardboard')
  points = db.Column(db.Integer, nullable=True, default=0)

  user = db.relationship(
    "User",
    back_populates="stats"
  )

  game = db.relationship(
    "Game",
    back_populates="stats"
  )


  def to_dict(self):
    return {
      "id": self.id,
      "user_id": self.user_id,
      "game_id": self.game_id,
      'times_played' : self.times_played,
      'wins' : self.wins,
      'losses' : self.losses,
      'ties' : self.ties,
      'rank' : self.rank,
      'points' : self.points,
      'user' : self.user.to_dict_basic(),
      'game' : self.game.to_dict_basic(),
    }

  def to_dict_basic(self):
    return {
      "id": self.id,
      "user_id": self.user_id,
      "game_id": self.game_id,
      'times_played' : self.times_played,
      'wins' : self.wins,
      'losses' : self.losses,
      'ties' : self.ties,
      'rank' : self.rank,
      'points' : self.points,
    }
