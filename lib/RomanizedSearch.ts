import { completeKhmerDictionary } from './Data/unique_Dictionary_public';

// Importing the database
export function levenshteinDistanceVowels(s1: string, s2: string): number {
	const m = s1.length;
	const n = s2.length;
	const dp: number[][] = Array.from({ length: m + 1 }, () =>
		Array(n + 1).fill(0)
	);

	const specialChars = new Set([
		'n',
		't',
		'b',
		'ph',
		'p',
		'm',
		'y',
		'l',
		'v',
		's',
		'h',
		'd',
		'k',
		// 'r',
	]);

	for (let i = 0; i <= m; i++) {
		dp[i][0] = i;
	}
	for (let j = 0; j <= n; j++) {
		dp[0][j] = j;
	}

	// Helper function to check if 'r' appears in the first 3 characters
	function hasImportantR(s: string): boolean {
		return s.substring(0, 3).includes('r');
	}

	const s1HasR = hasImportantR(s1);
	const s2HasR = hasImportantR(s2);

	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			const charA = s1.charAt(i - 1);
			const charB = s2.charAt(j - 1);

			if (charA === charB) {
				dp[i][j] = dp[i - 1][j - 1];
				//this just make everytime it has special char, it multiply it
				if (specialChars.has(charA)) {
					dp[i][j] *= 0.5;
				}
			} else {
				const insertCost = dp[i][j - 1] + 1;
				const deleteCost = dp[i - 1][j] + 1;
				const substituteCost = dp[i - 1][j - 1] + 1;

				dp[i][j] = Math.min(insertCost, deleteCost, substituteCost);

				// if (specialChars.has(charA) || specialChars.has(charB)) {
				// 	dp[i][j] += 2;
				// }

				// if (m === n) {
				// 	dp[i][j] -= 1;

				// 	if (dp[i][j] < 0) {
				// 		dp[i][j] = 0;
				// 	}
				// }
			}
		}
	}

	if (n > m) {
		for (let j = m + 1; j <= n; j++) {
			if (!specialChars.has(s2.charAt(j - 1))) {
				dp[m][j] = dp[m][j - 1] + 1;
			} else {
				dp[m][j] = dp[m][j - 1];
			}
		}
	}

	// If s1 has 'r' but s2 doesn't, increase the final distance
	if (s1HasR && !s2HasR) {
		dp[m][n] += 3; // adding a penalty of 3, you can adjust as needed
	}

	// /it compare the khmer word too
	// console.log(dp[m][n] + s1 + s2);
	return dp[m][n];
}

export const getClosestMatchesDictionary = (
	inputWord: string,
	weight: number
) => {
	// Define the threshold constant
	const threshold = weight;

	// Define an array to store words and their distances
	const wordDistances: { word: string; distance: number }[] = [];

	// Loop through khmerDictionary
	for (let romanized in completeKhmerDictionary) {
		// Finding out if the starting consonant is the same or not for faster search and filtering
		const cachingConsonant = compareStrings(inputWord, romanized);

		// Check if prefixes are not the same and skip the entry
		if (!cachingConsonant) continue;

		// Define the [vowelS1, vowelS2] variables
		const [vowelS1, vowelS2] = harmonizeStrings(inputWord, romanized);

		// Calculate the distance variable
		const distance = levenshteinDistanceVowels(vowelS1, vowelS2);

		// Check if distance is less than or equal to the threshold
		if (distance <= threshold) {
			const value = completeKhmerDictionary[romanized];
			if (typeof value === 'string') {
				wordDistances.push({ word: value, distance });
			} else if (Array.isArray(value)) {
				for (let item of value) {
					wordDistances.push({ word: item, distance });
				}
			}
		}
	}

	//fix everything of sorting
	// Sort wordDistances by distance in ascending order
	wordDistances.sort((a, b) => a.distance - b.distance);

	// Extract the sorted words from wordDistances
	const sortedMatches = wordDistances.map(entry => entry.word);

	return sortedMatches;
};
export function harmonizeStrings(str1: string, str2: string): [string, string] {
	// Change the return type to an array
	// If either string is empty, return them as is
	if (!str1 || !str2) return [str1, str2];

	const charA = str1[0];
	const charB = str2[0];

	let similiarString1 = str1;
	let similiarString2 = str2;

	// Check for special exceptions and harmonize based on conditions
	if (charA === 'b' && charB === 'p') {
		similiarString2 = similiarString2.replace('p', 'b');
	} else if (charA === 'p' && charB === 'b') {
		similiarString1 = similiarString1.replace('p', 'b');
	} else if (charA === 'j' && str2.startsWith('ch')) {
		similiarString2 = similiarString2.replace('ch', 'j');
	} else if (str1.startsWith('ch') && charB === 'j') {
		similiarString1 = similiarString1.replace('ch', 'j');
	}
	//  else if (str1.startsWith('th') && charB === 't') {
	// 	similiarString1 = similiarString1.replace('th', 't');
	// } else if (charA === 't' && str2.startsWith('th')) {
	// 	similiarString2 = similiarString2.replace('th', 't');
	// }
	return [similiarString1, similiarString2]; // Return an array
}

