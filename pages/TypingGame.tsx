import React, { useState, useEffect, useCallback } from 'react';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import { useDispatch, useSelector } from 'react-redux';
import TypingTextBox from '../Components/TextEditor/TypingTextBox';
import { getRandomWords } from '../lib/typingUtils';
import { OnChangeKhmerString } from '../lib/slices/typingSlice';
// Function to remove invisible characters (like zero-width spaces)
const cleanString = (str: any) =>
	str
		.normalize('NFC')
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.trim();

const TypingGame = () => {
	const [wordCount, setWordCount] = useState(0);
	const [feedback, setFeedback] = useState('');
	const [AmountWord, setAmountWord] = useState(20);
	const [userTypedWord, setUserTypedWord] = useState([]);
	const [randomWords, setRandomWords] = useState('');
	const [rRomanWord, setRRomanWord] = useState('');
	const [finish, setFinish] = useState(false);
	const [wpm, setWpm] = useState(0);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [timer, setTimer] = useState(0);

	const dispatch = useDispatch();
	const typingInput = useSelector(
		(state: any) => state.typingControl.inputKhmerString
	);
	useEffect(() => {
		let randomWordAndKey = getRandomWords(AmountWord);
		setRandomWords(randomWordAndKey.words.join(' '));
		setRRomanWord(randomWordAndKey.keys.join(' '));
	}, [AmountWord]);
	const calculateAccuracy = useCallback(() => {
		// Split and clean user input and random words
		const inputWords = typingInput
			.split(/\s+/)
			.map((word: any) => cleanString(word));
		const randomW = randomWords.split(/\s+/).map(word => cleanString(word));
		setUserTypedWord(inputWords);
		let correctCount = 0;
		const comparisonLength = Math.min(inputWords.length, randomW.length);
		// Compare words from the input with the random words.
		for (let i = 0; i < comparisonLength; i++) {
			// iterate only within the range of the shortest array
			if (inputWords[i] === randomW[i]) {
				correctCount++;
				console.log('correct word:', inputWords[i]);
			} else {
				console.log('missing word, expected:', randomW[i]);
			}
		}
		// Calculate accuracy percentage
		const accuracy = (correctCount / randomW.length) * 100;
		setWordCount(correctCount); // Reflecting correct words count
		console.log(`Correct words: ${correctCount}, Accuracy: ${accuracy}%`);

		// Provide feedback based on accuracy
		// ... rest of your feedback-related code ...
	}, [typingInput, randomWords]);

	useEffect(() => {
		const inputWords = typingInput
			.split(/\s+/)
			.map((word: any) => cleanString(word));
		const randomW = randomWords.split(/\s+/).map(word => cleanString(word));
		if (randomW.length > 3) {
			if (inputWords.length > randomW.length) {
				endGame();
			}
		}
	}, [typingInput]);

	useEffect(() => {
		if (typingInput.length === 1 && startTime === null) {
			setStartTime(Date.now());
		}
	}, [typingInput, startTime]);

	useEffect(() => {
		let timerInterval: NodeJS.Timeout | null = null;

		// Start the timer once the user begins typing.
		if (startTime) {
			timerInterval = setInterval(() => {
				setTimer(prevTime => prevTime + 1); // Increment the timer state every second.
			}, 1000);
		}

		return () => {
			if (timerInterval) {
				clearInterval(timerInterval); // Clear the interval on component cleanup.
			}
		};
	}, [startTime]);

	useEffect(() => {
		const calculateWpm = () => {
			if (timer > 0) {
				const timeElapsed = timer / 60; // Convert seconds to minutes.
				const wordCount = typingInput
					.split(' ')
					.filter((word: any) => word !== '').length; // Filter out empty strings between spaces.
				const newWpm = Math.floor(wordCount / timeElapsed); // Calculate words per minute.
				setWpm(newWpm);
			}
		};

		calculateWpm(); // Run the calculation.
	}, [timer, typingInput]);

	useEffect(() => {
		if (typingInput) {
			calculateAccuracy();
		}
	}, [typingInput]);

	const endGame = () => {
		dispatch(OnChangeKhmerString(''));
		setFinish(true);
		setWordCount(0);
	};
	const resetGame = () => {
		setFinish(false);
	};
	const restartGame = () => {
		setFinish(false);
		let randomWordAndKey = getRandomWords(AmountWord);
		setRandomWords(randomWordAndKey.words.join(' '));
	};
	const changeAmountOfWord = (wordNum: number) => {
		setAmountWord(wordNum);
	};

	// Function to determine button styles dynamically
	const buttonStyle = (amount: number) =>
		`focus:outline-none ${
			amount == AmountWord
				? 'text-primary' // Active style (adjust as necessary)
				: 'text-black' // Default style
		}`;

	const displayRandomWords = () => {
		// Assuming 'typingInput' is the state where user input is stored.
		// Using 'cleanString' function to ensure both input and random words are processed identically.
		const inputWords = typingInput
			.split(/\s+/)
			.map((word: string) => cleanString(word));
		const randomW = randomWords.split(/\s+/).map(word => cleanString(word));
		const romanW = rRomanWord.split(/\s+/).map(word => cleanString(word));

		// Determine the current word index based on the user's last input
		const currentWordIndex =
			inputWords.length <= randomW.length
				? inputWords.length - 1
				: randomW.length - 1;

		// Now we map through the random words, compare them to the user's input, and set the color accordingly.
		return randomW.map((word, index) => {
			// Check if the word has been typed yet
			const isTyped = typeof inputWords[index] !== 'undefined';

			let colorClass = 'text-gray-600'; // Default color for words not compared yet

			if (isTyped) {
				const isCorrect = word === inputWords[index];
				colorClass = isCorrect ? 'text-green-600' : 'text-red-600';
			}

			// Check if it's the current word being compared
			if (index === currentWordIndex) {
				colorClass = 'text-black'; // Use your specific purple color code
			}
			return (
				<div
					key={index}
					className="flex flex-col items-center">
					<span className={colorClass}>{word}</span>
					{romanW[index] && (
						<span className="-mt-1 text-gray-600 text-[0.8rem]">
							{romanW[index]}
						</span>
					)}
				</div>
			);
		});
	};
	return (
		<div className="relative min-h-[90vh] flex flex-col gap-10 -mt-12 items-center justify-center">
			{/* Header */}
			<div className="top-[20%] bg-DarkerGray text-gray-700 w-[70vh] font-semibold h-12 rounded-lg flex-row flex gap-2 items-center justify-evenly px-2">
				<div className="flex flex-row gap-2 items-center">
					<p className="text-primary font-bold">Word</p>
					<p>Quote</p>
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
						{wpm} - <p className="text-sm">WPM</p>
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
						<button onClick={resetGame}>Next</button>
						<button onClick={restartGame}>Restart</button>
					</div>
				</div>
			) : (
				/* Game In Progress Screen */
				<div className="min-w-[50%] max-w-[80%] p-6 border-2 border-gray-400 border-dashed rounded-lg ">
					<div className=" flex flex-wrap gap-2 text-2xl">
						{displayRandomWords()}
					</div>
					<TypingTextBox />

					<div className="text-gray-600 mt-2">{feedback}</div>
				</div>
			)}
		</div>
	);
};

export default TypingGame;
