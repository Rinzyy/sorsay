import { createSlice } from '@reduxjs/toolkit';
import { useMemo } from 'react';

export const userSlice = createSlice({
	name: 'userControl',
	initialState: {
		userLogin: false,
		userSignInModal: false,
		usernameModal: false,
		userPhoto: null,
		userUID: null,
		username: '',
		buyPlan: '',
	},

	reducers: {
		isUserLogin: state => {
			state.userLogin = true;
			// console.log(state.inputString);
		},
		userLogout: state => {
			state.userLogin = false;
			// console.log(state.inputString);
		},
		SetUserPhoto: (state, action) => {
			state.userPhoto = action.payload;
			// console.log(state.inputString);
		},
		SetUsername: (state, action) => {
			state.username = action.payload;
			// console.log(state.inputString);
		},
		SetUserUID: (state, action) => {
			state.userUID = action.payload;
			// console.log(state.inputString);
			// console.log(state.userUID + 'at base');
		},
		OpenModal: state => {
			state.userSignInModal = true;
			// console.log(state.inputString);
		},
		CloseModal: state => {
			state.userSignInModal = false;
			// console.log(state.inputString);
		},
		OpenUsernameModal: state => {
			state.usernameModal = true;
			// console.log(state.inputString);
		},
		CloseUsernameModal: state => {
			state.usernameModal = false;
			// console.log(state.inputString);
		},
		setPlan: (state, action) => {
			state.buyPlan = action.payload;
		},
	},
});

export const {
	isUserLogin,
	userLogout,
	SetUserPhoto,
	SetUserUID,
	SetUsername,
	OpenModal,
	CloseModal,
	OpenUsernameModal,
	CloseUsernameModal,
	setPlan,
} = userSlice.actions;
export default userSlice.reducer;