export function compareStrings(str1: string, str2: string): boolean {
	// If either string is empty, return false
	if (!str1 || !str2) return false;

	const charA = str1[0];
	const charB = str2[0];

	// Check for normal first character match
	if (charA === charB) return true;

	// Check for special exceptions
	if (
		(charA === 'b' && charB === 'p') ||
		(charA === 'p' && charB === 'b') ||
		(charA === 'j' && str2.startsWith('ch')) || // For this case, we're comparing the first char of str1 with the first two chars of str2
		(str1.startsWith('ch') && charB === 'j') // Similarly, compare the first two chars of str1 with the first char of str2
	) {
		return true;
	}

	return false;
}

// export function extractConsonant(
// 	s1: string,
// 	s2: string
// ): [string, string] | null {
// 	let prefixLength = 0;

// 	function isSpecialException(charA: string, charB: string): boolean {
// 		return (
// 			(charA === 'b' && charB === 'p') ||
// 			(charA === 'p' && charB === 'b') ||
// 			(charA === 'ch' && charB === 'j')
// 		);
// 	}

// 	while (prefixLength < s1.length && prefixLength < s2.length) {
// 		let char1 = s1.charAt(prefixLength);
// 		let char2 = s2.charAt(prefixLength);

// 		// If next char is "h", add it for 'ch' consideration
// 		if (char1 + s1.charAt(prefixLength + 1) === 'ch') {
// 			char1 += s1.charAt(prefixLength + 1);
// 		}
// 		if (char2 + s2.charAt(prefixLength + 1) === 'ch') {
// 			char2 += s2.charAt(prefixLength + 1);
// 		}

// 		if (char1 === char2 || isSpecialException(char1, char2)) {
// 			prefixLength += char1.length;
// 		} else {
// 			break;
// 		}
// 	}

// 	if (
// 		prefixLength === 0 ||
// 		prefixLength === s1.length ||
// 		prefixLength === s2.length
// 	) {
// 		return null;
// 	}

// 	let suffixLength = 0;
// 	while (suffixLength < s1.length && suffixLength < s2.length) {
// 		let char1 = s1.charAt(s1.length - 1 - suffixLength);
// 		let char2 = s2.charAt(s2.length - 1 - suffixLength);

// 		// If next char is "h", add it for 'ch' consideration
// 		if (s1.charAt(s1.length - 2 - suffixLength) + char1 === 'ch') {
// 			char1 = s1.charAt(s1.length - 2 - suffixLength) + char1;
// 		}
// 		if (s2.charAt(s2.length - 2 - suffixLength) + char2 === 'ch') {
// 			char2 = s2.charAt(s2.length - 2 - suffixLength) + char2;
// 		}

// 		if (char1 === char2 || isSpecialException(char1, char2)) {
// 			suffixLength += char1.length;
// 		} else {
// 			break;
// 		}
// 	}

// 	return [
// 		s1.substring(prefixLength, s1.length - suffixLength),
// 		s2.substring(prefixLength, s2.length - suffixLength),
// 	];
// }
// // Define the levenshteinDistanceVowels function
// export function levenshteinDistanceVowels(s1: string, s2: string): number {
// 	const m = s1.length;
// 	const n = s2.length;
// 	const dp: number[][] = Array.from({ length: m + 1 }, () =>
// 		Array(n + 1).fill(0)
// 	);

// 	for (let i = 0; i <= m; i++) {
// 		dp[i][0] = i;
// 	}
// 	for (let j = 0; j <= n; j++) {
// 		dp[0][j] = j;
// 	}

// 	for (let i = 1; i <= m; i++) {
// 		for (let j = 1; j <= n; j++) {
// 			if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
// 				dp[i][j] = dp[i - 1][j - 1];
// 			} else {
// 				// Calculate the costs
// 				const insertCost = dp[i][j - 1] + 1;
// 				const deleteCost = dp[i - 1][j] + 1;
// 				const substituteCost =
// 					dp[i - 1][j - 1] + protectionCost(s1.charAt(i - 1), s2.charAt(j - 1));

// 				dp[i][j] = Math.min(insertCost, deleteCost, substituteCost);
// 			}
// 		}
// 	}

// 	return dp[m][n];
// }

// Define the substitutionCost function
function protectionCost(charA: string, charB: string): number {
	//khmer consonant doesn't change that much since people are common sense with it
	const protectedConsonants = new Set([
		'n',
		't',
		'b',
		'ph',
		'p',
		'm',
		'y',
		'l',
		'v',
		's',
		'h',
		'd',
		'k',
		'v',
		'r',
	]);

	if (protectedConsonants.has(charA) || protectedConsonants.has(charB)) {
		return 1000; // Large penalty for altering these consonants
	}

	return 1; // Normal substitution cost
}

