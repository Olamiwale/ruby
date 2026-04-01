import { createStore, combineReducers } from 'redux';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
  cart: cartReducer,
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;
export default store;
