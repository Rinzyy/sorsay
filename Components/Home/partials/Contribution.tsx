import React, { useEffect, useState } from 'react';

import HeroImage from '../images/hero-image.png';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import style from './home.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { OpenModal } from '../../../lib/slices/userSlice';
import { useTranslation } from 'next-i18next';

function Contribution() {
	const { t } = useTranslation('common');
	const [userData, setUserData] = useState(null);
	const dispatch = useDispatch();
	const router = useRouter();
	const userUID = useSelector((state: any) => state.userControl.userUID);
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [isEmailSent, setIsEmailSent] = useState(false);

	const handleEmailChange = (event: any) => {
		setEmail(event.target.value);
	};

	const handleMessageChange = (event: any) => {
		setMessage(event.target.value);
	};
	const handleSendEmail = async () => {
		try {
			const response = await fetch('/api/sendEmail', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, message }),
			});

			if (response.ok) {
				setIsEmailSent(true);
			} else {
				alert('There was an error sending the email. not ok');
			}
		} catch (error) {
			console.error('Error sending email:', error);
			alert('There was an error sending the email.');
		}
	};

	useEffect(() => {
		setUserData(userUID);
	}, [userUID]);

	const ClickHandlerBeforeLogin = () => {
		dispatch(OpenModal());
	};
	const ClickHandlerAfterLogin = () => {
		router.push('/');
	};
	return (
		<section className="relative w-full bg-Grayesh md:px-10 lg:px-20  ">
			<div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
				<div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
					<h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
						{t('Contribution')}
					</h1>
					<p className="mb-8 leading-relaxed">
						{t(
							`Excited about our mission? Join us! Whether you're a coder, a language enthusiast, or just love Khmer culture, our goal is to improve our way of communication, and we welcome your help.`
						)}
					</p>
					{/* <div className="flex justify-center">
						<a className="text-indigo-500 inline-flex items-center mt-4">
							Learn More
							<svg
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								className="w-4 h-4 ml-2"
								viewBox="0 0 24 24">
								<path d="M5 12h14M12 5l7 7-7 7"></path>
							</svg>
						</a>
					</div> */}
				</div>
				<div>
					<div className="container mt-10 flex">
						<div className="w-full bg-Whitesh rounded-lg p-8 flex flex-col md:ml-auto md:mt-0 relative z-10 shadow-md">
							<div className="lg:flex md:flex lg:flex-row md:flex-col items-center gap-2 ">
								<h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
									{t('Contact Us')}
								</h2>
								<p className="text-gray-500 text-sm pb-1 whitespace-nowrap">
									@ sorsayinfo@gmail.com
								</p>
							</div>
							<div className="relative mb-4">
								<label
									htmlFor="email"
									className="leading-7 text-sm text-gray-600">
									{t('Email')}
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={email}
									onChange={handleEmailChange}
									className="w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
								/>
							</div>
							<div className="relative mb-4">
								<label
									htmlFor="message"
									className="leading-7 text-sm text-gray-600">
									{t('Message')}
								</label>
								<textarea
									id="message"
									name="message"
									value={message}
									onChange={handleMessageChange}
									className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
							</div>
							<button
								className={`text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-primary rounded text-lg ${
									isEmailSent ? 'cursor-not-allowed' : ''
								}`}
								onClick={handleSendEmail}
								disabled={isEmailSent}>
								{isEmailSent ? t('Email Sent!') : t('Send Email')}
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Contribution;

{
	/* <span>
					Say goodbye to tedious writing, and hello to effortless with
				</span> */
}
{
	/* <p>
		tired of spending countless hours proofreading your work? Sumnur is
		here to change that. State-of-the-art AI technology not only detects
		grammar, punctuation, and spelling errors, but also suggests more
		effective word choices and sentence structure to elevate your writing
		to new heights. Imagine a world where you can confidently submit your
		work, knowing that it is polished, professional, and error-free. With
		Sumnur, that world is a reality. Don't just take our word for it, try
		it now and experience the transformative power of Sumnur for yourself.
	</p> */
}
