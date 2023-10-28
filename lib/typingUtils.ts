import { khmerDictionaryPublic } from './Data/unique_Dictionary_public';

// utils.ts
export const cleanString = (str: string): string => {
	return str
		.normalize('NFC')
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.trim();
};

export const calculateAccuracy = (
	userInput: string,
	targetWords: string[]
): number => {
	const inputWords = userInput.split(/\s+/).map(word => cleanString(word));

	let correctCount = 0;
	const comparisonLength = Math.min(inputWords.length, targetWords.length);

	for (let i = 0; i < comparisonLength; i++) {
		if (inputWords[i] === targetWords[i]) {
			correctCount++;
		}
	}

	return (correctCount / targetWords.length) * 100;
};

// Assuming you've already defined khmerDictionaryPublic as specified...

// Function to get a random word from the khmerDictionaryPublic object
export function getRandomWord() {
	// Get all keys of the object (i.e., 'k', 'j', 'd', ...)
	const keys = Object.keys(khmerDictionaryPublic);
	let minValue = 100;
	let maxValue = 400;
	// Select a random key
	const randomKey =
		keys[Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue];
	// Get the word list corresponding to the random key
	const wordList = khmerDictionaryPublic[randomKey];

	// If the wordList is an array, select a random element; if it's a single string, return it
	if (Array.isArray(wordList)) {
        return {
      key: randomKey,
      word: wordList[Math.floor(Math.random() * wordList.length)],
    };
		
	} else {
		 return {
      key: randomKey,
      word: wordList,
    };
	}
}

// // Function to get multiple random words with a space between them
// export function getRandomWords(count: number) {
// 	return Array.from({ length: count }, getRandomWord).join(' ');
// }

export function getRandomWords(count: number) {
  const randomWordPairs = Array.from({ length: count }, getRandomWord);
  const randomKeys = randomWordPairs.map(pair => pair.key);
  const randomWords = randomWordPairs.map(pair => pair.word);
  
  return { keys: randomKeys, words: randomWords };
}