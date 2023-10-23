import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer>
			<div className="relative flex flex-col md:flex-row lg:flex-row px-4 gap-5 items-center justify-between bg-Grayesh z-30 border-t-2 py-4  text-gray-600  border-gray-600 border-dashed ">
				<div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
					<a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
						<span className="ml-3 text-xl">Sorsay</span>
					</a>
				</div>
				<div className="flex flex-row items-center justify-center gap-2">
					<div className="flex flex-col items-center md:flex-row gap-4">
						<Link
							href="https://forms.gle/CwKMqSVum9vAn4K5A"
							target="_blank"
							rel="noreferrer"
							className="relative flex flex-row gap-2 justify-center items-center">
							<span className=" text-gray-600 underline hover:text-primary">
								Report Bug
							</span>
						</Link>
						<a
							href="/TOS"
							className=" underline hover:text-primary ">
							Term of Services
						</a>
						<a
							href="/Privacy"
							className=" underline hover:text-primary">
							Privacy Policy
						</a>
					</div>
				</div>
				<span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
					<Link
						href="https://www.facebook.com/profile.php?id=100090999937068&mibextid=LQQJ4d"
						target="_blank"
						rel="noreferrer"
						className="text-gray-500">
						<svg
							fill="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="w-5 h-5"
							viewBox="0 0 24 24">
							<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
						</svg>
					</Link>
					{/* <a className="ml-3 text-gray-500">
						<svg
							fill="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="w-5 h-5"
							viewBox="0 0 24 24">
							<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
						</svg>
					</a> */}
					<Link
						href="https://www.instagram.com/sorsayinfo/"
						target="_blank"
						rel="noreferrer"
						className="ml-3 text-gray-500">
						<svg
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="w-5 h-5"
							viewBox="0 0 24 24">
							<rect
								width="20"
								height="20"
								x="2"
								y="2"
								rx="5"
								ry="5"></rect>
							<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
						</svg>
					</Link>
				</span>
			</div>
		</footer>
	);
};

export default Footer;
