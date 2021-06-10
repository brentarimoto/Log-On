ranks=['Cardboard','Iron','Bronze','Silver','Gold', 'Platinum', 'Diamond', 'Master', 'Kami']

def rank_up(item):
    i = ranks.index(item.rank)
    change = i+1 if i+1<9 else 8
    item.rank=ranks[change]

def rank_down(item):
    i = ranks.index(item.rank)
    change = i-1 if i-1>=0 else 0
    item.rank=ranks[change]

def add_win(item):
    item.times_played+=1
    item.wins+=1
    item.points+=10
    if item.points>=100:
        if item.rank=='Kami':
            item.points=100
        else:
            item.points-=100
            rank_up(item)
            return True
    return False

def add_loss(item):
    item.times_played+=1
    item.losses+=1
    item.points-=10
    if -10<item.points<0:
        item.points=0
    elif item.points<=-10:
        if item.rank=='Cardboard':
            item.points=0
        else:
            item.points=90
            rank_down(item)
            return True
    return False