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
        },
        updateProject: (state, action) => {
            console.log("Inside project slice", action.payload)
            const project = state.find(s => s._id === action.payload._id)
            Object.assign(project, action.payload)
        }
    }
})

export const { addProjects, deleteProject, addProject, updateProject} = projectSlice.actions
export default projectSlice.reducer