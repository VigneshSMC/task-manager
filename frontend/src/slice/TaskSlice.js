import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTasks: (state, action) => {
            return action.payload
        },
        deleteTask: (state, action) => {
            return state.filter(t => t._id !== action.payload)
        },
        addTask: (state, action) => {
            state.push({title: action.payload.title, description: action.payload.description})
        }
    }
})

export const { addTasks, deleteTask, addTask } = tasksSlice.actions
export default tasksSlice.reducer