import React from 'react';
import { useTranslation } from 'next-i18next';

const KhmerGuide = ({ khmerToRoman }: any) => {
	// Define a mapping of Khmer to Roman characters
	const khmerCharacters = Object.keys(khmerToRoman);
	const { t } = useTranslation('common');
	// Split khmerCharacters into rows of 5 characters each but exclude the last 8 characters
	const rows = [];
	for (let i = 0; i < khmerCharacters.length - 8; i += 5) {
		rows.push(khmerCharacters.slice(i, i + 5));
	}

	// Separate the last two rows
	const secondToLastRow = khmerCharacters.slice(-8, -4);
	const lastRow = khmerCharacters.slice(-4);

	const renderCharacter = (char: string) => {
		const isVowelO = [
			'ក',
			'ខ',
			'ច',
			'ឆ',
			'ដ',
			'ឋ',
			'ណ',
			'ត',
			'ថ',
			'ប',
			'ផ',
			'ស',
			'ហ',
			'ឡ',
			'អ',
		].includes(char);

		return (
			<div
				className={`lg:w-24 md:w-20 flex flex-row justify-between gap-2 text-base ${
					isVowelO ? 'text-primary' : ''
				}`}>
				<p className="m-auto text-xl font-semibold">{char}</p>
				<p className="m-auto text-end text-gray-600">[{khmerToRoman[char]}]</p>
			</div>
		);
	};

	return (
		<div className="">
			<div className="text-center font-semibold mb-2">
				{t('Khmer Consonant')}
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

					{/* Render the second to last row */}
					<tr>
						{secondToLastRow.map((char, columnIndex) => (
							<td
								key={columnIndex}
								className={`border ${
									columnIndex === 0 ? 'border-l' : ''
								} h-16 px-2 py-2`}>
								{renderCharacter(char)}
							</td>
						))}
					</tr>

					{/* Render the last row */}
					<tr>
						{lastRow.map((char, columnIndex) => (
							<td
								key={columnIndex}
								className={`border ${
									columnIndex === 0 ? 'border-l' : ''
								} h-16 px-2 py-2`}>
								{renderCharacter(char)}
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default KhmerGuide;
