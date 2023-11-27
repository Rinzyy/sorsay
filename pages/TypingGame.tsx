// TypingGame.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cleanString, getRandomWords } from '../lib/typingUtils';
import { OnChangeKhmerString } from '../lib/slices/typingSlice';
import TypingTextBox from '../Components/TextEditor/TypingTextBox';
import GameOverScreen from '../Components/TypingGame/GameOverScreen';
import WordDisplay from '../Components/TypingGame/WordDisplay';
import Header from '../Components/TypingGame/Header';
import Leaderboard from '../Components/TypingGame/Leaderboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import {
	addPlayerScoreToLeaderboard,
	checkAndUpdateLeaderboard,
	initializeBuckets,
	readPlayerRank,
	updateLeaderboard,
	updateMistakeCounts,
	updateUserLeaderboard,
	updateUserWPM,
} from '../lib/FirebaseFunction';
import { Modal } from '@mui/material';

const TypingGame: React.FC = () => {
	const [feedback, setFeedback] = useState('');
	const [AmountWord, setAmountWord] = useState(20);
	const [userTypedWord, setUserTypedWord] = useState([]);
	const [randomWords, setRandomWords] = useState('');
	const [rRomanWord, setRRomanWord] = useState('');
	const [mistake, setMistake] = useState<string[]>([]);
	const [romanMistake, setRomanMistake] = useState<string[]>([]);
	const [accuracy, setAccuracy] = useState(0);
	const [finish, setFinish] = useState(false);
	const [wpm, setWpm] = useState(0);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [timer, setTimer] = useState(0);

	const [leaderboardModal, setLeaderboardModal] = useState(false);

	const dispatch = useDispatch();
	const typingInput = useSelector(
		(state: any) => state.typingControl.inputKhmerString
	);

	useEffect(() => {
		let randomWordAndKey = getRandomWords(AmountWord);
		setRandomWords(randomWordAndKey.words.join(' '));
		setRRomanWord(randomWordAndKey.keys.join(' '));
	}, [AmountWord]);

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

	const calculateWpm = () => {
		if (timer > 0) {
			const timeElapsed = timer / 60; // Convert seconds to minutes.
			const wordCount = typingInput
				.split(' ')
				.filter((word: any) => word !== '').length; // Filter out empty strings between spaces.
			const newWpm = Math.floor(wordCount / timeElapsed); // Calculate words per minute.
			// console.log(timeElapsed, 'time');
			// console.log(wordCount, 'count');
			if (wordCount > 1) setWpm(newWpm);
		}
	};

	useEffect(() => {
		calculateWpm(); // Run the calculation.
	}, [timer, typingInput]);

	useEffect(() => {
		if (typingInput) {
			calculateAccuracy();
		}
	}, [typingInput]);

	const calculateAccuracy = useCallback(() => {
		// Split and clean user input and random words
		const inputWords = typingInput
			.split(/\s+/)
			.map((word: any) => cleanString(word));
		const randomW = randomWords.split(/\s+/).map(word => cleanString(word));
		const randomRomanW = rRomanWord.split(/\s+/).map(word => cleanString(word));
		setUserTypedWord(inputWords);
		let correctCount = 0;
		const comparisonLength = Math.min(inputWords.length - 1, randomW.length);
		// Compare words from the input with the random words.
		for (let i = 0; i < comparisonLength; i++) {
			// iterate only within the range of the shortest array
			if (inputWords[i] === randomW[i]) {
				correctCount++;
				console.log('correct word:', inputWords[i]);
			} else {
				console.log('missing word, expected:', randomW[i]);
				if (!mistake.includes(randomW[i])) {
					setMistake(prevMistakes => [...prevMistakes, randomW[i]]);
					setRomanMistake(prevMistakes => [...prevMistakes, randomRomanW[i]]);
				}
			}
			console.log(romanMistake);
		}
		// Calculate accuracy percentage
		const accuracy = (correctCount / randomW.length) * 100;
		setAccuracy(accuracy);
		console.log(`Correct words: ${correctCount}, Accuracy: ${accuracy}%`);

		// Provide feedback based on accuracy
		// ... rest of your feedback-related code ...
	}, [typingInput, randomWords]);

	const UpdateUserWPM = () => {
		updateMistakeCounts(mistake);
		checkAndUpdateLeaderboard();
		if (accuracy < 80) return;

		const userWPM = localStorage.getItem('userWPM');
		const storedUser = localStorage.getItem('user');
		if (userWPM) {
			if (wpm > parseInt(userWPM)) {
				if (storedUser) {
					const parsedUser = JSON.parse(storedUser);
					updateUserWPM(parsedUser.uid, wpm);

					localStorage.setItem('userWPM', JSON.stringify(wpm));
				}
			}
		} else {
			if (storedUser) {
				const parsedUser = JSON.parse(storedUser);
				updateUserWPM(parsedUser.uid, wpm);

				localStorage.setItem('userWPM', JSON.stringify(wpm));
			}
		}
	};
	const endGame = () => {
		dispatch(OnChangeKhmerString(''));

		UpdateUserWPM();

		setFinish(true);
	};

	const resetGame = () => {
		setFinish(false);
		setUserTypedWord([]);
		setMistake([]);
		setRomanMistake([]);
		setTimer(0); // Reset timer
		setWpm(0); // Reset wpm
		setAccuracy(0); // Reset accuracy
		setStartTime(null); // Reset start time
	};

	const restartGame = () => {
		resetGame();
		let randomWordAndKey = getRandomWords(AmountWord);
		setRandomWords(randomWordAndKey.words.join(' '));
		setRRomanWord(randomWordAndKey.keys.join(' '));
	};

	const PlayAgain = () => {
		// addPlayerScoreToLeaderboard({
		// 	username: 'nak',
		// 	userId: 'bot5',
		// 	accuracy: 90,
		// 	wpm: 70,
		// });
		resetGame();
	};

	function ModalHandler() {
		setLeaderboardModal(!leaderboardModal);
	}
	const changeAmountOfWord = (wordNum: number) => setAmountWord(wordNum);

	return (
		<div className="relative min-h-[83vh] flex flex-col gap-10 pt-16 items-center justify-start">
			<div className="relative flex flex-col gap-4 items-center ">
				<button
					className="  text-gray-500 flex flex-row items-center gap-2"
					onClick={ModalHandler}>
					<div>
						<LeaderboardIcon className="text-3xl" />
					</div>
					<p>Leaderboard</p>
				</button>
				<Header
					AmountWord={AmountWord}
					wpm={wpm}
					userTypedWord={userTypedWord}
					changeAmountOfWord={changeAmountOfWord}
				/>
			</div>
			{finish ? (
				<GameOverScreen
					wpm={wpm}
					accuracy={accuracy}
					mistake={mistake}
					romanMistake={romanMistake}
					feedback={feedback}
					resetGame={restartGame}
					restartGame={PlayAgain}
				/>
			) : (
				<div className="min-w-[50%] max-w-[80%] p-6 border-2 border-gray-400 border-dashed rounded-lg ">
					<WordDisplay
						typingInput={typingInput}
						randomWords={randomWords}
						rRomanWord={rRomanWord}
					/>
					<TypingTextBox />
					<div className="text-gray-600 mt-2">{feedback}</div>
				</div>
			)}
			<Modal
				open={leaderboardModal}
				onClose={ModalHandler}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<div>
					<div
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto h-auto
 bg-Grayesh rounded-xl md:pt-4 md:pb-10 shadow-2xl p-4">
						<Leaderboard />
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default TypingGame;
