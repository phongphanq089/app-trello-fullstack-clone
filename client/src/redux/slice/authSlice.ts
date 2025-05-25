import http from '@/services/http'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface User {
  _id: string
  username: string
  email: string
  displayName: string
  avatar: string | null
  role: string
  isActive: boolean
  verifyToken: string | null
  createdAt: number
  updatedAt: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
}

export const loginUser = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string }, // return type
  { email: string; password: string }, // args type
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await http.post('/users/login', credentials)
    const { accessToken, refreshToken, ...user } = response.data

    return {
      user,
      accessToken,
      refreshToken
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Login failed')
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async (showSuccessMessage: boolean = true) => {
  const response = await http.delete('/users/logout')

  if (showSuccessMessage) {
    toast.success('Logout successFully !')
  }
  return response.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.error = null
      state.loading = false
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Đăng nhập thất bại'
      })
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
    })
  }
})

export const { logout, updateProfile } = authSlice.actions

export const authSliceReducer = authSlice.reducer
