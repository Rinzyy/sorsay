import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
	signInWithPopup,
	GoogleAuthProvider,
	getAdditionalUserInfo,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useDispatch } from 'react-redux';
import { CloseModal, isUserLogin } from '../../lib/slices/userSlice';
import {
	doc,
	serverTimestamp,
	updateDoc,
	writeBatch,
} from 'firebase/firestore';
import getUserInfo, {
	AddUser,
	getUsernameByUID,
} from '../../lib/FirebaseFunction';
import { useRouter } from 'next/router';
import { generateFromEmail, generateUsername } from 'unique-username-generator';
import { SaveUserInfo } from '../../lib/UserAuth';
import { Modal } from '@mui/material';
import ForgetPasswordModal from './ForgetPasswordModal';
interface Prop {
	closeModal: React.MouseEventHandler<HTMLButtonElement>;
	isEmbedded: boolean;
}
import BadWordsFilter from 'bad-words';

async function updateUsernameForNewUser(uid: string, username: string) {
	try {
		// Reference to the user document in Firestore
		const userRef = doc(db, 'Users', uid);

		// Update the username field in the user document
		await updateDoc(userRef, {
			username: username,
		});

		console.log('Username updated successfully');
	} catch (error) {
		console.error('Error updating username: ', error);
	}
}
async function createNewUser(user: any) {
	const batch = writeBatch(db);
	console.log(user.uid);

	const userRef = doc(db, 'Users', user.uid);
	batch.set(
		userRef,
		{
			userId: user.uid,
			photoURL: user.photoURL || 'defaultPhotoURL', // Provide a default URL if undefined
			name: user.displayName || 'defaultName', // Provide a default name if undefined
			username: user.username || generateFromEmail(user.email, 2),
			createdAt: serverTimestamp(),
			email: user.email,
			emailVerified: user.emailVerified,
			wpm: 0,
			typingRank: 0,
		},
		{ merge: true }
	);

	await batch.commit();
	console.log('done');
}

