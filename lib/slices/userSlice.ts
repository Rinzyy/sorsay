import { createSlice } from '@reduxjs/toolkit';
import { useMemo } from 'react';

export const userSlice = createSlice({
	name: 'userControl',
	initialState: {
		userLogin: false,
		userSignInModal: false,
		userNoFuelModal: false,
		userPhoto: null,
		userUID: null,
		userFuel: 0,
		fuelCost: 1,
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
		SetUserUID: (state, action) => {
			state.userUID = action.payload;
			// console.log(state.inputString);
			// console.log(state.userUID + 'at base');
		},
		fuelCal: (state, action) => {
			state.fuelCost = action.payload;
		},
		ShowUserFuel: (state, action) => {
			state.userFuel = action.payload;
		},
		OpenModal: state => {
			state.userSignInModal = true;
			// console.log(state.inputString);
		},
		CloseModal: state => {
			state.userSignInModal = false;
			// console.log(state.inputString);
		},
		OpenNoFuelModal: state => {
			state.userNoFuelModal = true;
			// console.log(state.inputString);
		},
		CloseNoFuelModal: state => {
			state.userNoFuelModal = false;
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
	fuelCal,
	ShowUserFuel,
	OpenModal,
	CloseModal,
	OpenNoFuelModal,
	CloseNoFuelModal,
	setPlan,
} = userSlice.actions;
export default userSlice.reducer;
