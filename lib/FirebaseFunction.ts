import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	limit,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
	writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function UpdateCommonlyTypeWord(
	userTyped: string,
	actualKhmerW: string
	// actualRomanW: string
) {
	const wordTypeDoc = doc(db, 'Aksor', actualKhmerW);

	const docSnap = await getDoc(wordTypeDoc);

	if (docSnap.exists()) {
		await runTransaction(db, async transaction => {
			const currentData = docSnap.data();

			transaction.update(wordTypeDoc, {
				count: increment(1),
				userTyped: currentData.userTyped + ', ' + userTyped,
			});
		});
	} else {
		let CommonlyTypedWord = {
			actualKhmerW: actualKhmerW,
			// actualRomanW: actualRomanW,
			count: 1,
			userTyped: userTyped,
		};

		await setDoc(wordTypeDoc, CommonlyTypedWord);
	}

	console.log('send to database');
}

export async function UpdateMistakeWord(
	userTyped: string,
	actualKhmerW: string
	// actualRomanW: string
) {
	const wordTypeDoc = doc(db, 'Aksor', actualKhmerW);

	const docSnap = await getDoc(wordTypeDoc);

	if (docSnap.exists()) {
		const currentData = docSnap.data();
		let updatedMistakes = currentData.mistakedChangeRequest
			? currentData.mistakedChangeRequest + ', ' + userTyped
			: userTyped;

		await updateDoc(wordTypeDoc, { mistakeChangeRequest: updatedMistakes });
		console.log('Mistake word updated in database');
	}

	console.log('send to database');
}

export async function AddUser() {
	// const dispatch = useDispatch();
	try {
		const infoRef = doc(db, 'WebsiteInfo', 'GlobalInfo');
		await runTransaction(db, async transaction => {
			const fuelDoc = await transaction.get(infoRef);
			if (!fuelDoc.exists()) {
				throw 'Document does not exist!';
				//add create user acc merge
			}

			transaction.update(infoRef, { totalUser: increment(1) });
		});
	} catch (e) {
		//error modal
	}
}

export async function AddMissingWord(
	khmerForm: string,
	romanizedForm: string
	// actualRomanW: string
) {
	const missingWordsCollection = collection(
		db,
		'WordFeedbacks',
		'MissingWord',
		'Batch1'
	);
	const wordDoc = doc(missingWordsCollection, khmerForm); // Assuming khmerForm is used as the document ID
	const docSnap = await getDoc(wordDoc);

	if (docSnap.exists()) {
		const currentData = docSnap.data();
		// Word exists, increment count
		await setDoc(
			wordDoc,
			{
				count: increment(1),
				romanizedForm: currentData.romanizedForm + ', ' + romanizedForm,
			},
			{ merge: true }
		);
	} else {
		// Word doesn't exist, create new entry
		await setDoc(wordDoc, {
			khmerForm: khmerForm,
			romanizedForm: romanizedForm,
			count: 1,
		});
	}
}

export async function updateUserLeaderboard(
	userId: string,
	username: string,
	wpm: number,
	accuracy: number
) {
	const userDoc = doc(db, 'leaderboard', userId);

	const docSnap = await getDoc(userDoc);

	if (docSnap.exists()) {
		await runTransaction(db, async transaction => {
			const currentData = docSnap.data();

			const newWpm = Math.max(currentData?.wpm || 0, wpm);
			const newAccuracy = Math.max(currentData?.accuracy || 0, accuracy);

			transaction.update(userDoc, {
				username, // Assuming you want to keep the latest username
				wpm: newWpm,
				accuracy: newAccuracy,
				timestamp: new Date(),
			});
		});
	} else {
		const leaderboardEntry = {
			userId,
			username,
			wpm,
			accuracy,
			timestamp: new Date(),
		};

		await setDoc(userDoc, leaderboardEntry);
	}

	console.log('User data sent to database');
}
export async function getTopPlayers() {
	const playersCollectionRef = collection(db, 'Users');
	const topPlayersQuery = query(
		playersCollectionRef,
		orderBy('wpm', 'desc'),
		limit(10)
	);
	const querySnapshot = await getDocs(topPlayersQuery);

	const topPlayers: any = [];
	querySnapshot.forEach(doc => {
		topPlayers.push(doc.data());
	});

	return topPlayers;
}

