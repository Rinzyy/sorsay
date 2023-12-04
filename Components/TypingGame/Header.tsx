import React from 'react';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
interface Props {
	AmountWord: number;
	wpm: number;
	userTypedWord: string[];
	changeAmountOfWord: (wordNum: number) => void;
}

const Header: React.FC<Props> = ({
	AmountWord,
	wpm,
	userTypedWord,
	changeAmountOfWord,
}) => {
	const buttonStyle = (amount: number) =>
		`focus:outline-none ${
			amount === AmountWord ? 'text-primary' : 'text-black'
		}`;
	// ... rest of the component

	return (
		<div className="top-[20%]  shadow-md border-2 border-gray-500  text-gray-700 w-[70vh] font-semibold h-12 rounded-lg flex-row flex gap-2 items-center justify-evenly px-2">
			<div className="flex flex-row gap-2 items-center">
				<p className="text-primary font-bold">Word</p>
				{/* <p>Quote</p> */}
			</div>
			<p>|</p>

			<div className="flex flex-row gap-2 items-center">
				{[10, 20, 45].map(amount => (
					<button
						key={amount}
						onClick={() => changeAmountOfWord(amount)}
						className={buttonStyle(amount)}>
						{amount}
					</button>
				))}
			</div>
			<p>|</p>
			<div className="flex flex-row gap-3 items-center">
				<div className="flex flex-row gap-1 items-center">
					{wpm} <p className="text-sm">WPM</p>
				</div>
				{/* <div className="flex flex-row gap-1 items-center">
						<HourglassBottomIcon className="text-sm" /> {timer}
					</div> */}
				<div className="flex flex-row gap-1 items-center">
					<SpellcheckIcon className="text-sm mt-[1px]" />{' '}
					{userTypedWord.length - 1}/{AmountWord}
				</div>
			</div>
		</div>
	);
};

export default Header;
