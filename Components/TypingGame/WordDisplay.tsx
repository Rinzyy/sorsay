// WordDisplay.tsx
import React from 'react';

interface WordDisplayProps {
	typingInput: string;
	randomWords: string;
	rRomanWord: string;
}

const cleanString = (str: string) =>
	str
		.normalize('NFC')
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.trim();

const WordDisplay: React.FC<WordDisplayProps> = ({
	typingInput,
	randomWords,
	rRomanWord,
}) => {
	const displayRandomWords = () => {
		const inputWords = typingInput.split(/\s+/).map(word => cleanString(word));
		const randomW = randomWords.split(/\s+/).map(word => cleanString(word));
		const romanW = rRomanWord.split(/\s+/).map(word => cleanString(word));

		const currentWordIndex =
			inputWords.length <= randomW.length
				? inputWords.length - 1
				: randomW.length - 1;

		return randomW.map((word, index) => {
			const isTyped = typeof inputWords[index] !== 'undefined';

			let classes = ' transition-transform';
			let colorClass = 'text-gray-600';

			if (isTyped && index !== currentWordIndex) {
				const isCorrect = word === inputWords[index];
				colorClass = isCorrect ? 'text-green-600' : 'text-red-600';
				classes += isCorrect ? ' scale-105' : ' scale-95'; // Apply scaling only if the word is not the current word being typed
			}
			if (index === currentWordIndex) {
				colorClass = 'text-black';
			}

			return (
				<div
					key={index}
					className="flex flex-col items-center ">
					<span className={`${colorClass} ${classes}`}>{word}</span>
					{romanW[index] && (
						<span className="whitespace-nowrap -mt-1 text-gray-600 text-[0.8rem]">
							{romanW[index]}
						</span>
					)}
				</div>
			);
		});
	};

	return (
		<div className="mx-3 flex flex-wrap gap-2 text-2xl">
			{displayRandomWords()}
		</div>
	);
};

export default WordDisplay;
