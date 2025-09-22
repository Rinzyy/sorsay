import React from 'react';

type Testimonial = {
	name: string;
	role: string;
	company?: string;
	avatarSrc: string;
	quote: string;
};

const testimonials: Testimonial[] = [
	{
		name: 'Dara Sok',
		role: 'Product Manager',
		company: 'PhnomTech',
		avatarSrc: '/userDefaultPhoto.png',
		quote:
			"Sorsay shaved minutes off every message. Romanized notes turn into clean Khmer script with a tap — my team now communicates faster without sacrificing accuracy.",
	},
	{
		name: 'Professor Srey Neang',
		role: 'Khmer Language Educator',
		company: 'Royal University of Phnom Penh',
		avatarSrc: '/userDefaultPhoto.png',
		quote:
			"I use Sorsay in class to bridge romanization and script. Students grasp pronunciation and spelling quicker, and their confidence skyrockets.",
	},
	{
		name: 'Vuthy Chan',
		role: 'Software Engineer',
		company: 'Angkor Apps',
		avatarSrc: '/userDefaultPhoto.png',
		quote:
			"Integrating Sorsay into my dev workflow was a no‑brainer. Keyboard shortcuts are intuitive, and the conversion is precise enough to ship user‑facing copy.",
	},
];

const Testimonials: React.FC = () => {
	return (
		<section className="bg-Whitesh text-gray-700 body-font">
			<div className="container px-5 py-24 mx-auto">
				<h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">What people say</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{testimonials.map(t => (
						<article
							key={t.name}
							className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
							<header className="flex items-center gap-4 mb-4">
								<img
									src={t.avatarSrc}
									alt={`${t.name} avatar`}
									className="h-12 w-12 rounded-full object-cover border border-gray-200"
								/>
								<div>
									<p className="font-semibold text-gray-900">{t.name}</p>
									<p className="text-sm text-gray-500">
										{t.role}
										{t.company ? ` • ${t.company}` : ''}
									</p>
								</div>
							</header>
							<p className="text-gray-700 leading-relaxed">“{t.quote}”</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
};

