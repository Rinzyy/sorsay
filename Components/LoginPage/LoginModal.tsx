import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
	signInWithPopup,
	GoogleAuthProvider,
	getAdditionalUserInfo,
} from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useDispatch } from 'react-redux';
import {
	CloseModal,
	isUserLogin,
	SetUserPhoto,
	SetUserUID,
} from '../../lib/slices/userSlice';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { AddUser } from '../../lib/FirebaseFunction';

interface Prop {
	closeModal: React.MouseEventHandler<HTMLButtonElement>;
	isEmbedded: boolean;
}

async function createNewUser(user: any) {
	const batch = writeBatch(db);
	console.log(user.uid);

	const userRef = doc(db, 'Users', user.uid);
	batch.set(
		userRef,
		{
			userId: user.uid,
			photoURL: user.photoURL,
			name: user.displayName,
			createdAt: serverTimestamp(),
			email: user.email,
			emailVerified: user.emailVerified,
		},
		{ merge: true }
	);

	// const fuelRef = doc(db, 'UsersFuel', user.uid);
	// batch.set(
	// 	fuelRef,
	// 	{
	// 		fuel: 50,
	// 		avgFuelUsage: 0,
	// 		isPremium: false,
	// 		totalFuelUsage: 0,
	// 		uid: user.uid,
	// 		name: user.displayName,
	// 	},
	// 	//if already exist it will overwrite it with data above
	// 	{ merge: true }
	// );

	await batch.commit();
	console.log('done');
}
const LoginPage = ({ closeModal, isEmbedded }: Prop) => {
	const dispatch = useDispatch();
	const handleModal = () => {
		dispatch(CloseModal());
	};

	const provider = new GoogleAuthProvider();
	let user: any;
	const handleSignIn = async () => {
		signInWithPopup(auth, provider)
			.then(async result => {
				dispatch(CloseModal());

				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;
				// The signed-in user info.
				user = result.user;
				// console.log(user);

				let savedUser = {
					uid: user.uid,
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					createdAt: user.metadata.createdAt,
					lastLoginAt: user.metadata.lastLoginAt,
				};

				localStorage.setItem('user', JSON.stringify(savedUser));
				dispatch(SetUserPhoto(user.photoURL as string));
				dispatch(SetUserUID(user.uid as string));
				dispatch(isUserLogin());

				const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
				if (isNewUser) {
					await createNewUser(user);
					await AddUser();
					//if new user it create new acc
				}

				// firestore.collection('users').doc(user.uid).set({
				// 	name,
				// 	lastName,
				// });
			})
			.catch(error => {
				// Handle Errors here.
				// const errorCode = error.code;
				// const errorMessage = error.message;
				// The email of the user's account used.
				// const email = error.customData.en;
				// The AuthCredential type that was used.
				// const credential = GoogleAuthProvider.credentialFromError(error);
				console.log(error);
				// ...
			});
		// .then(result => {});
	};

	return (
		<div
			className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-auto
              bg-light rounded-xl pt-8 pb-10 shadow-2xl">
			<button
				className=" absolute right-4 top-4 text-gray-200 bg-gray-300 text-sm p-1 rounded-full hover:text-mainDark"
				onClick={closeModal}>
				{' '}
				<CloseOutlinedIcon />
			</button>
			<span className="text-xl text-mainDark font-bold flex items-center justify-center mb-6">
				Sign In/ Sign Up
			</span>
			<div className="w-full border-t-2"></div>
			<div className="flex flex-col justify-center  gap-4 mt-10 px-10">
				{/*Still an error fixing login on mobile phone in facebook app, must go to native browser to log in */}
				{/* {isEmbedded ? ( //fixes the error when they cant login
					<div>
						<p className=" text-center text-red-600 text-sm">
							Error Browser not Supported
						</p>

						<p className=" text-center">Open in your Default Browser</p>
					</div>
				) : (
					<button
						className=" bg-white h-16 rounded-md border-2 shadow-md border-primary text-mainDark
					hover:bg-slate-100  active:scale-95 transition-all duration-200"
						onClick={handleSignIn}>
						{' '}
						Sign in With Google
					</button>
				)} */}

				{/* <button
					className=" bg-white h-16 rounded-md border-2 shadow-md border-primary text-mainDark
					 transition-all duration-200"
					disabled
					onClick={handleSignIn}>
					{' '}
					Sign in with Facebook
				</button> */}

				<button
					className=" bg-white h-16 rounded-md border-2 shadow-md border-primary text-mainDark
					hover:bg-slate-100 hover:scale-105 active:scale-100 transition-all duration-200"
					onClick={handleSignIn}>
					Sign in With Google
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
