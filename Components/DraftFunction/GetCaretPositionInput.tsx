import { useRef, useState, useEffect } from 'react';

interface CaretPosition {
	top: number;
	left: number;
}

export const useCaretPositionInput = () => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [caretPosition, setCaretPosition] = useState<CaretPosition>({
		top: 0,
		left: 0,
	});

	// [rest of the caret positioning code...]
	useEffect(() => {
		const getCaretPosition = () => {
			if (inputRef.current) {
				const inputRect = inputRef.current.getBoundingClientRect();
				const caretPosition = inputRef.current.selectionEnd;
				const inputText = inputRef.current.value;

				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');

				if (!context) {
					console.error('2D rendering context not available.');
					return;
				}

				context.font = window.getComputedStyle(inputRef.current).font as string;

				const textWidth = context.measureText(
					inputText.substr(0, caretPosition || 0)
				).width;
				const caretX = inputRect.left + textWidth;

				const caretY = inputRect.bottom;

				setCaretPosition({ top: caretY, left: caretX });
			}
		};

		// Initial call to getCaretPosition and event listener setup
		getCaretPosition();
		inputRef.current?.addEventListener('input', getCaretPosition);

		// Clean up the event listener when the component unmounts
		return () => {
			inputRef.current?.removeEventListener('input', getCaretPosition);
		};
	}, []);

	return { inputRef, caretPosition };
};
