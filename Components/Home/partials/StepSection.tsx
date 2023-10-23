import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined';
import KeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';
import KeyboardIcon from '@mui/icons-material/Keyboard';

const StepsSection: React.FC = () => {
	const { t } = useTranslation('common');

	const steps = [
		{
			title: 'STEP 1',
			description: 'Type in the desired Romanized Form of the Khmer word.',
			icon: <AbcOutlinedIcon />,
		},
		{
			title: 'STEP 2',
			description: 'Select from the suggestion box.',
			icon: <KeyboardTabOutlinedIcon />,
		},
		{
			title: 'STEP 3',
			description: 'Press Space.',
			icon: <KeyboardIcon />,
		},
	];

	return (
		<section className="text-gray-700 bg-Whitesh body-font py-24">
			<h1 className="text-2xl md:text-3xl font-semibold text-center mb-12 -mt-4 whitespace-nowrap">
				{t('How does it work?')}
			</h1>
			<div className=" lg:flex md:flex-col lg:flex-row px-20  mx-auto  items-center">
				<div className="flex flex-wrap w-full">
					<div className="lg:w-full md:w-1/2 md:pr-10 md:py-6">
						{steps.map((step, index) => (
							<div
								className="flex relative pb-12"
								key={index}>
								<div className="h-full w-10 absolute inset-0 flex items-center justify-center">
									{index == 2 ? (
										<div className=""></div>
									) : (
										<div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
									)}
								</div>
								<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary inline-flex items-center justify-center text-white relative z-10">
									{step.icon}
								</div>
								<div className="flex-grow pl-4">
									<h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
										{t(step.title)}
									</h2>
									<p className="leading-relaxed">{t(step.description)}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className=" rounded-md lg:shadow-lg lg:border-black border">
					<video
						className="hidden md:block"
						controls={false}
						style={{ pointerEvents: 'none' }}
						width={1200} // Set the width to 1200 pixels
						height={600} // Set the height to 600 pixels
						autoPlay
						loop
						playsInline
						muted>
						<source
							src="/tutorialv3.webm"
							type="video/webm"
						/>
						Your browser does not support the video tag.
					</video>
				</div>
			</div>
		</section>
	);
};

export default StepsSection;
