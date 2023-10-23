import { createSlice } from '@reduxjs/toolkit';

export const typingSlice = createSlice({
	name: 'typingControl',
	initialState: {
		inputString: '',
		inputKhmerString: '',
	},

	reducers: {
		OnChangeInput: (state, action) => {
			state.inputString = action.payload;
			// console.log(state.inputString);
		},
		OnChangeKhmerString: (state, action) => {
			// Append the new item to the inputKhmerString array

			state.inputKhmerString = action.payload;
		},
	},
});

export const { OnChangeInput, OnChangeKhmerString } = typingSlice.actions;
export default typingSlice.reducer;
