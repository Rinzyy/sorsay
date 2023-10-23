import { useRef, useState, useEffect } from 'react';

interface CaretPosition {
	top: number;
	left: number;
}

export const useCaretPositionTextArea = () => {
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [caretPosition, setCaretPosition] = useState<CaretPosition>({
		top: 0,
		left: 0,
	});

	const getCaretPosition = () => {
		if (inputRef.current && canvasRef.current) {
			const inputRect = inputRef.current.getBoundingClientRect();
			const context = canvasRef.current.getContext('2d');

			if (!context) {
				console.error('2D rendering context not available.');
				return;
			}

			context.font = window.getComputedStyle(inputRef.current).font as string;
			const inputValue = inputRef.current.value;
			const lines = inputValue
				.substr(0, inputRef.current.selectionEnd)
				.split('\n');
			const currentLine = lines[lines.length - 1];
			const textWidth = context.measureText(currentLine).width;

			const paddingLeft = parseInt(
				window.getComputedStyle(inputRef.current).paddingLeft,
				10
			);
			const paddingRight = parseInt(
				window.getComputedStyle(inputRef.current).paddingRight,
				10
			);
			const availableWidth = inputRect.width - paddingLeft - paddingRight;

			// Calculate average character width
			const avgCharWidth = textWidth / currentLine.length;

			// Calculate wrapped lines
			const wrappedLines = Math.floor(textWidth / availableWidth);
			const caretX =
				(textWidth % availableWidth) + inputRect.left + paddingLeft;

			const lineHeight = parseInt(
				window.getComputedStyle(inputRef.current).lineHeight,
				10
			);
			const totalLinesBeforeCaret = lines.length + wrappedLines - 1; // Added wrappedLines
			const caretY =
				inputRect.top + lineHeight * totalLinesBeforeCaret + lineHeight * 2.5;

			setCaretPosition({ top: caretY, left: caretX });
		}
	};
	//temp fix
	// need to adust height and weight when it textwrap, it break everything

	useEffect(() => {
		if (!canvasRef.current) {
			canvasRef.current = document.createElement('canvas');
		}

		getCaretPosition();

		const resizeObserver = new ResizeObserver(getCaretPosition);
		if (inputRef.current) {
			resizeObserver.observe(inputRef.current);
		}

		inputRef.current?.addEventListener('input', getCaretPosition);

		return () => {
			resizeObserver.disconnect();
			inputRef.current?.removeEventListener('input', getCaretPosition);
		};
	}, []);

	return { inputRef, caretPosition };
};
