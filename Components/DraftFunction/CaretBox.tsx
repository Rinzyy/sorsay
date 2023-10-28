import React, { useState } from 'react';

interface CaretBoxProps {
	items: string[];
	baseItems: string[];
	caretPosition: {
		top: number;
		left: number;
	};
	focusedIndex: number; // <-- Add the focusedIndex prop
	onSelectItem: (item: string) => void;
}

const CaretBox: React.FC<CaretBoxProps> = ({
	items,
	baseItems,
	caretPosition,
	focusedIndex,
	onSelectItem,
}) => {
	if (items.length === 0) {
		return null;
	}

	return (
		<div
			className="caret-box text-center bg-white border border-gray-300 rounded-lg text-md md:text-sm flex flex-col md:flex-row gap-1 text-gray-600 p-[3px] shadow-md"
			style={{
				position: 'absolute',
				top: caretPosition.top + 'px',
				left: caretPosition.left + 'px',
			}}>
			{items.map((item, index) => (
				<div
					key={index} // <-- Move the key prop here
					className={`relative flex flex-row items-center rounded-md pr-2 pt-1 pb-2 pl-2 cursor-pointer  ${
						index === focusedIndex
							? ` text-white bg-blue-500 font-semibold`
							: ''
					} active:bg-blue-500 active:text-white`}
					onClick={() => {
						onSelectItem(item);
					}} // <-- Add this line
				>
					<a className=" mr-2">{index + 1}</a>
					<a>{item}</a>
				</div>
			))}
		</div>
	);
};

export default CaretBox;
