import React from 'react';
import CreateIcon from '@mui/icons-material/Create';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const LinkLists = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	function renderSwitch(param: string) {
		switch (param) {
			case '/':
				return 'Draft';

			case '/TypingGame':
				return 'Typing Game';
			case '/Dictionary':
				return 'Dictionary';

			default:
				return ' ';
		}
	}

	return (
		<div className=" pl-24 flex items-center justify-center gap-4">
			<Link
				href="/"
				className="flex flex-row items-center cursor-pointer underline decoration-primary decoration-2 underline-offset-4 text-[1.1rem] text-black gap-1 hover:opacity-100 transition-all duration-300 group">
				<CreateIcon className="" />
				<span className="">{t('Draft')}</span>
			</Link>
			<Link
				href=""
				className="flex flex-row items-center underline decoration-gray-400 decoration-2 underline-offset-4 cursor-not-allowed text-black gap-1 hover:opacity-100 transition-opacity duration-300 group">
				<SportsEsportsIcon className=" group-hover:text-gray-700" />
				<div className="relative flex flex-col">
					<span className=" group-hover:text-gray-700">{t('Typing Game')}</span>
					<span className=" absolute -bottom-3 group-hover:text-gray-700 text-[0.5rem]">
						{t('(coming soon)')}
					</span>
				</div>
			</Link>
			<Link
				href=""
				className="flex flex-row items-center underline decoration-gray-400  decoration-2 underline-offset-4 cursor-not-allowed text-black gap-1 hover:opacity-100 transition-opacity duration-300 group">
				<MenuBookIcon className=" group-hover:text-gray-700" />
				<div className="relative flex flex-col">
					<span className=" group-hover:text-gray-700">{t('Dictionary')}</span>
					<span className=" absolute -bottom-3 group-hover:text-gray-700 text-[0.5rem]">
						{t('(coming soon)')}
					</span>
				</div>
			</Link>
		</div>
	);
};

export default LinkLists;
