import { configureStore } from '@reduxjs/toolkit';
import typingControlReducer from './slices/typingSlice';
import userControlReducer from './slices/userSlice';

export default configureStore({
	reducer: {
		typingControl: typingControlReducer,
		userControl: userControlReducer,
	},
});
