import { createSlice, current } from "@reduxjs/toolkit";

const initialState = []

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        addProjects: (state, action) => {
            console.log("addProject", action.payload)
            return action.payload
        },
        deleteProject: (state, action) => {
            return state.filter(s => s._id !== action.payload)
        },
        addProject: (state, action) => {
            state.push(action.payload)
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