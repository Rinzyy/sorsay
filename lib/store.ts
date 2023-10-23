import { configureStore } from '@reduxjs/toolkit';
import typingControlReducer from './slices/typingSlice';

export default configureStore({
	reducer: {
		typingControl: typingControlReducer,
	},
});
