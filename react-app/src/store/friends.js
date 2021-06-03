/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_FRIENDS = "friends/SET_FRIENDS";

/*************************** ACTIONS ***************************/
const setFriends = (friends) => ({
    type: SET_FRIENDS,
    friends,
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

    data.friends.forEach((friend)=>{
      friendsObj[friend.id] = friend
    })

    dispatch(setFriends(friendsObj))
}


/*************************** REDUCER ***************************/
const initialState = {};

export default function friendsReducer(state=initialState, action) {
    switch (action.type) {
        case SET_FRIENDS:
            return {...action.friends}
        default:
            return state;
    }
}
