import React, { ReactNode } from 'react';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import SchoolIcon from '@mui/icons-material/School';
import { useTranslation } from 'next-i18next';
// Define a prop type interface for FeatureCard
interface FeatureCardProps {
	icon: ReactNode;
	title: string;
	description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
	icon,
	title,
	description,
}) => {
	const { t } = useTranslation('common');
	return (
		<div className="p-4 md:w-1/3 flex">
			<div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-Grayesh text-primary mb-4 flex-shrink-0">
				{icon}
			</div>
			<div className="flex-grow pl-6">
				<h2 className="text-gray-900 text-lg title-font font-medium mb-2">
					{t(title)}
				</h2>
				<p className="leading-relaxed text-base">{t(description)}</p>
			</div>
		</div>
	);
};

const FeatureSection: React.FC = () => {
	const { t } = useTranslation('common');
	return (
		<section className=" bg-Whitesh text-gray-600 body-font">
			<div className="container px-5 py-24 mx-auto">
				<h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 mb-20">
					{t('Why should you use this keyboard?')}
				</h1>
				<div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
					<FeatureCard
						icon={<AddModeratorIcon />}
						title="Preservation of Khmer Script"
						description="Ensuring the continued use and understanding of the Khmer script."
					/>
					<FeatureCard
						icon={<AlarmOnIcon />}
						title="Productivity"
						description="Faster and more intuitive typing Khmer Script using the QWERTY Keyboard."
					/>
					<FeatureCard
						icon={<SchoolIcon />}
						title="Learning"
						description="Assisting those learning the Khmer language."
					/>
				</div>
			</div>
		</section>
	);
};

export default FeatureSection;
