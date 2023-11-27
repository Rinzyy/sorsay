// Leaderboard.tsx
import React, { useEffect, useState } from 'react';
import {
	checkAndUpdateLeaderboard,
	fetchTopPlayers,
	getTopPlayers,
} from '../../lib/FirebaseFunction';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import AutorenewIcon from '@mui/icons-material/Autorenew';
// Define a type for your player data
type Player = {
	userId: string;
	username: string;
	name: string;
	wpm: number;
	LatestHSDate: Timestamp;
};
interface LeaderboardData {
	topPlayers: Player[];
	UpdateAt: number;
}
const Leaderboard: React.FC = () => {
	// const [data, setData] = useState([]);

	const [players, setPlayers] = useState<any>([]);
	const [countDown, setCountDown] = useState<any>('00:00:00');
	const fetchPlayers = async () => {
		try {
			const topPlayersData = await fetchTopPlayers();

			console.log('fetch success', topPlayersData);
			if (topPlayersData) {
				setPlayers(topPlayersData.topPlayers);
				const lastUpdated = topPlayersData.updatedAt.toDate().getTime();
				const currentTime = new Date().getTime();
				const oneHour = 1000 * 60 * 60;
				const deltaTime = currentTime - lastUpdated; // Calculate time left for countdown
				const timeLeft = oneHour - deltaTime;

				if (timeLeft > 0) {
					// Calculate hours, minutes, and seconds for countdown
					const hours = Math.floor(timeLeft / (1000 * 60 * 60));
					const minutes = Math.floor(
						(timeLeft % (1000 * 60 * 60)) / (1000 * 60)
					);
					const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

					// Format to 00:00:00
					const formattedCountdown = `${hours
						.toString()
						.padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
						.toString()
						.padStart(2, '0')}`;
					setCountDown(formattedCountdown);
				} else {
					checkAndUpdateLeaderboard();
					// Time has elapsed
					setCountDown('00:00:00');
				}
			}
		} catch (error) {
			console.error('Error fetching top players:', error);
		}
	};

	function formatTimestamp(timestamp: Timestamp) {
		const date = timestamp.toDate();
		//CST to ICT
		date.setHours(date.getHours() + 12);
		const day = date.getDate();
		const month = date.toLocaleString('en-US', { month: 'short' });
		const year = date.getFullYear();
		const time = date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		});

		return `${month} ${day}, ${year} ${time}`;
	}

	useEffect(() => {
		fetchPlayers();
	}, []);
	return (
		<div>
			<div className="flex flex-row items-center justify-between mb-4">
				<h1 className=" text-3xl font-bold">Leaderboard</h1>
				<div className=" border-b bg-DarkerGray p-1 flex flex-row items-center gap-2 rounded-md">
					<button className=" bg-white rounded-md px-2 py-1">All time</button>
					<button className="  rounded-md px-2 py-1">Daily</button>
				</div>
			</div>
			<div className="border-DarkerGray ">
				<p className=" text-xl">
					{countDown} <AutorenewIcon />
				</p>

				<p className=" text-xl">Word - 15</p>
				<table className=" ">
					<thead>
						<tr className=" bg-DarkerGray rounded-lg ">
							<th className="p-2 text-start">#</th>
							<th className="p-2 text-start">Username</th>
							<th className="p-2 text-start">WPM</th>
							<th className="p-2 text-start">Date</th>
						</tr>
					</thead>
					<tbody>
						{players.map((user: any, index: number) => (
							<tr key={user.userId}>
								<td className="p-2 text-start">{index + 1}</td>
								<td className="p-2 text-start w-52">{user.username}</td>
								<td className="p-2 text-start">{user.wpm}</td>
								<td className="p-2 text-start w-fit">
									{user.LatestHSDate ? formatTimestamp(user.LatestHSDate) : ''}
								</td>
							</tr>
						))}
					</tbody>
					<tbody className="p-2">
						<tr className=" ">
							<th className="p-2 text-start">...</th>
						</tr>
					</tbody>
					<tbody>
						<tr>
							<td className="p-2 text-start">1</td>
							<td className="p-2 text-start w-52">You</td>
							<td className="p-2 text-start">10 </td>
							<td className="p-2 text-start">10 Jul 2023</td>
						</tr>
					</tbody>
				</table>
				<table></table>
			</div>
		</div>
	);
};

export default Leaderboard;
