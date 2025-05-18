import http from '@/services/http'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchBoardDetailApi = createAsyncThunk('activeBoard/fetchBoardDetailApi', async (boardId: string) => {
  const response = await http.get(`/boards/getBoard/${boardId}`)
  return response
})

export interface CounterState {
  value: number
}

const initialState = {
  currentActiveBoard: null
}

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // reducer : nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrenActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer ,ở đây chúng ta gán nó ra 1 biến có nghĩa hơn
      const fullBoard = action.payload

      state.currentActiveBoard = fullBoard
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailApi.fulfilled, (state, action) => {
      state.currentActiveBoard = action.payload as any
    })
  }
})

//  action là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để đề cập nhật lại dữ liệu thông qua reducer ( chạy đồng bộ )
export const { updateCurrenActiveBoard } = activeBoardSlice.actions

export const activeBoardReducer = activeBoardSlice.reducer
