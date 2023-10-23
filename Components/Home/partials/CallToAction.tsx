import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OpenModal } from '../../../lib/slices/userSlice';
import style from './home.module.css';
import { useTranslation } from 'next-i18next';
const CallToAction = () => {
	const { t } = useTranslation('common');
	const [userData, setUserData] = useState(null);
	const dispatch = useDispatch();
	const router = useRouter();
	const userUID = useSelector((state: any) => state.userControl.userUID);

	useEffect(() => {
		setUserData(userUID);
	}, [userUID]);

	const ClickHandlerBeforeLogin = () => {
		dispatch(OpenModal());
	};
	const ClickHandlerAfterLogin = () => {
		router.push('/');
	};
	return (
		<section className="relative flex flex-col items-center justify-between border-b-2 border-black border-dashed  bg-Whitesh py-20 px-20  ">
			<div className=" flex flex-col items-center justify-center gap-10">
				<div className="flex flex-col items-center justify-center gap-4">
					<h1 className="text-3xl -mt-4 whitespace-nowrap">
						{t('Try it out now!')}
					</h1>
				</div>
				<div className="flex justify-start items-start flex-col md:w-[500px] m-1/2">
					<p className=" text-center">
						{t(
							`Unlock the richness of Khmer language with our tools. Try it out today!`
						)}
					</p>
				</div>
				<div className="flex items-center justify-start">
					{userData == null ? (
						<button
							className="  border px-6 py-2 text-xl bg-Whitesh flex flex-row justify-center items-center
						 rounded-md shadow-md text-primary border-primary hover:bg-White hover:scale-102 active:scale-95 transition-all duration-300 
							disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
							onClick={ClickHandlerBeforeLogin}>
							<span className="font-medium"> {t('Try it out')} </span>
						</button>
					) : (
						<button
							className="  border-2 px-6 py-2 text-xl bg-white flex flex-row justify-center items-center
							text-[#604fcd] border-[#604fcd] rounded-md shadow-md hover:scale-102 active:scale-95 transition-all duration-300 hover:bg-gray-100 hover:font-bold
							disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
							onClick={ClickHandlerAfterLogin}>
							<span className="font-medium"> {t('Try it out')} </span>
						</button>
					)}
				</div>
			</div>
			{/* <div className="relative w-[360px] h-[256px]">
				<div className={style.bgGrid}></div>
				<div className={style.card}>
					<div className="h-full flex flex-col">
						<div className="m-4 h-1/2">
							<span>Detects all your spolling and grommer.</span>
						</div>
						<hr className=" border-black border-[1px]" />
						<div className="m-4 h-1/2">
							<span>Detects all your spelling and grammers.</span>
						</div>
					</div>
				</div>
			</div> */}
		</section>
	);
};

export default CallToAction;
