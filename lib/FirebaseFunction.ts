import {
	addDoc,
	collection,
	doc,
	getDoc,
	increment,
	runTransaction,
	serverTimestamp,
	setDoc,
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
