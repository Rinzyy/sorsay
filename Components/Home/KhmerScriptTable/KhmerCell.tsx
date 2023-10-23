import React from 'react';
import { useTranslation } from 'next-i18next';

interface WordBank {
	[key: string]: any; // Replace 'any' with the actual type of your wordBank values
}

const renderCell = (char: string, wordBank: WordBank) => (
	<td
		key={char}
		className="border h-16 px-2 py-2">
		<div className="lg:w-24 md:w-20 flex flex-row items-center justify-around gap-1 text-base">
			<p className="text-xl font-semibold">{char}</p>
			<div className="text-center">
				<p className="text-gray-700">[{wordBank[char]}]</p>
			</div>
		</div>
	</td>
);

const KhmerCell = ({ wordBank }: { wordBank: WordBank }) => {
	const { t } = useTranslation('common');
	const characters = Object.keys(wordBank);
	const rows = [];

	// Split characters into rows of 5
	for (let i = 0; i < characters.length; i += 5) {
		rows.push(characters.slice(i, i + 5));
	}

	return (
		<div>
			<div className="text-center font-semibold mb-2">
				{t('Khmer Punctuation')}
			</div>
			<table className="min-w-full border-collapse">
				<tbody className="">
					{rows.map((row, index) => (
						<tr key={index}>{row.map(char => renderCell(char, wordBank))}</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default KhmerCell;