const LoginPage = ({ closeModal, isEmbedded }: Prop) => {
	const router = useRouter();
	const [password, setPassword] = useState<string>();
	const [email, setEmail] = useState<string>();
	const [passwordSigIn, setSignInPassword] = useState<string>();
	const [emailSignIn, setSignInEmail] = useState<string>();
	const [username, setUsername] = useState<string>();
	const [forget, setForget] = useState<boolean>(false);
	const [profanity, setProfanity] = useState<boolean>(false);
	const dispatch = useDispatch();

	const provider = new GoogleAuthProvider();
	let user: any;
	const handleSignIn = async () => {
		signInWithPopup(auth, provider)
			.then(async result => {
				// // This gives you a Google Access Token. You can use it to access the Google API.
				// const credential = GoogleAuthProvider.credentialFromResult(result);
				// // const token = credential?.accessToken;

				// The signed-in user info.
				user = result.user;
				const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
				if (isNewUser) {
					await createNewUser(user);
					await AddUser();
				}

				//get from the database instead directly from auth for consistent info
				let fetchUserFromDatabase = await getUserInfo(user.uid);
				//save it to the localstorage
				SaveUserInfo(fetchUserFromDatabase);
				dispatch(CloseModal());
				dispatch(isUserLogin());
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

	//sign in with email and password
	const SignIn = () => {
		signInWithEmailAndPassword(auth, emailSignIn!, passwordSigIn!)
			.then(async userCredential => {
				// let user = await getUserInfo(userCredential.user.uid);
				let fetchUserFromDatabase = await getUserInfo(userCredential.user.uid);
				SaveUserInfo(fetchUserFromDatabase);
				console.log(fetchUserFromDatabase!.username);

				dispatch(isUserLogin());
				dispatch(CloseModal());
			})
			.catch(error => {
				switch (error.code) {
					case 'auth/user-not-found':
						alert('No user found with this email.');
						break;
					case 'auth/wrong-password':
						alert('Incorrect password.');
						break;
					case 'auth/invalid-email':
						alert('Invalid email format.');
						break;
					default:
						alert('An error occurred during sign in.');
						break;
				}
			});
	};

	//sign up with email and pasword
	const SignUp = () => {
		createUserWithEmailAndPassword(auth, email!, password!).then(
			async userCredential => {
				let savedUser = {
					uid: userCredential.user.uid,
					name: 'user',
					username: username,
					emailVerified: userCredential.user.emailVerified,
					email: userCredential.user.email,
					photoURL: 'photo',
					createdAt: userCredential.user.metadata.creationTime,
				};
				localStorage.setItem('user', JSON.stringify(savedUser));

				AddUser();
				dispatch(CloseModal());
				createNewUser(savedUser);
				dispatch(isUserLogin());
			}
		);
	};
	const changePassword = (e: any) => {
		setPassword(e.target.value);
	};
	const changeEmail = (e: any) => {
		setEmail(e.target.value);
	};
	const changePasswordSignIn = (e: any) => {
		setSignInPassword(e.target.value);
	};
	const changeEmailSignIn = (e: any) => {
		setSignInEmail(e.target.value);
	};
	const changeUsername = (e: any) => {
		const Filter = new BadWordsFilter();
		if (Filter.isProfane(e.target.value)) {
			setProfanity(true);
			console.log('bad word');
		} else {
			setProfanity(false);
		}
		setUsername(e.target.value);
	};

	const isFormFilled =
		email !== '' && password !== '' && username !== '' && !profanity;
	const isFormSignInFilled = emailSignIn !== '' && passwordSigIn !== '';

	return (
		<div
			className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto h-auto
 bg-Grayesh rounded-xl md:pt-4 md:pb-10 shadow-2xl">
			<button
				className=" absolute right-4 top-4 text-gray-200 bg-gray-300 text-sm p-1 rounded-full hover:text-mainDark"
				onClick={closeModal}>
				{' '}
				<CloseOutlinedIcon />
			</button>
			<span className="text-xl text-black font-bold flex items-center justify-center py-4 md:mb-4">
				Sign Up / Sign In
			</span>
			<div className="w-full border-black border-dashed border-t-2"></div>
			<div className=" flex flex-col-reverse md:flex-row gap-4 px-4 items-baseline justify-around ">
				<div>
					<div className="space-y-4 p-4 ">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-gray-900">
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="block w-64 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black placeholder:text-gray-400 bg-DarkerGray focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={changeEmail}
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-gray-900">
								Username
							</label>
							<div className="mt-2">
								<input
									id="username"
									name="username"
									type="username"
									required
									className="block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black bg-DarkerGray placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={changeUsername}
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-gray-900">
									Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black bg-DarkerGray placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={changePassword}
								/>
							</div>
						</div>

						<div>
							<button
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed"
								disabled={!isFormFilled}
								onClick={SignUp}>
								Sign up
							</button>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center">
					<div>
						<div className="space-y-4 p-4 ">
							<div>
								<label
									htmlFor="email"
									className="block w-64 text-sm font-medium leading-6 text-gray-900">
									Email address
								</label>
								<div className="mt-2">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										onChange={changeEmailSignIn}
										required
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black bg-DarkerGray placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-gray-900">
										Password
									</label>
									<div className="text-sm">
										<button
											onClick={() => {
												setForget(true);
											}}
											className="font-semibold text-indigo-600 hover:text-indigo-500">
											Forgot password?
										</button>
									</div>
								</div>
								<div className="mt-2">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										onChange={changePasswordSignIn}
										required
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black bg-DarkerGray placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<button
									// type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 disabled:cursor-not-allowed text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									disabled={!isFormSignInFilled}
									onClick={SignIn}>
									Sign in
								</button>
							</div>
						</div>
					</div>
					<p className=" font-bold">OR</p>
					<button
						className=" bg-white mt-2 h-10 w-64 rounded-md border-2 shadow-md border-primary text-mainDark
					hover:bg-slate-100 hover:scale-105 active:scale-100 transition-all duration-200"
						onClick={handleSignIn}>
						Sign In/Sign Up With Google
					</button>
				</div>
			</div>
			<Modal
				open={forget}
				onClose={() => {
					setForget(false);
				}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<div>
					<ForgetPasswordModal
						closeModal={() => {
							setForget(false);
						}}
					/>
				</div>
			</Modal>
		</div>
	);
};

export default LoginPage;
