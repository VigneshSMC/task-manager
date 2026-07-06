import { configureStore } from '@reduxjs/toolkit'
import projectReducers from '../slice/ProjectSlice'
import taskReducers from '../slice/TaskSlice'
import userReducers from '../slice/UserSlice'

export const store = configureStore({
    reducer: {
        projects: projectReducers,
        tasks: taskReducers,
        user: userReducers
    }
})