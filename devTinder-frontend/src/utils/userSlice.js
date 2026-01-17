import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        loaded: false,
    },
    reducers: {
        addUser: (state, action) => {
            state.data = action.payload
            state.loaded = true
        },
        removeUser: (state) => {
            state.data = null
            state.loaded = true
        }
    }
})

export const {addUser, removeUser} = userSlice.actions;
export default userSlice.reducer;