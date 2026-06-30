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
            console.log("inside add task", action.payload)
            state.push(action.payload)
        },
        updateTask: (state, action) => {
            console.log("action - ", action)
            const task = state.find(s => s._id == action.payload._id)
            Object.assign(task, action.payload)
        }
    }
})

export const { addTasks, deleteTask, addTask, updateTask } = tasksSlice.actions
export default tasksSlice.reducer