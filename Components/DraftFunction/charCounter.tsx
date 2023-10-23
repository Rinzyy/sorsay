// characterCounter.ts

import { useState } from 'react';

export const useCharacterCounter = () => {
	const [charCCount, setCharCount] = useState<number>(0);
	const [startTime, setStartTime] = useState<number | null>(null);

	const startTimer = () => {
		if (!startTime) {
			setStartTime(Date.now());
		}
	};

	const computeCPM = () => {
		if (startTime) {
			const differenceInMinutes = (Date.now() - startTime) / 60000;
			return Math.floor(charCCount / differenceInMinutes);
		}
		return 0;
	};

	const increaseCharCount = (newCount: number) => {
		setCharCount(newCount);
		startTimer();
	};

	return { charCCount, increaseCharCount, computeCPM };
};
