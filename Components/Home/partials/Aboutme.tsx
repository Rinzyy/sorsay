import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

function TeamMember({ member }: any) {
	return (
		<div className="container p-2 w-full">
			<div className="h-full lg:w-64 flex items-center bg-white shadow-lg  border-gray-700 border-2  p-4 rounded-lg">
				<img
					alt="team"
					className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
					src={member.image}
				/>
				<div className="flex-grow">
					<h2 className="text-gray-900 title-font font-medium">
						{member.name}
					</h2>
					<p className="text-gray-500">{member.role}</p>
				</div>
			</div>
		</div>
	);
}

function Aboutme() {
	const { t } = useTranslation('common');
	const dispatch = useDispatch();

	// Define your team members as an array of objects
	const teamMembers = [
		{
			name: 'Ouch Belida',
			role: 'University of Technology Sydney',
			image: 'Belida.png',
		},
		{
			name: 'Suy Heng',
			role: 'Paragon University',
			image: '/Heng.png',
		},
		{
			name: 'Tuy Rindy',
			role: 'Lonestar College',
			image: '/Rindy.png',
		},
		// Add more team members as needed
	];

	return (
		<section className="text-gray-600 bg-Whitesh body-font">
			<div className="flex flex-col justify-between items-center px-16 py-24">
				<div className="flex flex-col items-center lg:text-start mb-20">
					<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
						{t('Our Team')}
					</h1>
					<p className="leading-relaxed text-center text-base">
						{t(
							`We are a passionate and innovative team of young Cambodian talents dedicated to advancing Cambodia's technological landscape. Our mission is clear: we aim to improve the way Khmer is typed in the digital space. With a focus on preserving the rich Khmer script and making it accessible to all. Stay tuned for our inspiring future endeavors!`
						)}
					</p>
				</div>
				<div className="flex flex-col md:flex-row justify-around w-full lg:w-2/3">
					{/* Repeat this block for each team member */}
					<TeamMember member={teamMembers[0]} />
					<TeamMember member={teamMembers[1]} />
					<TeamMember member={teamMembers[2]} />
				</div>
			</div>
		</section>
	);
}

export default Aboutme;
