#################### CLASS ####################
class Board:
    def __init__(self):
        self.grid= self.build_grid()

    #### GRID ####
    def build_grid(self):
        grid={}
        for i in range(7):
            grid[i]=[]
        return grid

    def reset_grid(self):
        grid={}
        for i in range(7):
            grid[i]=[]
        self.grid = grid

    #### MOVES ####
    def move(self, player, column):
        self.grid[column].append(player)
        return (column, len(self.grid[column])-1)

    def move_with_check(self, player, column):
        self.grid[column].append(player)
        return (column, len(self.grid[column])-1)

    #### CHECKS ####

    # FULL
    def column_full(self, column):
        return len(self.grid[column])>=6

    # FULLBOARD
    def board_full(self):
        for key in self.grid:
            if len(self.grid[key])<6:
                return False
        return True


    # COLUMN WIN
    def column_win(self, column):
        length = len(self.grid[column])
        if(length<4):
            return False

        if len(set(self.grid[column][length-4:length]))>1:
            return False

        return True

    # ROW WIN
    def row_win(self, player, column):
        row = len(self.grid[column])-1

        row_win = [player]

        for i in range(column-1,-1, -1):
            if len(self.grid[i])>row and self.grid[i][row]==player:
                row_win.append(self.grid[i][row])
            else:
                break
            if len(row_win)>=4:
                break

        for i in range(column+1,7):
            if len(self.grid[i])>row and self.grid[i][row]==player:
                row_win.append(self.grid[i][row])
            else:
                break
            if len(row_win)>=4:
                break

        if len(row_win)<4:
            return False
        else:
            return True

    # DIAGONAL WIN SOUTHWEST TO NORTHEAST
    def diagonal_win(self, player, column, isUp, move):
        row = len(self.grid[column])-1

        row_win = [player]

        start=row
        n = -1 if isUp else 1
        for i in range(column-1,-1, -1):
            start+=n
            print(move,'IN FIRST', start)
            if 0>start or start>5:
                break
            if len(self.grid[i])>start and self.grid[i][start]==player:
                row_win.append(self.grid[i][start])
            else:
                break
            if len(row_win)>=4:
                break
        print('IN BETWEEN')

        start=row
        n = 1 if isUp else -1
        for i in range(column+1,7):
            start+=n
            print(move,'IN SECOND', start)
            if 0>start or start>5:
                break
            if len(self.grid[i])>start and self.grid[i][start]==player:
                row_win.append(self.grid[i][start])
            else:
                break
            if len(row_win)>=4:
                break

        if len(row_win)<4:
            return False
        else:
            return True


    # PRINT
    def __repr__(self):
        return f'<Board {self.grid}>'
