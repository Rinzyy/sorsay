import React, { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch } from 'react-redux';
import {
	CloseModal,
	CloseUsernameModal,
	SetUsername,
} from '../../lib/slices/userSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import getUserInfo from '../../lib/FirebaseFunction';
import { SaveUserInfo } from '../../lib/UserAuth';

interface Prop {
	closeModal: React.MouseEventHandler<HTMLButtonElement>;
	isEmbedded: boolean;
}

const UsernameModal = ({ closeModal, isEmbedded }: Prop) => {
	const [username, setUsername] = useState(''); // State to hold the input value
	const dispatch = useDispatch();

	// This function updates the username in Firestore
	const updateUsername = async () => {
		try {
			const storedUser = localStorage.getItem('user');
			if (storedUser) {
				const parsedUser = JSON.parse(storedUser);
				const userRef = doc(db, 'Users', parsedUser.uid); // Replace 'userId' with the actual user ID
				await updateDoc(userRef, {
					username: username,
				});
				console.log('Username updated');
				let fetchUserFromDatabase = await getUserInfo(parsedUser.uid);
				SaveUserInfo(fetchUserFromDatabase);
				dispatch(SetUsername(username));
				console.log('reload fetch data');
			}
			//save it to the localstorage
			// Dispatch an action to close the modal if needed
			dispatch(CloseUsernameModal());
		} catch (error) {
			console.error('Error updating username: ', error);
		}
	};

	// Event handler for form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log(username, 'success');
		await updateUsername();
	};

	return (
		<div
			className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-auto
              bg-light rounded-xl pt-8 pb-10 shadow-2xl">
			{' '}
			{/* className shortened for brevity */}
			<span className="text-xl text-mainDark font-bold flex items-center justify-center mb-6">
				Create a Username
			</span>
			<form className="flex flex-col justify-center gap-4 mt-10 px-10">
				<input
					type="text"
					placeholder="Enter your username"
					value={username}
					onChange={e => setUsername(e.target.value)}
					className="p-2 text-mainDark border rounded-md"
					required
				/>
				<button
					type="submit"
					onClick={handleSubmit}
					className="bg-white h-16 rounded-md border-2 shadow-md border-primary text-mainDark hover:bg-slate-100 hover:scale-105 active:scale-100 transition-all duration-200">
					Create
				</button>
			</form>
		</div>
	);
};

export default UsernameModal;
