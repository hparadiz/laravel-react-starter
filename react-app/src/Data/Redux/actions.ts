import { SessionData } from "../Interfaces/Session"
import { SET_SESSION_DATA } from './actionTypes';

export const setSessionData = (sessionData: SessionData) => ({
  type: SET_SESSION_DATA as typeof SET_SESSION_DATA,
  payload: sessionData,
});