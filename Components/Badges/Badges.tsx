import React, { useState } from 'react';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import { IconButton } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
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
			<div className="absolute min-w-full whitespace-nowrap z-[1000] -bottom-14 mb-2 hidden group-hover:block bg-light border border-DarkerGray p-2 rounded-md shadow-lg text-sm">
				{description}
			</div>
		</div>
	);
};

// Parent component
const Badges = () => {
	const [isEligible, setIsEligible] = useState(true);

	return (
		<div className=" w-fit flex flex-wrap overflow-visible gap-2">
			{isEligible && (
				<Badge
					icon={<SettingsAccessibilityIcon className=" text-[20px]" />}
					backgroundColor="bg-yellow-300"
					description="First 100 User"
				/>
			)}
			{isEligible && (
				<Badge
					icon={<ElectricBoltIcon className=" text-[20px]" />}
					backgroundColor=" bg-gray-500"
					description="Over 50 WPM "
				/>
			)}
		</div>
	);
};

export default Badges;
