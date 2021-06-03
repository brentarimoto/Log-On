#################### IMPORTS ####################
## FILES
from .db import db


#################### CLASS ####################
class Game(db.Model):
  __tablename__ = 'games'

  id = db.Column(db.Integer, primary_key = True)
  name = db.Column(db.String(255), nullable=False)

  stats = db.relationship(
    "Stat",
    back_populates="game"
  )

  player_patterns = db.relationship(
    "GamePattern",
    back_populates="game"
  )

  def to_dict(self):
    return {
      "id": self.id,
      "name": self.name,
    }

  def to_dict_basic(self):
    return {
      "id": self.id,
      "name": self.name,
    }
