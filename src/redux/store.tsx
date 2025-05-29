import {configureStore} from '@reduxjs/toolkit';
import reloadlyReducer from './Reloadly/Index'

export const store = configureStore({
  reducer: {
    reloadly: reloadlyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
