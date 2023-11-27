import { Menu, MenuItem, Modal, Popover, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import LoginPage from '../../LoginPage/LoginModal';
import AppsIcon from '@mui/icons-material/Apps';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import {
	CloseModal,
	CloseUsernameModal,
	isUserLogin,
	OpenModal,
	OpenUsernameModal,
	SetUsername,
	SetUserPhoto,
	SetUserUID,
	userLogout,
} from '../../../lib/slices/userSlice';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useRouter } from 'next/router';
import LinkLists from '../Menu/Menu';
import Image from 'next/image';
import UsernameModal from '../../LoginPage/UsernameModal';
import LogoutIcon from '@mui/icons-material/Logout';
import Badges from '../../Badges/Badges';

const Navbar = () => {
	const router = useRouter();
	const { locale, locales, push } = useRouter();

	const [open, setOpen] = React.useState(false);
	const modalHandler = useSelector(
		(state: any) => state.userControl.userSignInModal
	);
	const usernameModalHandler = useSelector(
		(state: any) => state.userControl.usernameModal
	);
	const handleOpen = () => {
		dispatch(OpenModal());
		console.log(modalHandler);
	};
	const handleClose = () => dispatch(CloseModal());
	const userPhoto = useSelector((state: any) => state.userControl.userPhoto);
	const userUID = useSelector((state: any) => state.userControl.userUID);
	const userName = useSelector((state: any) => state.userControl.username);
	const userLogin = useSelector((state: any) => state.userControl.userLogin);
	const [isWebView, setIsWebView] = useState(false);

	const dispatch = useDispatch();
	const handleUsernameOpen = () => dispatch(OpenUsernameModal());
	const handleUsernameClose = () => dispatch(CloseUsernameModal());

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('user') as string);
		if (userData) {
			dispatch(isUserLogin());
			dispatch(SetUserPhoto(userData.photoURL));
			dispatch(SetUsername(userData.username));

			dispatch(SetUserUID(userData.uid));

			if (userData.username == null) {
				dispatch(OpenUsernameModal());
			}
		}
		// console.log(userData);
	}, [userUID, userLogin]);

	const handleSignOut = () => {
		signOut(auth)
			.then(() => {
				dispatch(SetUserUID(null));
				localStorage.removeItem('user');
				setAnchorEl(null);
				dispatch(userLogout());

				// Sign-out successful.
			})
			.catch(error => {
				// An error happened.
			});
	};

	function redirectToExternalUrl(url: any) {
		if (window.self !== window.top) {
			window.top!.location.href = url;
		}
	}
	const handleOpenNativeBrowser = useCallback(() => {
		// if (isWebView) {
		// } else {
		// }
		dispatch(OpenModal());
	}, [isWebView]);

	function renderSwitch(param: string) {
		switch (param) {
			case '/':
				return '';

			case '/summarize':
				return 'Summarization';
			case '/Aksor':
				return 'Aksor';

			default:
				return ' ';
		}
	}

	function handleLanguage(lang: string) {
		push('/', undefined, { locale: lang });
	}

	useEffect(() => {
		const userAgent = navigator.userAgent;
		if (/Android/.test(userAgent)) {
			// Check if the user is using an embedded WebView on Android
			setIsWebView(userAgent.indexOf('wv') > -1);
		} else if (/iPhone|iPad|iPod/.test(userAgent)) {
			// Check if the user is using an embedded WebView on iOS
			setIsWebView(userAgent.includes('Mobile/'));
		}
	}, []);

	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
		null
	);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const HandlePopoverClose = () => {
		setAnchorEl(null);
	};
	const anchorbool = Boolean(anchorEl);

	return (
		<nav
			id="Top"
			className="fixed top-0 w-full bg-Grayesh z-[100] ">
			<div className="flex items-center justify-between px-6 py-4">
				<Link
					href="/"
					className="flex flex-row gap-4 items-center">
					<div className="flex flex-row justify-center items-center gap-2">
						<Image
							className=" rounded-md -mr-1 mt-[1px] border-2 border-black border-dashed"
							src="/sorsayv2.png"
							width={20}
							height={20}
							alt="logo"
						/>
						<span className="text-xl font-bold">Sorsay</span>
						<div className="mt-1 text-xs font-extrabold border-2 border-black p-1 rounded-md">
							BETA
						</div>
					</div>
				</Link>

				<div className="hidden md:block">
					<LinkLists />
				</div>
				<div className="flex flex-row gap-4">
					<div className=" bg-DarkerGray px-1 flex flex-row font-semibold  text-center justify-center gap-2 py-1 transition-all rounded-lg">
						{locales?.map(lang => (
							<button
								className={` transition-all uppercase ease-in-out rounded-md px-2 py-[1px] ${
									locale === lang
										? 'bg-Whitesh text-gray-700'
										: ' text-gray-500'
								}`}
								onClick={() => handleLanguage(lang)}
								key={lang}>
								{lang}
							</button>
						))}
					</div>
					{!userLogin ? (
						<>
							<div
								className="cursor-pointer flex gap-2 items-center justify-center group"
								onClick={() => handleOpenNativeBrowser()}>
								<img
									className=" rounded-md w-8 h-8 ring-2 ring-offset-2 ring-primary group-hover:scale-110 transition-all duration-200"
									src="/user.jpeg"
									alt=""
								/>
								<span>LOGIN</span>
							</div>
						</>
					) : (
						<>
							<div className="relative cursor-pointer flex gap-2 items-center justify-center group">
								<button
									className="flex flex-row items-center justify-center gap-3"
									onClick={handleClick}>
									<img
										className=" rounded-md w-8 h-8 ring-2 ring-offset-2 ring-primary group-hover:scale-110 transition-all duration-200"
										src={
											userPhoto == 'photo' ? '/userDefaultPhoto.png' : userPhoto
										}
										referrerPolicy="no-referrer"
										alt=""
									/>
									{userName}
								</button>

								<Popover
									id="id2"
									className="absolute top-3 rounded-xl  overflow-visible "
									open={anchorbool}
									anchorEl={anchorEl}
									onClose={HandlePopoverClose}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}>
									<div className=" bg-light w-64 min-h-40 p-2 shadow-none flex flex-col items-start gap-2 justify-evenly">
										<div className="p-2">
											<p className=" text-gray-500 text-sm">Badges</p>
											<div className=" mt-2">
												<Badges />
											</div>
										</div>
										{/* <div className="p-2">
											<p className=" text-gray-500 text-sm">Profile</p>
											<p className=" text-sm">WPM: 50</p>
										</div> */}
										<div className="w-full border-b-2  border-DarkerGray "></div>
										<button
											className=" hover:bg-gray-200 px-2 w-full rounded-md text-start py-2 flex items-center gap-2"
											onClick={handleSignOut}>
											<LogoutIcon />
											Sign out
										</button>{' '}
									</div>
								</Popover>
								{/* <button onClick={handleSignOut}> Sign out</button> */}
							</div>
						</>
					)}
				</div>
			</div>
			<Modal
				open={modalHandler}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<div>
					<LoginPage
						isEmbedded={isWebView}
						closeModal={handleClose}
					/>
				</div>
			</Modal>
			<Modal
				open={usernameModalHandler}
				// onClose={handleUsernameClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<div>
					<UsernameModal
						isEmbedded={isWebView}
						closeModal={handleUsernameClose}
					/>
				</div>
			</Modal>
		</nav>
	);
};

export default Navbar;