export async function updateUserWPM(userId: string, newWPM: number) {
	try {
		// Reference to the user document
		const userRef = doc(db, 'Users', userId);

		// Check if the user exists
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			console.error('User not found');
			return;
		}

		// Get the existing wpm value
		const userData = userSnap.data();
		const existingWPM = userData?.wpm ?? 0;

		// Check if the new wpm is greater than the existing wpm
		if (newWPM > existingWPM) {
			// Update the wpm field of the user
			await updateDoc(userRef, {
				wpm: newWPM,
				LatestHSDate: serverTimestamp(),
			});
			console.log('User WPM and LatestHSDate updated successfully');
		}
	} catch (error) {
		console.error('Error updating user WPM:', error);
	}
}

export async function initializeBuckets() {
	const leaderboardRef = collection(db, 'leaderboard');
	const buckets = [
		{ min: 0, max: 30, count: 0 },
		{ min: 30, max: 50, count: 0 },
		{ min: 50, max: 80, count: 0 },
		{ min: 80, max: 90, count: 0 },
		{ min: 90, max: 100, count: 0 },
		// ... more buckets ...
		{ min: 100, max: 300, count: 0 }, // Catch-all bucket
	];

	for (const index in buckets) {
		const bucketId = (buckets.length - parseInt(index)).toString(); // Counting down from 8 to 1
		const bucket = buckets[index];
		const bucketDocRef = doc(leaderboardRef, bucketId);

		await setDoc(bucketDocRef, {
			range: { min: bucket.min, max: bucket.max },
			count: 0,
		});
	}
	console.log('Buckets initialized');
}
export async function addPlayerScoreToLeaderboard(leaderboardEntry: any) {
	const { username, userId, wpm, accuracy } = leaderboardEntry;

	const userWPM = localStorage.getItem('userWPM');
	//save database cost when wpm is smaller than your previous wpm
	if (userWPM) {
		if (accuracy < 90 && wpm < parseInt(userWPM)) {
			console.log(accuracy, 'low');
			return;
		}
	}
	const leaderboardRef = collection(db, 'leaderboard');

	const bucketsSnapshot = await getDocs(leaderboardRef);

	for (const bucketDoc of bucketsSnapshot.docs) {
		const range = bucketDoc.data().range;
		console.log(wpm, range.max, 'comparing range');

		if (wpm < range.max && wpm > range.min) {
			// Reference to the bucket
			const bucketRef = doc(db, 'leaderboard', bucketDoc.id);

			// Reference to the score with the same ID as userId
			const scoreRef = doc(collection(bucketRef, 'scores'), userId);
			// Check if user's score already exists
			const scoreSnap = await getDoc(scoreRef);

			// Set or update the player score
			await setDoc(scoreRef, { leaderboardEntry }, { merge: true });

			if (!scoreSnap.exists()) {
				// If user's score doesn't exist, create new document and increment count
				// await setDoc(scoreRef, { ...leaderboardEntry });
				await updateDoc(bucketRef, { count: increment(1) });
				console.log('Score added and count incremented');
			} else {
				// If user's score exists, just update wpm and accuracy
				console.log('Score updated');
			}

			console.log('Score added');
			break;
		}
	}
}

export async function readPlayerRank(userId: any) {
	const leaderboardRef = collection(db, 'leaderboard');
	const playerScoresQuery = query(
		collection(db, 'Users'),
		where('userId', '==', userId)
	);
	const playerScoresSnapshot = await getDocs(playerScoresQuery);
	const playerData = playerScoresSnapshot.docs[0].data();
	const wpm = playerData.wpm;

	const bucketsSnapshot = await getDocs(leaderboardRef);
	let currentCount = 1;
	let interp = -1;

	for (const bucketDoc of bucketsSnapshot.docs) {
		const range = bucketDoc.data().range;
		const count = bucketDoc.data().count;
		if (wpm < range.min) {
			currentCount += count;
		} else if (wpm >= range.max) {
			// do nothing
		} else {
			const relativePosition = (wpm - range.min) / (range.max - range.min);
			interp = Math.round(count - count * relativePosition);
			break;
		}
	}

	if (interp === -1) {
		throw Error(`Score out of bounds: ${wpm}`);
	}

	return {
		user: userId,
		rank: currentCount + interp,
		score: wpm,
	};
}