// export function customLevenshtein(
// 	s1: string | string[],
// 	s2: string | string[]
// ): number {
// 	// Helper function to get the minimum Levenshtein distance for two strings
// 	function getDistance(str1: string, str2: string): number {
// 		const extractedParts = extractConsonant(str1, str2);

// 		// If prefixes are not the same, return a high number (indicating a high distance)
// 		if (!extractedParts) return Infinity;

// 		const [vowelS1, vowelS2] = extractedParts;
// 		return levenshteinDistanceVowels(vowelS1, vowelS2);
// 	}

// 	// If both s1 and s2 are simple strings, just calculate the distance directly
// 	if (typeof s1 === 'string' && typeof s2 === 'string') {
// 		return getDistance(s1, s2);
// 	}

// 	// Convert s1 and s2 to arrays if they aren't already
// 	const s1Array = Array.isArray(s1) ? s1 : [s1];
// 	const s2Array = Array.isArray(s2) ? s2 : [s2];

// 	// Calculate the Levenshtein distance for all combinations and return the minimum distance
// 	let minDistance = Infinity;
// 	for (const str1 of s1Array) {
// 		for (const str2 of s2Array) {
// 			const distance = getDistance(str1, str2);
// 			minDistance = Math.min(minDistance, distance);
// 		}
// 	}

// 	return minDistance;
// }

/////////////
// Assuming extractVowelPart, levenshteinDistanceVowels, and customLevenshtein functions exist elsewhere in your code.

// Define the customLevenshtein function
// function customLevenshtein(s1: string, s2: string): number {
// 	const extractedParts = extractVowelPart(s1, s2);

// 	// If prefixes are not the same, return a high number (indicating a high distance)
// 	if (!extractedParts) return Infinity;

// 	const [vowelS1, vowelS2] = extractedParts;
// 	return levenshteinDistanceVowels(vowelS1, vowelS2);
// }

// // Define the getClosestMatches function
// export const getClosestMatches = (inputWord: string, weight: number) => {
// 	// Define the threshold constant
// 	const threshold = weight;

// 	// Define the matches array
// 	const matches: any = [];

// 	// Loop through khmerDatabase
// 	khmerDatabase.forEach(entry => {
// 		// Define the extractedParts variable
// 		const extractedParts = extractVowelPart(inputWord, entry.romanized);

// 		// Check if prefixes are not the same and skip the entry
// 		if (!extractedParts) return;

// 		// Define the [vowelS1, vowelS2] variables
// 		const [vowelS1, vowelS2] = extractedParts;

// 		// Calculate the distance variable
// 		const distance = levenshteinDistanceVowels(vowelS1, vowelS2);

// 		// Check if distance is less than or equal to threshold
// 		if (distance <= threshold) {
// 			// Push entry.khmer into the matches array
// 			matches.push(entry.khmer);
// 		}
// 	});

// 	// Sort the matches array and limit it to a maximum of 6 results
// 	return matches
// 		.sort(
// 			(a: string, b: string) =>
// 				customLevenshtein(inputWord, a) - customLevenshtein(inputWord, b)
// 		)
// 		.slice(0, 6);
// };

// // Define the fetchPredictions function
// export const fetchPredictions = (inputWord: string) => {
// 	// Define the cleanPredictions constant
// 	const cleanPredictions = searchByType(inputWord, 'Clean');

// 	// Define the shortWordConsonantPredictions constant
// 	const shortWordConsonantPredictions = searchByType(inputWord, 'ShortR');

// 	// Define the largePredictions constant
// 	const largePredictions = searchByType(inputWord, 'LongR');

// 	// Combine the predictions
// 	let combinedPredictions = [
// 		...cleanPredictions,
// 		...shortWordConsonantPredictions,
// 		...largePredictions,
// 	];

// 	// Define the weight variable
// 	let weight = inputWord.length > 6 ? 3 : 2; // Adjust the numbers as desired

// 	// If the combined results are still less than 6, add fuzzy matching results
// 	if (combinedPredictions.length < 6) {
// 		const fuzzyMatches = getClosestMatches(inputWord, weight);
// 		combinedPredictions = [...combinedPredictions, ...fuzzyMatches];
// 	}

// 	// Ensure the results don't exceed 6
// 	return combinedPredictions.slice(0, 6);
// };

// // Define the searchByType function
// export const searchByType = (inputWord: string, type: string) => {
// 	const matchingWords = khmerDatabase
// 		.filter(
// 			entry => entry.romanized.startsWith(inputWord) && entry.type === type
// 		)
// 		.map(entry => entry.khmer)
// 		.slice(0, 5);

// 	return matchingWords;
// }
