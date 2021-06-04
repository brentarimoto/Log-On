/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_FRIENDS = "friends/SET_FRIENDS";

const REMOVE_FRIEND = "friends/REMOVE_FRIEND";

/*************************** ACTIONS ***************************/
const setFriends = (friends) => ({
    type: SET_FRIENDS,
    friends,
});


const removeFriend = (friend_id) => ({
    type: REMOVE_FRIEND,
    friend_id,
});


/*************************** THUNKS ***************************/
export const getFriends = (userId) => async (dispatch) => {
    const response = await fetch(`/api/friends/${userId}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.errors) {
        return;
    }

    const friendsObj ={};

    data.friends.forEach((friendship)=>{
      const friend = friendship.requester ? friendship.requester : friendship.accepter
      friendsObj[friend.id] = friendship
    })

    dispatch(setFriends(friendsObj))
}


export const unFriend = (id) => async (dispatch) => {
    const response = await fetch(`/api/friends/${id}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();

    if (data.errors) {
        return;
    }

    console.log(data.friend_id)

    dispatch(removeFriend(data.friend_id))
}



/*************************** REDUCER ***************************/
const initialState = {};

export default function friendsReducer(state=initialState, action) {
    switch (action.type) {
        case SET_FRIENDS:
          return {...action.friends}
        case REMOVE_FRIEND:
          const newState = {...state}
          delete newState[action.friend_id]
          return newState
        default:
            return state;
    }
}