export async function getUsernameByUID(uid: string): Promise<string | null> {
	try {
		// Reference to the user document in Firestore
		const userRef = doc(db, 'Users', uid);

		// Get the user document
		const userSnap = await getDoc(userRef);

		// Check if the user document exists and return the username
		if (userSnap.exists()) {
			return userSnap.data().username || null;
		} else {
			console.log('No such user!');
			return null;
		}
	} catch (error) {
		console.error('Error fetching user data: ', error);
		return null;
	}
}

export async function getUserInfo(userId: string) {
	// Create a reference to the user's document
	const userRef = doc(db, 'Users', userId);

	try {
		// Attempt to fetch the document
		const docSnap = await getDoc(userRef);

		// Check if the document exists
		if (docSnap.exists()) {
			// Return the document data if available
			return docSnap.data();
		} else {
			// Handle the case where the document does not exist
			console.log('No such document!');
			return null;
		}
	} catch (error) {
		// Handle any errors in fetching the document
		console.error('Error getting document:', error);
		throw new Error();
	}
}

export default getUserInfo;

export async function updateMistakeCounts(mistakeWords: string[]) {
	const updatePromises = mistakeWords.map(async word => {
		const wordTypeDoc = doc(db, 'Aksor', word);
		const docSnap = await getDoc(wordTypeDoc);

		if (docSnap.exists()) {
			return updateDoc(wordTypeDoc, {
				mistakeCount: increment(1),
			});
		} else {
			return setDoc(wordTypeDoc, { mistakeCount: 1 });
		}
	});

	// Initiate all Firestore updates concurrently
	// You can choose to await this line if you need to ensure completion at some point
	Promise.all(updatePromises)
		.then(() => {
			console.log('All mistake counts updated');
		})
		.catch(error => {
			console.error('Error updating mistake counts:', error);
		});
}

export async function updateLeaderboard() {
	try {
		// Fetch top 10 players
		const playersRef = collection(db, 'Users');
		const topPlayersQuery = query(
			playersRef,
			orderBy('wpm', 'desc'),
			limit(10)
		);

		const querySnapshot = await getDocs(topPlayersQuery);

		const topPlayers: any = [];
		querySnapshot.forEach(doc => {
			topPlayers.push(doc.data());
		});

		// Update the leaderboard summary document
		const leaderboardRef = doc(db, 'WebsiteInfo', 'LeaderboardCache');
		console.log(topPlayers);
		setDoc(leaderboardRef, { topPlayers: topPlayers, updatedAt: new Date() });

		console.log('Leaderboard updated successfully');
	} catch (error) {
		console.error('Error updating leaderboard:', error);
	}
}

export async function checkAndUpdateLeaderboard() {
	try {
		const leaderboardRef = doc(db, 'WebsiteInfo', 'LeaderboardCache');
		const docSnap = await getDoc(leaderboardRef);

		if (docSnap.exists() && docSnap.data().updatedAt) {
			const lastUpdated = docSnap.data().updatedAt.toDate().getTime();
			const currentTime = new Date().getTime();
			const oneHour = 1000 * 60 * 60; // milliseconds in one hour
			console.log(currentTime, lastUpdated, oneHour, currentTime - lastUpdated);
			const deltaTime = currentTime - lastUpdated;
			if (deltaTime > oneHour) {
				await updateLeaderboard();
			} else {
				console.log('Less than an hour since last update');
			}
		} else {
			console.log(
				'Leaderboard data not found or missing updatedAt, updating now.'
			);
			await updateLeaderboard();
		}
	} catch (error) {
		console.error('Error in checking and updating leaderboard:', error);
	}
}

export async function fetchTopPlayers() {
	const leaderboardRef = doc(db, 'WebsiteInfo', 'LeaderboardCache');
	try {
		const docSnap = await getDoc(leaderboardRef);
		if (docSnap.exists()) {
			const data = docSnap.data();
			return {
				topPlayers: data.topPlayers || [], // Extracting topPlayers
				updatedAt: data.updatedAt || null, // Extracting updatedAt
			};
		} else {
			console.log('No leaderboard data found');
			return { topPlayers: [], updatedAt: null };
		}
	} catch (error) {
		console.error('Error fetching leaderboard:', error);
		return { topPlayers: [], updatedAt: null };
	}
}
