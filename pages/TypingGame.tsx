import React, { useState, useEffect, useCallback } from 'react';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import { useDispatch, useSelector } from 'react-redux';
import TypingTextBox from '../Components/TextEditor/TypingTextBox';

const randomWords = 'ដែល ខ្ញុំ ទៅ';

const TypingGame = () => {
	const [timer, setTimer] = useState(1000);
	const [wordCount, setWordCount] = useState(0);
	const [feedback, setFeedback] = useState('');
	const [userInput, setUserInput] = useState('');
	const [finish, setFinish] = useState(false);

	// const [randomWords, setRandomWords] = useState([
	// 	'computersec',
	// 	'xaert',
	// 	'flexasd',
	// ]);
	const typingInput = useSelector(
		(state: any) => state.typingControl.inputKhmerString
	);
	const dispatch = useDispatch();

	const calculateAccuracy = useCallback(() => {
		// Split the user input into words, filtering out any empty strings (which can happen if there are multiple spaces between words).
		const inputWords = userInput.trim().split(' ');
		const randomW = randomWords.trim().split(' ');
		let a = inputWords[1];
		let b = randomW[1];
		//can compare perfectly fine but not array
		const isCorrecrt = a === b;
		console.log('yes', a, b);
		let correctCount = 0;

		// Assuming that the length of inputWords and randomWords is the same, and the words are in the correct order.
		// You may need to adjust this if your game logic is different.
		for (let i = 0; i < randomW.length; i++) {
			if (inputWords[i] && inputWords[i] === randomW[i]) {
				correctCount++;
			}
		}

		// Calculate accuracy as the percentage of correct words
		// This is optional, based on whether you want to display accuracy as a count or percentage.
		const accuracy = (correctCount / randomWords.length) * 100;

		setWordCount(correctCount); // You might want to rename this state to 'correctCount' for clarity
		console.log(`Correct words: ${correctCount}, Accuracy: ${accuracy}%`);

		// If you need to display feedback based on accuracy, you can set it here
		if (accuracy === 100) {
			setFeedback('Great job! Keep it up!');
		} else if (accuracy >= 75) {
			setFeedback('Nice work! Try to get all the words correct next time.');
		} else {
			setFeedback('Keep practicing to improve your accuracy.');
		}
	}, [typingInput, randomWords]);

	useEffect(() => {
		const timerId = setTimeout(() => {
			if (timer > 0) setTimer(timer - 1);
			else endGame();
		}, 1000);

		return () => clearTimeout(timerId);
	}, [timer]);

	useEffect(() => {
		if (typingInput) {
			calculateAccuracy();
		}
	}, [typingInput]);

	const endGame = () => {
		setFinish(true);
		setWordCount(0);
	};

	const displayRandomWords = () => {
		// Display the random words and compare each random word to inputWords,
		// apply the appropriate Tailwind CSS class for coloring.
		return randomWords
			.trim()
			.split(' ')
			.map((word, index) => {
				// Return the word with the class applied
				return (
					<span key={index}>
						{word}
						{index < randomWords.length - 1 ? ' ' : ''}{' '}
						{/* This ensures space between words */}
					</span>
				);
			});
	};
	const handleInputChange = (e: any) => {
		setUserInput(e.target.value);
	};

	return (
		<div className="min-h-[90vh] flex flex-col gap-10 -mt-12 items-center justify-center">
			{/* Header */}
			<div className="bg-DarkerGray text-gray-700 w-[70vh] font-semibold h-12 rounded-lg flex-row flex gap-2 items-center justify-evenly px-2">
				<div className="flex flex-row gap-2 items-center">
					<p className="text-primary font-bold">Word</p>
					<p>Quote</p>
				</div>
				<p>|</p>
				<div className="flex flex-row gap-2 items-center">
					<p className="text-primary">10</p>
					<p>25</p>
					<p>40</p>
				</div>
				<p>|</p>
				<div className="flex flex-row gap-3 items-center">
					<div className="flex flex-row gap-1 items-center">
						- <p className="text-sm">WPM</p>
					</div>
					<div className="flex flex-row gap-1 items-center">
						<HourglassBottomIcon className="text-sm" /> {timer}
					</div>
					<div className="flex flex-row gap-1 items-center">
						<SpellcheckIcon className="text-sm mt-[1px]" /> {wordCount}/10
					</div>
				</div>
			</div>

			{finish ? (
				/* Game Over Screen */
				<div className="w-auto text-xl items-center justify-center flex flex-col gap-4 p-6 border-2 border-gray-400 border-dashed rounded-lg ">
					<div className="flex flex-row justify-between gap-4">
						<div className="flex flex-col justify-center items-center">
							<p>WPM</p>
							<p className="text-4xl">90</p>
						</div>
						<div className="flex flex-col justify-center items-center">
							<p>Accuracy</p>
							<p className="text-4xl">90%</p>
						</div>
					</div>
					<div className="flex flex-col justify-center items-center">
						<p>Your better than 90%</p>
					</div>
					<div className="flex flex-col justify-center items-center">
						<p>Mistakes</p>
						<p className="font-semibold">NONE</p>
					</div>
					<div className="flex flex-col justify-center items-center">
						<p>Source</p>
						<p>-</p>
					</div>
					<div className="text-gray-600 mt-2">{feedback}</div>
					<div>
						<button>Next</button>
						<button>Restart</button>
					</div>
				</div>
			) : (
				/* Game In Progress Screen */
				<div className="w-3/4 p-6 border-2 border-gray-400 border-dashed rounded-lg ">
					<p className="text-2xl text-black mb-4 px-2 select-none">
						{displayRandomWords()}
					</p>
					<p>{typingInput}</p>
					<TypingTextBox />
					<input
						type="text"
						value={userInput}
						onChange={handleInputChange}
						placeholder="Type something..."
					/>
					<div className="text-gray-600 mt-2">{feedback}</div>
				</div>
			)}
		</div>
	);
};

export default TypingGame;
