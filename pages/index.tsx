import React from 'react';
import KhmerGuide from '../Components/Home/KhmerScriptTable/KhmerGuide';
import {
	independentVowel,
	khmerToRoman,
	punctuation,
} from '../lib/Data/TableData';
import KhmerConsonant from '../Components/Home/KhmerScriptTable/KhmerConsonant';
import CallToAction from '../Components/Home/partials/CallToAction';
import Contribution from '../Components/Home/partials/Contribution';
import FeatureSection from '../Components/Home/partials/FeatureSection';
import Landing from '../Components/MainLayout/Landing/Landing';
import StepsSection from '../Components/Home/partials/StepSection';
import Aboutme from '../Components/Home/partials/Aboutme';
import Head from 'next/head';
import MissingWordForm from '../Components/Home/MissingForm';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import KhmerCell from '../Components/Home/KhmerScriptTable/KhmerCell';
import KhmerIndeVowel from '../Components/Home/KhmerScriptTable/KhmerIndeVowel';
import TextAreaTransform from '../Components/TextEditor/TextareaTransform';

const Home: NextPage = () => {
	const { t } = useTranslation('common');

	const { locale } = useRouter();
	return (
		<>
			<Head>
				<title>Sorsay:Enhancing Khmer Language</title>
				<meta
					name="description"
					content="Type better with Sorsay"
				/>
				<meta
					property="og:title"
					content="Type Khmer effortlessly."
				/>
				<meta
					property="og:description"
					content="Type better with Sorsay"
				/>
				<meta
					property="og:type"
					content="website"></meta>
				<link
					rel="icon"
					href="/sorsayv2.png"
				/>
			</Head>
			{/* <Menu /> */}
			<div className=" bg-Grayesh flex justify-center">
				<span className="text-center text-gray-400 font-bold mt-10 md:mt-6 lg:mt-6 -mb-6">
					Roman - ខ្មែរ
				</span>
			</div>
			<div className="bg-Grayesh scroll-smooth duration-200 w-full h-full flex flex-col md:flex-row transition-all">
				<div className="hidden md:block w-12 emptyspaceforsidebar"></div>
				<div className="w-full h-full flex flex-col items-center justify-center">
					<TextAreaTransform />
				</div>
				<div className="flex flex-col justify-around h-96  mx-10 md:-ml-5 md:mt-10 md:mr-10  mb-10 md:w-3/12 border border-black rounded-md shadow-md  bg-Whitesh px-4 md:px-8 md:py-6 lg:px-8 lg:py-6 z-20">
					<div className="text-center text-xl font-semibold top-20 md:mb-4">
						{t('Instruction')}
					</div>
					<div className="-mt-2 md:-mx-4">
						<p>{t('• Tab = Switch Suggestion')}</p>
						<p>{t('• Space = Change')}</p>
						<p className={`${locale == 'en' ? 'text-sm ' : 'text-md'}`}>
							{t(`• Enter/Shift+Space = Don't Change`)}
						</p>
					</div>
					<MissingWordForm />
				</div>
			</div>
			<section className="relative flex flex-col items-center justify-between border-t-2 border-black border-dashed bg-Whitesh py-20 pt-10 pb-20 z-1000">
				<h1 className="text-4xl mb-1 -mt-4">{t('Khmer Script')}</h1>
				<div className="flex flex-row gap-2">
					<div className="flex flex-col items-center">
						<p className="text-primary mb-1">{t('Vowel A')}</p>
						<p className="-mt-2 text-sm text-primary">{t('purple')}</p>
					</div>
					<p>|</p>
					<div className="flex flex-col items-center">
						<p className="text-gray-700 mb-1">{t('Vowel O')}</p>
						<p className="-mt-2 text-sm text-gray-700">{t('black')}</p>
					</div>
				</div>
				<div className="flex flex-col lg:flex-row gap-10 mt-8">
					<div className="flex flex-wrap items-start justify-around ">
						<KhmerConsonant khmerToRoman={khmerToRoman} />
					</div>
					<div className="flex flex-wrap items-start justify-around ">
						<KhmerGuide />
					</div>
				</div>
				<div className="flex flex-col lg:flex-row gap-10 mt-8">
					<div className="flex flex-col md:flex-row gap-10 mt-8">
						<KhmerIndeVowel khmerToRoman={independentVowel} />
					</div>
					<div className="flex flex-col md:flex-row gap-10 mt-8">
						<KhmerCell wordBank={punctuation} />
					</div>
				</div>
			</section>
			<Landing />
			<StepsSection />
			<FeatureSection />
			<Aboutme />
			<CallToAction />
			<Contribution />
		</>
	);
};

export async function getStaticProps({ locale }: any) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common'])),
			// Will be passed to the page component as props
		},
	};
}

export default Home;
