import React, { useState } from 'react';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { AddMissingWord } from '../../lib/FirebaseFunction';
import { useTranslation } from 'next-i18next';

const MissingWordForm = () => {
	const { t } = useTranslation('common');
	const [khmerForm, setKhmerForm] = useState('');
	const [romanizedForm, setRomanizedForm] = useState('');
	const [sent, setSent] = useState<boolean>(false);

	const handleSubmit = async () => {
		if (khmerForm && romanizedForm) {
			AddMissingWord(khmerForm, romanizedForm);
			setKhmerForm('');
			setRomanizedForm('');
			setSent(true);

			// Reset the "sent" state to false after 10 seconds
			setTimeout(() => {
				setSent(false);
			}, 5000);
		} else {
			// Handle case where inputs are not filled
		}
	};

	return (
		<div className="relative flex flex-col items-center gap-1 border-t-2 pt-8">
			<p className="absolute lg:left-1 top-2 text-sm text-gray-500">
				{t('Missing word?')}
			</p>
			<input
				value={khmerForm}
				onChange={e => setKhmerForm(e.target.value)}
				className="rounded-md border-black bg-Grayesh shadow-sm px-4 py-2"
				placeholder="Khmer Form"
				type="text"
			/>

			<SyncAltIcon className="rotate-90 text-sm" />
			<input
				value={romanizedForm}
				onChange={e => setRomanizedForm(e.target.value)}
				className="rounded-md border-black bg-Grayesh px-4 py-2"
				placeholder="Romanized Form"
				type="text"
			/>
			<button
				onClick={handleSubmit}
				className={`mt-2 border px-6 py-2 text-xl bg-Whitesh flex flex-row justify-center items-center
          rounded-md shadow-md text-primary border-primary hover:scale-102 active:scale-95 transition-all duration-300 
          disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
						sent ? 'cursor-not-allowed' : ' '
					}`}
				disabled={sent}>
				<span>{sent ? t('Received') : t('Request')}</span>
			</button>
		</div>
	);
};

export default MissingWordForm;
