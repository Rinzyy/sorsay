import React from 'react';
import { useTranslation } from 'next-i18next';

const KhmerIndeVowel = ({ khmerToRoman }: any) => {
	// Define a mapping of Khmer to Roman characters
	const khmerCharacters = Object.keys(khmerToRoman);
	const { t } = useTranslation('common');
	// Split khmerCharacters into rows of 5 characters each but exclude the last 8 characters
	const rows = [];
	for (let i = 0; i < khmerCharacters.length; i += 5) {
		rows.push(khmerCharacters.slice(i, i + 5));
	}

	// Separate the last two rows

	const renderCharacter = (char: string) => {
		return (
			<div
				className={`lg:w-24 md:w-20 flex flex-row justify-between gap-2 text-base`}>
				<p className="m-auto text-xl font-semibold">{char}</p>
				<p className="m-auto text-end text-gray-600">[{khmerToRoman[char]}]</p>
			</div>
		);
	};

	return (
		<div className="">
			<div className="text-center font-semibold mb-2">
				{t('Khmer Independent Vowel')}
			</div>
			<table className="min-w-full border-collapse">
				<tbody>
					{rows.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{row.map((char, columnIndex) => (
								<td
									key={columnIndex}
									className={`border ${
										columnIndex === 0 ? 'border-l' : ''
									} h-16 px-2`}>
									{renderCharacter(char)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default KhmerIndeVowel;
