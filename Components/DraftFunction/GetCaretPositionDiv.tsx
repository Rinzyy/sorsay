import { useRef, useState, useEffect } from 'react';

interface CaretPosition {
	top: number;
	left: number;
}

export const useCaretPosition = <T extends HTMLElement = HTMLElement>() => {
	const elementRef = useRef<T | null>(null);
	const [caretPosition, setCaretPosition] = useState<CaretPosition>({
		top: 0,
		left: 0,
	});

	useEffect(() => {
		const getCaretPosition = () => {
			if (elementRef.current) {
				const elementRect = elementRef.current.getBoundingClientRect();

				if (elementRef.current instanceof HTMLInputElement) {
					const inputText = elementRef.current.value;
					const caretPosition = elementRef.current.selectionEnd;

					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');

					if (!context) {
						console.error('2D rendering context not available.');
						return;
					}

					context.font = window.getComputedStyle(elementRef.current)
						.font as string;
					const textWidth = context.measureText(
						inputText.substr(0, caretPosition || 0)
					).width;
					const caretX = elementRect.left + textWidth;
					const caretY = elementRect.bottom;

					setCaretPosition({ top: caretY, left: caretX });
				} else {
					const selection = window.getSelection();
					if (selection && selection.rangeCount > 0) {
						const range = selection.getRangeAt(0);

						if (!range.collapsed) {
							return;
						}

						const caretRect = range.getClientRects()[0];
						if (caretRect) {
							setCaretPosition({ top: caretRect.bottom, left: caretRect.left });
						} else {
							// Fallback: Sometimes getClientRects() can be empty, so use the element's rect
							setCaretPosition({
								top: elementRect.bottom,
								left: elementRect.left,
							});
						}
					}
				}
				// else {
				// 	const selection = window.getSelection();
				// 	if (selection && selection.rangeCount > 0) {
				// 		const range = selection.getRangeAt(0);
				// 		const rect = range.getBoundingClientRect();
				// 		setCaretPosition({ top: rect.bottom, left: rect.left });
				// 	}
				// }
			}
		};

		// Initial call to getCaretPosition and event listener setup
		getCaretPosition();

		elementRef.current?.addEventListener('input', getCaretPosition);

		// Listen to keyup and click events to catch manual caret movements
		elementRef.current?.addEventListener('keyup', getCaretPosition);
		elementRef.current?.addEventListener('click', getCaretPosition);

		// Clean up the event listeners when the component unmounts
		return () => {
			elementRef.current?.removeEventListener('input', getCaretPosition);
			elementRef.current?.removeEventListener('keyup', getCaretPosition);
			elementRef.current?.removeEventListener('click', getCaretPosition);
		};
	}, []);

	return { elementRef, caretPosition };
};
