import React, { useEffect, useState } from 'react';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import { IconButton } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { GetBadges } from '../../lib/FirebaseFunction';
// Badge component with props
const Badge = ({ icon, backgroundColor, description }: any) => {
	return (
		<div className="relative group">
			{/* Badge */}
			<div
				className={`rounded-md w-8 h-8 p-[6px] border border-gray-500 ${backgroundColor} border-dashed shadow-md flex items-center justify-center`}>
				{icon}
			</div>

			{/* Popup */}
			{description == '' ? (
				<div></div>
			) : (
				<div className="absolute min-w-full whitespace-nowrap z-[1000] -bottom-14 mb-2 hidden group-hover:block bg-light border border-DarkerGray p-2 rounded-md shadow-lg text-sm">
					{description}
				</div>
			)}
		</div>
	);
};

// Parent component
const Badges = () => {
	const [loading, isLoading] = useState(true);
	const [First1000, isFirst1000] = useState(false);
	const [WPM80, isWPM80] = useState(false);
	const [Contributer, isContributer] = useState(false);

	const FetchBadges = async () => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			const parsedUser = JSON.parse(storedUser);

			const badges = await GetBadges(parsedUser.uid);
			console.log(badges, badges);

			// Set the badge states based on fetched data
			isFirst1000(badges.First1000);
			isWPM80(badges.WPM80);
			isContributer(badges.Contributer);
			isLoading(false);
		}
	};

	useEffect(() => {
		FetchBadges();
	}, []); // Run once when the component mounts

	return (
		<div className=" w-fit flex flex-wrap overflow-visible gap-2">
			{loading ? (
				<Badge
					icon={<QuestionMarkIcon className=" text-[20px]" />}
					backgroundColor=" bg-gray-300"
					description=""
				/>
			) : (
				<div className="absolute"></div>
			)}
			{First1000 && (
				<Badge
					icon={<SettingsAccessibilityIcon className=" text-[20px]" />}
					backgroundColor="bg-yellow-300"
					description="First 1000 User"
				/>
			)}
			{WPM80 && (
				<Badge
					icon={<ElectricBoltIcon className=" text-[20px]" />}
					backgroundColor=" bg-gray-200"
					description="Over 80 WPM "
				/>
			)}
			{Contributer && (
				<Badge
					icon={<AutoAwesomeIcon className=" text-[20px]" />}
					backgroundColor=" bg-blue-200"
					description="Contributer "
				/>
			)}
		</div>
	);
};

export default Badges;
