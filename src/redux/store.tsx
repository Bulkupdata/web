import {configureStore} from '@reduxjs/toolkit';
import reloadlyReducer from './Reloadly/Index'
import authSlice from './Auth/authSlice';

export const store = configureStore({
  reducer: {
    reloadly: reloadlyReducer,
    authSlice,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
