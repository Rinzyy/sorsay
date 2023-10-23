import React, {
	useRef,
	useState,
	useEffect,
	ChangeEvent,
	KeyboardEvent,
} from 'react';
import {
	compareStrings,
	harmonizeStrings,
	levenshteinDistanceVowels,
} from '../../lib/RomanizedSearch';
import CaretBox from '../DraftFunction/CaretBox';
import { useCaretPositionTextArea } from '../DraftFunction/GetCaretPositionTextArea';
import { UpdateCommonlyTypeWord } from '../../lib/FirebaseFunction';
import { useDispatch, useSelector } from 'react-redux';
import { OnChangeKhmerString } from '../../lib/slices/typingSlice';
import { fetchPredictionsDictionary } from '../../lib/DictionarySearch';

interface EditableValueProps {
	defaultValue?: string;
}

const getRowCount = (text: string): number => {
	const lineBreaks = (text.match(/\n/g) || []).length;
	return lineBreaks + 1; // +1 for the current line
};
const TypingTextBox: React.FC<EditableValueProps> = ({
	defaultValue = ' ',
}) => {
	const { inputRef, caretPosition } = useCaretPositionTextArea();
	const [showCaretBox, setShowCaretBox] = useState(false);
	const [items, setItems] = useState<string[]>([]);
	const [focusedIndex, setFocusedIndex] = useState<number>(0);
	const [userInput, setUserInput] = useState<string>('');
	const [startOfEditedWord, setStartOfEditedWord] = useState<number>(0);
	const [endOfEditedWord, setEndOfEditedWord] = useState<number>(0);
	const [rowCount, setRowCount] = useState<number>(getRowCount(defaultValue));
	const [replacedWords, setReplacedWords] = useState<string[]>([]);
	const input = useSelector(
		(state: any) => state.typingControl.inputKhmerString
	);

	const dispatch = useDispatch();

	useEffect(() => {
		setRowCount(getRowCount(userInput));
	}, [userInput]);

	const updateEditedWordBounds = () => {
		if (!inputRef.current) return;

		const position = inputRef.current.selectionStart || 0;
		const stringUpToCaret = userInput.slice(0, position);
		const match = stringUpToCaret.match(/[\w.'"/;,<>.:]+$/);

		if (!match) return;

		const start = position - match[0].length;
		const end = position;

		setStartOfEditedWord(start);
		setEndOfEditedWord(end);
	};

	useEffect(() => {
		setShowCaretBox(caretPosition.left > 0);
	}, [caretPosition]);

	useEffect(updateEditedWordBounds, [userInput, inputRef]);

	const handleInputValueChange = (value: string) => {
		setUserInput(value);
	};
	const handleReplacedWord = (value: string) => {
		// Step 2: Add the newly replaced word to the state variable
		dispatch(OnChangeKhmerString(value));
		console.log(input + 'reducer');
		// You can also perform other actions related to replaced words here if needed.
	};

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const input = e.target.value;
		setUserInput(input);
		handleInputValueChange?.(input);

		const currentWord = input
			.slice(startOfEditedWord, endOfEditedWord + 1)
			.trim();

		let predictions;
		if (currentWord.length < 20) {
			predictions = fetchPredictionsDictionary(currentWord);
		}

		setItems(currentWord ? predictions || [] : []);
		setFocusedIndex(0);
	};

	const handleItemSelection = (selectedItem: string) => {
		const updatedInput = `${userInput.substring(
			0,
			startOfEditedWord
		)}${selectedItem}${userInput.substring(endOfEditedWord)}`;

		setUserInput(updatedInput);
		setItems([]);

		if (inputRef.current) {
			inputRef.current.value = updatedInput;
			const newCaretPosition = startOfEditedWord + selectedItem.length;
			inputRef.current.setSelectionRange(newCaretPosition, newCaretPosition);
			setStartOfEditedWord(newCaretPosition);
		}
	};

	const resetEditedWord = (word: string) => {
		const updatedInput = `${userInput.substring(
			0,
			startOfEditedWord
		)}${word}${userInput.substring(endOfEditedWord)}`;

		setUserInput(updatedInput);
		handleReplacedWord?.(updatedInput);

		setItems([]);

		if (inputRef.current) {
			inputRef.current.value = updatedInput;
			const newCaretPosition = startOfEditedWord + word.length;
			inputRef.current.setSelectionRange(newCaretPosition, newCaretPosition);
			setStartOfEditedWord(newCaretPosition);
		}
	};

	// const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
	// 	externalHandleKeyDown?.(e);
	// 	const currentText = userInput
	// 		.slice(startOfEditedWord, endOfEditedWord + 1)
	// 		.trim();

	// 	if (e.keyCode === 13 || (e.key === ' ' && e.shiftKey)) {
	// 		if (currentText) {
	// 			const replacement =
	// 				currentText +
	// 				(endOfEditedWord === userInput.length ? ' \u200B' : ' ');
	// 			resetEditedWord(replacement);
	// 			e.preventDefault();
	// 		}
	// 	} else if (e.key === 'Tab') {
	// 		e.preventDefault();
	// 		if (e.shiftKey) {
	// 			setFocusedIndex(prevIndex =>
	// 				prevIndex > 0 ? prevIndex - 1 : items.length - 1
	// 			);
	// 		} else {
	// 			setFocusedIndex(prevIndex => (prevIndex + 1) % items.length);
	// 		}
	// 	} else if (e.keyCode == 32 || e.key == ' ') {
	// 		if (currentText) {
	// 			const replacement = items[focusedIndex] || currentText;
	// 			onReplacedWord?.(replacement);
	// 			resetEditedWord(replacement);
	// 			e.preventDefault();
	// 		}
	// 	}
	// };
	const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
		// Explicitly cast nativeEvent to InputEvent to access the data property
		const inputEvent = e.nativeEvent as InputEvent;

		if (inputEvent.data) {
			const charCode = inputEvent.data.charCodeAt(0);
			console.log(`Char Code: ${charCode}`);

			if (charCode === 32) {
				// ASCII for Space
				const currentText = userInput
					.slice(startOfEditedWord, endOfEditedWord + 1)
					.trim();

				if (currentText) {
					const replacement = (items[focusedIndex] || currentText) + ' \u200B';
					resetEditedWord(replacement);
					UpdateCommonlyTypeWord(currentText, replacement);

					e.preventDefault();
				}
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		let keyCode = e.keyCode || e.which;

		if (keyCode === 0 || keyCode === 229) {
			keyCode = e.currentTarget.value.charCodeAt(
				e.currentTarget.selectionStart - 1
			);
		}
		const currentText = userInput
			.slice(startOfEditedWord, endOfEditedWord + 1)
			.trim();

		if (e.key === 'Enter' || (e.key === ' ' && e.shiftKey)) {
			// Handle Enter
			if (currentText) {
				e.preventDefault();
				const replacement =
					currentText +
					(endOfEditedWord === userInput.length ? ' \u200B' : ' ');
				resetEditedWord(replacement);
			}
		} else if (e.key === 'Tab') {
			e.preventDefault();
			setFocusedIndex(
				e.shiftKey
					? prevIndex => (prevIndex > 0 ? prevIndex - 1 : items.length - 1)
					: prevIndex => (prevIndex + 1) % items.length
			);
		}
		// } else if (e.keyCode === 32) {
		// 	let a = levenshteinDistanceVowels('sroyon', 'srayong');
		// 	let b = compareStrings('chello', 'pello');
		// 	console.log(a);
		// 	console.log(b);
		// 	// ASCII for Space
		// 	const currentText = userInput
		// 		.slice(startOfEditedWord, endOfEditedWord + 1)
		// 		.trim();

		// 	if (currentText) {
		// 		const replacement = items[focusedIndex] || currentText;
		// 		onReplacedWord?.(replacement);
		// 		resetEditedWord(replacement);
		// 		e.preventDefault();
		// 	}
		// }
	};

	return (
		<div className=" w-full flex flex-col gap-8 border-t-2 border-black border-dotted">
			<textarea
				ref={inputRef}
				className=" w-full min-h-auto resize-none overflow-hidden text-2xl bg-Grayesh border-none outline-none focus:ring-0 focus:outline-none py-8 focus:border-none"
				onChange={handleInputChange}
				autoCapitalize="none"
				autoCorrect="off"
				onKeyDown={handleKeyDown}
				onInput={handleInput}
				// onKeyDown={handleKeyDown}
				placeholder="Type here . . ."
				rows={rowCount}
				style={{ marginBottom: '20px' }}
			/>
			{showCaretBox && (
				<CaretBox
					items={items}
					baseItems={items}
					focusedIndex={focusedIndex}
					caretPosition={caretPosition}
					onSelectItem={handleItemSelection}
				/>
			)}
		</div>
	);
};

export default TypingTextBox;
