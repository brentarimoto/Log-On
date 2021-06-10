#################### IMPORTS ####################
from .Board import Board

#################### CLASS ####################
class Fours:
    def __init__(self, p1, p2):
        self.p1 = p1
        self.p2 = p2
        self.score= self.make_score(p1,p2)
        self.turn = p1
        self.move_count = 0
        self.win = False
        self.board = Board()


    #### Make Score ####
    def make_score(self, p1, p2):
        dictionary={}
        dictionary[p1]=0
        dictionary[p2]=0
        return dictionary


    #### Reset ####
    def reset_game(self):
        self.win=False
        self.board.reset_grid()


    #### Move ####
    def make_move(self, player, column):
        if player!= self.turn:
            return {'error':'Not Correct Turn', 'error_code':'t'}

        if self.win:
            return {'error':'Game Over', 'error_code':'o'}

        if self.board.column_full(column):
            return {'error':'Grid Full', 'error_code':'f'}

        move = self.board.move(player, column)
        self.turn= self.p1 if self.turn!=self.p1 else self.p2
        self.move_count+=1

        if self.move_count>=7:
            win_status = self.check_win(player, column)
            if win_status:
                self.win=True
                self.score[player]+=1
                return {'move':move, 'win':True, 'winner':player}

        return {'move':move}


    #### Check Game Status ####
    def check_win(self, player, column):
        if self.board.column_win(column):
            return True

        if self.board.row_win(player, column):
            return True

        # if self.diagonal_win


    #### Print ####
    def __repr__(self):
        return f'<Fours {self.score}>'
