import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sessionReducer from './reducers';

const rootReducer = combineReducers({
  session: sessionReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store;