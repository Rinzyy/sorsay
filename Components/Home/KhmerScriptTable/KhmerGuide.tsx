import React from 'react';
import { VowelA, VowelCombo, VowelO } from '../../../lib/Data/TableData';
import { useTranslation } from 'next-i18next';

// Utility function to generate rows
const generateRows = (characters: string[]) => {
	const rows: string[][] = [];
	for (let i = 0; i < characters.length; i += 5) {
		if (characters.length - i === 8) {
			rows.push(characters.slice(i, i + 4));
			rows.push(characters.slice(i + 4, i + 8));
			break;
		} else {
			rows.push(characters.slice(i, i + 5));
		}
	}
	return rows;
};

const renderCell = (char: string) => (
	<td
		key={char}
		className={`border h-16 px-2`}>
		<div
			className={` ${
				VowelCombo[char]
					? 'lg:w-[7rem] md:w-24 gap-0 py-1 px-2 md:gap-1 flex-col justify-around'
					: 'lg:w-24 md:w-20 gap-2 text-base'
			} flex md:flex-row items-center gap-2 justify-between  `}>
			<p className="m-auto text-xl font-semibold">{char}</p>
			{VowelCombo[char] ? <p>=</p> : null}
			<div className={`relative m-auto  items-start whitespace-nowrap  `}>
				{VowelCombo[char] ? (
					<p className=" -top-2 -left-2 text-xl absolute text-primary">*</p>
				) : (
					''
				)}
				<p>[{VowelA[char]}]</p>
			</div>
		</div>
	</td>
);

const KhmerGuide = () => {
	const { t } = useTranslation('common');

	const rows = generateRows(Object.keys(VowelA));
	const regularRows = rows.slice(0, rows.length - 2);
	const lastTwoRows = rows.slice(-2);

	return (
		<div className="">
			<div className=" text-center font-semibold mb-2">{t('Khmer Vowel')}</div>

			<table className="min-w-full border-collapse">
				<tbody>
					{regularRows.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							className={``}>
							{row.map(char => renderCell(char))}
							{row.length < 5 && <td className="border px-4 py-4"></td>}
						</tr>
					))}
				</tbody>
			</table>

			{/* Center the last two rows */}
			<div className="flex -mt-[1px]">
				<table className="border-collapse">
					<tbody>
						{lastTwoRows.map((row, rowIndex) => (
							<tr
								key={rowIndex}
								className={`border ${
									rowIndex === 0 ? 'border-l' : ''
								} h-16 px-2`}>
								{row.map(char => renderCell(char))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

// testing request
export default KhmerGuide;
