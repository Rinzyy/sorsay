import { completeKhmerDictionary } from './Data/unique_Dictionary_public';
import { getClosestMatchesDictionary } from './RomanizedSearch';

// Define the fetchPredictions function
export const fetchPredictionsDictionary = (inputWord: string) => {
	let cleanPredictions = searchInDictionary(inputWord);
	console.log(cleanPredictions);

	// Assuming you still want to use the weight system, though it's unclear how it works with the new format
	let weight = 3;
	if (inputWord.length > 6) {
		weight = 4;
	} else if (inputWord.length > 4) {
		weight = 3;
	}
	if (inputWord.length < 4) {
		weight = 2;
	}

	//private for now
	// If the results are still less than 6, add fuzzy matching results
	// if (cleanPredictions.length < 5) {
	// 	const fuzzyMatches = getClosestMatchesDictionary(inputWord, weight);

	// 	// Filter out items from fuzzyMatches that are already in cleanPredictions
	// 	fuzzyMatches.forEach(item => {
	// 		if (!cleanPredictions.includes(item)) {
	// 			cleanPredictions.push(item);
	// 		}
	// 	});
	// }

	// Ensure the results don't exceed 6
	return cleanPredictions.slice(0, 6);
};

export const searchInDictionary = (inputWord: string) => {
	const matchingWords: string[] = [];
	for (let word in completeKhmerDictionary) {
		// dont harmonized yet the input word and the current dictionary word
		const [InputWord, DictionaryWord] = [inputWord, word];

		if (InputWord === DictionaryWord) {
			const value = completeKhmerDictionary[word];
			if (typeof value === 'string') {
				matchingWords.unshift(value); // Place it at the beginning
			} else if (Array.isArray(value)) {
				matchingWords.unshift(...value); // Place them at the beginning
			}
		}
	}
	return matchingWords.slice(0, 5);
};
