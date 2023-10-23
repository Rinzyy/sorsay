import React from 'react';

const Privacy = () => {
	return (
		<div className="py-10 px-64 flex flex-col gap-4">
			<div>
				<h1 className=" text-4xl mb-4">
					We are committed to protecting your privacy.
				</h1>
				<p className=" text-justify text-gray-700">
					This Privacy Policy describes the types of information we may collect
					from you or that you may provide when you use our website or services
					and our practices for collecting, using, maintaining, protecting, and
					disclosing that information.
				</p>
			</div>
			<div>
				<h2 className=" font-bold">Information We Collect</h2>
				<p className=" text-justify text-gray-700">
					When you use our website or services, we may collect certain
					information from and about you, including:
				</p>

				<ul className=" ml-2 text-gray-700">
					<li>
						- Personal Information: We may collect personally identifiable
						information that can be used to identify or contact you, such as
						your name and email address.
					</li>
					<li>
						- User Inputs: As an open-source platform aiming to improve Khmer
						communication, we might collect the text or code contributions you
						provide. These might sometimes contain sensitive or identifiable
						data.
					</li>
				</ul>
			</div>
			<div>
				<h2 className=" font-bold">How We Use Your Information</h2>
				<p className=" text-justify text-gray-700">
					We may use the information we collect from you for the following
					purposes:
				</p>
				<ul className=" ml-2 text-gray-700">
					<li>
						- Delivering and optimizing our services, including account
						management and enhancing the Sorsay platform.
					</li>
					<li>
						- Bettering our website and overall user experience, potentially
						using artificial intelligence and machine learning algorithms.
					</li>
					<li>- To communicate with you about your account or our services</li>
					<li>
						- Engaging with you regarding updates, issues, or any other
						platform-related matters.
					</li>
					<li>
						Sending promotional materials about our initiatives, unless you
						choose to opt out.
					</li>
					<li>- To protect our rights or property</li>
					<li>- To comply with legal requirements</li>
				</ul>
			</div>

			<div>
				<h2 className=" font-bold">How We Share Your Information</h2>
				<p className=" text-justify text-gray-700">
					We may share your information with third parties in the following
					circumstances:
				</p>
				<ul className=" ml-2 text-gray-700">
					<li>
						- With service providers who perform services on our behalf, such as
						payment processors or hosting providers
					</li>
					<li>
						- In association with potential platform expansions, mergers,
						acquisitions, or other business integrations.
					</li>
					<li>
						- To comply with legal requirements, such as a court order or
						government request
					</li>
				</ul>
			</div>
			<div>
				<h2 className=" font-bold">Data Security</h2>
				<p className=" text-justify text-gray-700">
					We have implemented appropriate technical and organizational measures
					to protect the information we collect from you against unauthorized
					access, use, disclosure, or destruction. We use encryption and other
					security measures to protect sensitive information, such as user text
					and payment information. However, no security system is perfect, and
					we cannot guarantee the security of your information.
				</p>
			</div>

			<div>
				<h2 className=" font-bold">Your Choices</h2>
				<p className=" text-justify text-gray-700">
					You may choose to opt out of receiving marketing communications from
					us by following the instructions in the communication or by contacting
					us directly. You may also choose not to provide us with certain
					information, but this may limit your ability to use our services.
				</p>
			</div>

			<div>
				<h2 className=" font-bold">Changes to Our Privacy Policy</h2>
				<p className=" text-justify text-gray-700">
					We may modify or update this Privacy Policy from time to time to
					reflect changes in our practices or applicable law. We encourage you
					to review this Privacy Policy periodically.
				</p>
			</div>

			<div>
				<h2 className=" font-bold">Contact Us</h2>
				<p className=" text-justify text-gray-700">
					If you have any questions or concerns about this Privacy Policy or our
					practices, you may contact us at sorsayinfo@gmail.com.
				</p>
			</div>
		</div>
	);
};

export default Privacy;
