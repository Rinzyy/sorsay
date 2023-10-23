import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

function HeroHome() {
	const { t } = useTranslation('common');

	return (
		<section className="relative flex flex-col items-center justify-between bg-Whitesh py-20 px-20  ">
			<div className="border-t-4 w-full mb-20 border-DarkerGray border-dotted "></div>
			<div className=" flex flex-col items-center justify-center gap-10">
				<div className="flex flex-col items-center justify-center gap-4">
					<h1 className="text-4xl -mt-4 whitespace-nowrap">Sorsay</h1>
					{/* <h1 className="text-2xl text-primary -mt-4">Aksor</h1> */}
				</div>
				<div className="flex justify-start items-start flex-col md:w-[500px] m-1/2">
					<p className=" text-center">
						{t(
							`Dive deep into the world of the Khmer language. Whether you're looking to convert Romanized text, enrich your vocabulary, or sharpen your typing skills, we've got you covered. Transform Romanized text to Khmer script effortlessly.`
						)}
					</p>
				</div>
			</div>
		</section>
	);
}

export default HeroHome;
