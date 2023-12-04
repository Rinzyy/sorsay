// GameOverScreen.tsx
import React, { useState } from 'react';
import {
	UpdateCommonlyTypeWord,
	UpdateMistakeWord,
} from '../../lib/FirebaseFunction';

interface Props {
	wpm: number;
	accuracy: number;
	mistake: string[];
	romanMistake: string[];
	resetGame: () => void;
	restartGame: () => void;
}

const GameOverScreen: React.FC<Props> = ({
	wpm,
	accuracy,
	mistake,
	romanMistake,
	resetGame,
	restartGame,
}) => {
	const [mistakes, setMistakes] = useState<string[]>(mistake);
	const [romanMistakes, setRomanMistakes] = useState<string[]>(romanMistake);
	const [editIndex, setEditIndex] = useState<number>(-1);
	const [editValue, setEditValue] = useState<string>('');
	// console.log(romanMistake);

	const handleEditClick = (index: number) => {
		setEditIndex(index);
		setEditValue(romanMistakes[index]);
	};

	const handleSubmit = () => {
		if (editIndex !== -1) {
			const updatedRomanMistakes = [...romanMistakes];
			updatedRomanMistakes[editIndex] = editValue;
			setRomanMistakes(updatedRomanMistakes);
			setEditIndex(-1);
			UpdateMistakeWord(updatedRomanMistakes[editIndex], mistake[editIndex]);
			console.log(updatedRomanMistakes[editIndex], mistake[editIndex]);
		}
	};

	const handleCancel = () => {
		setEditIndex(-1);
	};

	return (
		/* Game Over Screen */
		<div className="w-auto text-xl items-center min-w-[24rem] justify-center flex flex-col gap-4 p-6 border-2 border-gray-400 border-dashed rounded-lg ">
			<div className="flex flex-row justify-between gap-4">
				<div className="flex flex-col justify-center items-center">
					<p className=" text-gray-600">WPM</p>
					<p className=" font-bold text-4xl">{wpm}</p>
				</div>
				<div className="flex flex-col justify-center items-center">
					<p className=" text-gray-600">Accuracy</p>
					<p className=" font-bold text-4xl">{accuracy}%</p>
				</div>
			</div>
			{/* <div className="flex flex-col justify-center items-center">
				<p>Your better than 90%</p>
			</div> */}
			<div className="flex flex-col justify-center items-center gap-2">
				<p className=" text-gray-600">Mistakes</p>
				<div className="flex flex-col gap-2 text-2xl">
					<div className="flex-row flex gap-4">
						{mistakes.length === 0 ? (
							<p>NONE</p>
						) : (
							mistakes.map((mistake, index) => (
								<div
									key={index}
									className="flex items-center flex-col justify-center">
									<p className="font-semibold">{mistake}</p>
									{editIndex === index ? (
										<input
											type="text"
											value={editValue}
											onChange={e => setEditValue(e.target.value)}
											className="mt-2 text-md rounded-md bg-DarkerGray border-DarkerGray w-24"
										/>
									) : (
										<p
											className="text-md cursor-pointer"
											onClick={() => handleEditClick(index)}>
											{romanMistakes[index]}
										</p>
									)}
								</div>
							))
						)}
					</div>
				</div>
			</div>
			{editIndex !== -1 ? (
				<div className=" flex flex-row gap-4">
					<button
						className=" border px-3  rounded-md text-primary border-primary"
						onClick={handleSubmit}>
						Submit
					</button>
					<button
						className=" border px-3  rounded-md text-primary border-primary"
						onClick={handleCancel}>
						Cancel
					</button>
				</div>
			) : (
				<p className=" text-gray-600 text-sm">
					Click on the word to request change
				</p>
			)}

			{/* <div className="flex flex-col justify-center items-center">
						<p>Source</p>
						<p>-</p>
					</div> */}
			<div className=" flex flex-row gap-2">
				<button
					className=" underline underline-offset-4 hover:text-primary"
					onClick={resetGame}>
					Next
				</button>
				<button
					className=" underline underline-offset-4 hover:text-primary"
					onClick={restartGame}>
					Try Again
				</button>
			</div>
		</div>
	);
};

export default GameOverScreen;
