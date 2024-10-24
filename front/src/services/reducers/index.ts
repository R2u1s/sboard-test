import { combineReducers } from 'redux';
import { storeReducer } from './store';

// Корневой редьюсер
export const rootReducer = combineReducers({
    store: storeReducer
}) 