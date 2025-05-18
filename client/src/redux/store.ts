import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './slice/activeBoardSlice'
import { authSliceReducer } from './slice/authSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
}

const reducer = combineReducers({
  activeBoard: activeBoardReducer,
  auth: authSliceReducer
})

const persistReducerAuth = persistReducer(persistConfig, reducer)
export const store = configureStore({
  reducer: persistReducerAuth
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
