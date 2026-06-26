import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        addProjects: (state, action) => {
            return action.payload
        },
        deleteProject: (state, action) => {
            console.log(action)
            return state.filter(s => s._id !== action.payload)
        },
        addProject: (state, action) => {
            state.push({name: action.payload.name, description: action.payload.description})
        }
    }
})

export const { addProjects, deleteProject } = projectSlice.actions
export default projectSlice.reducer