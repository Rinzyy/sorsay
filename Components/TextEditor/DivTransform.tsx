'use client';
import React, {
	useRef,
	useState,
	useEffect,
	ChangeEvent,
	KeyboardEvent,
} from 'react';
import { useCaretPosition } from '../DraftFunction/GetCaretPositionDiv';
import CaretBox from '../DraftFunction/CaretBox';
import { useCharacterCounter } from '../DraftFunction/charCounter';
import { UpdateCommonlyTypeWord } from '../../lib/FirebaseFunction';
import { fetchPredictionsDictionary } from '../../lib/DictionarySearch';

// Create the main functional component
function RomanDiv() {
	// Initialize useRef and useState variables
	const { elementRef, caretPosition } = useCaretPosition<HTMLDivElement>();
	const [showCaretBox, setShowCaretBox] = useState(false);
	const [items, setItems] = useState<string[]>([]);
	const [focusedIndex, setFocusedIndex] = useState<number>(0);
	const [userInput, setUserInput] = useState<string>('');
	// const [finishedWordsLength, setFinishedWordsLength] = useState<number>(-1);
	const [startOfEditedWord, setStartOfEditedWord] = useState<number>(0);
	const [endOfEditedWord, setEndOfEditedWord] = useState<number>(0);
	// useEffect to toggle the caret box visibility
	const [charCount, setCharCount] = useState<number>(0);
	const { charCCount, increaseCharCount, computeCPM } = useCharacterCounter();
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

	// Use useEffect to add an event listener for the resize event
	useEffect(() => {
		const handleResize = () => {
			// Check if the viewport height changes to determine if the keyboard is open
			setIsKeyboardOpen(window.innerHeight < window.outerHeight);
		};

		// Add the event listener
		window.addEventListener('resize', handleResize);

		// Remove the event listener when the component unmounts
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		setShowCaretBox(caretPosition.left > 0);
	}, [caretPosition]);

	function isNodeWithinElement(
		node: Node | null,
		element: HTMLElement
	): boolean {
		while (node) {
			if (node === element) return true;
			node = node.parentNode;
		}
		return false;
	}
	function getClosestDiv(
		node: Node | null,
		rootElement: HTMLDivElement
	): HTMLDivElement | null {
		while (node && node !== rootElement) {
			if (node.nodeType === 1 && (node as HTMLElement).tagName === 'DIV') {
				return node as HTMLDivElement;
			}
			node = node.parentNode;
		}
		// Return the rootElement if no other divs were found up the tree
		return rootElement;
	}

	// Utility to find the nearest parent DIV for a node.
	useEffect(() => {
		if (elementRef.current) {
			let position: number;
			let content: string;

			if (elementRef.current instanceof HTMLInputElement) {
				position = elementRef.current.selectionStart || 0;
				content = elementRef.current.value;
			} else {
				const selection = window.getSelection();

				// Handle the case where the user backspaces all the way.
				if (!elementRef.current.firstChild) {
					const textNode = document.createTextNode('');
					elementRef.current.appendChild(textNode);
				}

				if (
					selection &&
					selection.anchorNode &&
					isNodeWithinElement(selection.anchorNode, elementRef.current)
				) {
					position = selection.anchorOffset;

					// This is where we'll modify the content retrieval
					const currentDiv = getClosestDiv(
						selection.anchorNode,
						elementRef.current
					);

					// If currentDiv is the rootElement and has child divs, use the first child div
					if (currentDiv === elementRef.current && currentDiv.firstChild) {
						content = currentDiv.firstChild.textContent || '';
					} else {
						content = currentDiv?.textContent || '';
					}

					if (!content) return;
				} else {
					console.log('not found');
					return;
				}
			}

			const stringUpToCaret = content.slice(0, position);
			//word and pullstop detection
			const match = stringUpToCaret.match(/[\w.'"/;,<>.:]+$/);

			// const match = stringUpToCaret.match(/\w+$/);
			console.log(content + 'lol');
			if (match) {
				const start = position - match[0].length;
				const end = position;

				setStartOfEditedWord(start);
				setEndOfEditedWord(end);
			}
		}
	}, [userInput, elementRef]);

	const handleItemSelection = (selectedItem: string) => {
		const replacement = selectedItem;
		const updatedInput =
			userInput.substring(0, startOfEditedWord) +
			replacement +
			userInput.substring(endOfEditedWord);

		let textNode = elementRef.current?.firstChild;

		// If the first child isn't a text node, create one.
		if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
			textNode = document.createTextNode(updatedInput);
			elementRef.current?.appendChild(textNode);
		} else {
			// If it is a text node, just update its content.
			textNode.textContent = updatedInput;
		}

		// Setting the caret position
		const range = document.createRange();
		const sel = window.getSelection();
		range.setStart(textNode, startOfEditedWord + replacement.length);
		range.collapse(true);
		sel?.removeAllRanges();
		sel?.addRange(range);

		setUserInput(updatedInput);
		setItems([]);
	};

	const handleInputChange = (e: React.FormEvent<HTMLElement>) => {
		let input: string = '';
		console.log(elementRef.current?.textContent + 'textcontent');
		if (e.currentTarget instanceof HTMLInputElement) {
			input = e.currentTarget.value;
		} else if (e.currentTarget instanceof HTMLElement) {
			const selection = window.getSelection();

			if (
				selection &&
				selection.anchorNode &&
				isNodeWithinElement(selection.anchorNode, e.currentTarget)
			) {
				if (elementRef.current) {
					// This is where we'll modify the content retrieval
					const currentDiv = getClosestDiv(
						selection.anchorNode,
						elementRef.current
					);

					// If currentDiv is the rootElement and has child divs, use the first child div
					if (currentDiv === elementRef.current && currentDiv.firstChild) {
						input = currentDiv.firstChild.textContent || '';
					} else {
						input = currentDiv?.textContent || '';
					}
					console.log(input + ' handleinput');
				}
			} else {
				return;
			}
		} else {
			return;
		}

		const currentWord = input
			.slice(startOfEditedWord, endOfEditedWord + 1)
			.trim();
		const predictions = fetchPredictionsDictionary(currentWord);

		if (currentWord === '') {
			setItems([]);
		} else {
			setItems(predictions ?? []);
		}

		increaseCharCount(userInput.length);
		setUserInput(input);
		setFocusedIndex(0);
		console.log(userInput + ' input');
	};
	const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
		// Prevent the default paste behavior
		e.preventDefault();

		// Get plain text content from the clipboard
		const plainTextContent = e.clipboardData.getData('text/plain');

		// Insert this plain text content at the current caret position
		if (!elementRef.current) return;

		const selection = window.getSelection();
		if (!selection || !selection.anchorNode) return;

		const currentDiv = getClosestDiv(selection.anchorNode, elementRef.current);
		if (!currentDiv) return;

		const input = currentDiv.textContent || '';
		const position = selection.anchorOffset;

		const updatedInput =
			input.slice(0, position) + plainTextContent + input.slice(position);
		const newCaretPosition = position + plainTextContent.length;

		const updateInputAndCaret = (
			updatedInput: string,
			newCaretPosition: number
		) => {
			let textNode = currentDiv.firstChild;

			// If the first child isn't a text node, create one.
			if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
				textNode = document.createTextNode(updatedInput);
				currentDiv.appendChild(textNode);
			} else {
				// If it is a text node, just update its content.
				textNode.textContent = updatedInput;
			}

			// Setting the caret position
			const range = document.createRange();
			const sel = window.getSelection();
			range.setStart(textNode, newCaretPosition);
			range.collapse(true);
			sel?.removeAllRanges();
			sel?.addRange(range);

			setStartOfEditedWord(newCaretPosition);
			setUserInput(updatedInput);
			setItems([]);
		};
		updateInputAndCaret(updatedInput, newCaretPosition);
	};

	// Function to handle keydown events
	const handleKeyDown = (e: KeyboardEvent) => {
		if (!elementRef.current) return;

		const selection = window.getSelection();
		if (!selection || !selection.anchorNode) return;

		const currentDiv = getClosestDiv(selection.anchorNode, elementRef.current);
		if (!currentDiv) return;

		const input = currentDiv.textContent || '';
		const position = selection.anchorOffset;

		const stringUpToCaret = input.slice(0, position);
		// const match = stringUpToCaret.match(/\w+$/);
		const match = stringUpToCaret.match(/[\w.'"/;,<>.:]+$/);

		let start = match ? position - match[0].length : position;
		let end = position;

		const currentWord = input.slice(start, end).trim();

		const updateInputAndCaret = (
			updatedInput: string,
			newCaretPosition: number
		) => {
			let textNode = currentDiv.firstChild;

			// If the first child isn't a text node, create one.
			if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
				textNode = document.createTextNode(updatedInput);
				currentDiv.appendChild(textNode);
			} else {
				// If it is a text node, just update its content.
				textNode.textContent = updatedInput;
			}

			// Setting the caret position
			const range = document.createRange();
			const sel = window.getSelection();
			range.setStart(textNode, newCaretPosition);
			range.collapse(true);
			sel?.removeAllRanges();
			sel?.addRange(range);

			setStartOfEditedWord(newCaretPosition);
			setUserInput(updatedInput);
			setItems([]);
		};

		if (
			// e.key === 'Enter' ||
			e.keyCode === 13 ||
			(e.key === ' ' && e.shiftKey)
		) {
			if (currentWord) {
				e.preventDefault();
				//fix bug of space
				const updatedInput =
					userInput.substring(0, startOfEditedWord) +
					currentWord +
					(endOfEditedWord === userInput.length ? ' \u200B' : ' ') +
					userInput.substring(endOfEditedWord);

				updateInputAndCaret(
					updatedInput,
					startOfEditedWord + currentWord.length + 1
				);
			}
		} else if (e.key === 'Tab') {
			e.preventDefault();
			setFocusedIndex(
				e.shiftKey
					? prevIndex => (prevIndex > 0 ? prevIndex - 1 : items.length - 1)
					: prevIndex => (prevIndex + 1) % items.length
			);
		} else if (e.key === ' ') {
			// Check if the previous character is one of the special characters or a number
			// const lastChar = userInput[endOfEditedWord - 1];
			// const specialChars = '!@#$%^&*()_+[]{}|;:\'",.<>?/\\~-';
			// const isSpecialChar =
			// 	specialChars.includes(lastChar) || (lastChar >= '0' && lastChar <= '9');

			// if (isSpecialChar || items.length == 0) {
			// 	const updatedInput =
			// 		userInput.substring(0, startOfEditedWord) +
			// 		currentWord +
			// 		userInput.substring(endOfEditedWord);
			// 	updateInputAndCaret(
			// 		updatedInput,
			// 		startOfEditedWord + currentWord.length
			// 	);
			// 	return;
			// If it's a special character, treat the space as a regular space
			if (currentWord && items.length > 0) {
				e.preventDefault();
				const replacement = items[focusedIndex] || currentWord;
				const updatedInput =
					userInput.substring(0, startOfEditedWord) +
					replacement +
					userInput.substring(endOfEditedWord);
				updateInputAndCaret(
					updatedInput,
					startOfEditedWord + replacement.length
				);
				UpdateCommonlyTypeWord(currentWord, replacement);
			}
		}
		setCharCount(userInput.length);
	};

	// Return the JSX for the component
	return (
		<div className="p-10 w-full flex flex-col gap-8 ">
			<div
				ref={elementRef} // Use this ref to reference the contenteditable div if needed
				//must be off for temporary fix because it slow down in mobile phone and make it unusuable
				autoCorrect="off"
				className=" w-full min-h-[24rem] bg-white outline-none focus:outline-none rounded-md border-2 border-gray-600 shadow-lg px-8 py-8 focus:border-primary"
				contentEditable="true" // Add the contenteditable attribute
				onInput={handleInputChange} // Use onInput instead of onChange
				onKeyDown={handleKeyDown}
				onPaste={handlePaste}
				defaultValue=" "
				autoCapitalize="none"
				style={{ marginBottom: '20px', textTransform: 'none' }}></div>

			{showCaretBox && (
				<CaretBox
					items={items}
					baseItems={items}
					focusedIndex={focusedIndex}
					caretPosition={caretPosition}
					onSelectItem={handleItemSelection}
				/>
			)}
			{/* <div className=" bottom-0 left-0 w-full bg-white border-t border-gray-600 p-4 z-[1000]">
				The Sticky Component that sticks to the bottom of the page and will soon
				be appear on top of the keyboard if it appear
			</div> */}
		</div>
	);
}

// Export the component as the default export
export default RomanDiv;
