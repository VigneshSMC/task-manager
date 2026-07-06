import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            console.log("inside redux", action.payload)
            return action.payload
        }
    }
})

export const { addUser } = userSlice.actions
export default userSlice.reducer