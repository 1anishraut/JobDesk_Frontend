import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      if (Array.isArray(action.payload)) {
        return action.payload; // replace state with array
      } else {
        state.push(action.payload); // add single task
      }
    },

    updateTask: (state, action) => {
      const index = state.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) state[index] = action.payload;
    },

    removeTask: (state, action) =>
      state.filter((t) => t._id !== action.payload),
  },
});

export const { setTasks, addTask, updateTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;
