/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const ADD_USER = "user/ADD_USER";

const RESET_USERS = "user/RESET_USERS";

/*************************** ACTIONS ***************************/
const addUser = (user) => ({
    type: ADD_USER,
    user,
});


export const resetUsers = () => ({
    type: RESET_USERS
});


/*************************** THUNKS ***************************/
export const getUser = (userId) => async (dispatch) => {
    const response = await fetch(`/api/search/user/${userId}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.errors) {
        return;
    }

    dispatch(addUser(data.user))
    return data.user
}


export const sendFriendRequest = (userId) => async (dispatch) => {
    const response = await fetch(`/api/friends/${userId}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.errors) {
        return;
    }

    dispatch(addUser(data.user))
}

export const declineRequest = (userId) => async (dispatch) => {
  const response = await fetch(`/api/friends/${userId}`,{
    method:'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({version:'declined'})
  });

  const data = await response.json();

  if (data.errors) {
      return;
  }

  dispatch(addUser(data.friend.requester))
}

export const cancelRequest = (id) => async (dispatch) => {
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

    dispatch(addUser(data.user))
}





/*************************** REDUCER ***************************/
const initialState = {};

export default function usersReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case ADD_USER:
          newState={...state}
          newState[action.user.id]=action.user
          return newState
        case RESET_USERS:
          return initialState
        default:
            return state;
    }
}
