// sessionReducer.ts
import { SET_SESSION_DATA } from './actionTypes';
import { SessionData } from '../Interfaces/Session';


const initialState: SessionData = {
  id: undefined,
  Handle: null,
  LastRequest: null,
  LastIP: null,
  UserID: null,
  Type: null,
  AuthSourceID: null,
  AssertionValidUntil: null,
  PendingUserID: null,
  created_at: undefined,
  updated_at: undefined,
  Individual: undefined
};

const sessionReducer = (state = initialState, action: any): SessionData => {
  switch (action.type) {
    case SET_SESSION_DATA:
      return action.payload;
    default:
      return state;
  }
};

export default sessionReducer;