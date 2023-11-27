import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
interface Prop {
	closeModal: React.MouseEventHandler<HTMLButtonElement>;
}
const ForgetPasswordModal = ({ closeModal }: Prop) => {
	const [email, setEmail] = useState('');
	const auth = getAuth();

	const handleForgotPassword = () => {
		sendPasswordResetEmail(auth, email)
			.then(() => {
				// Password reset email sent
				alert('Password reset email sent! Check your inbox.');
			})
			.catch(error => {
				// Handle errors here
				const errorCode = error.code;
				const errorMessage = error.message;

				// Handle specific errors differently
				if (errorCode === 'auth/user-not-found') {
					alert('No user found with this email address.');
				} else {
					alert(errorMessage); // Generic error message
				}
			});
		closeModal();
	};
	return (
		<div
			className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-auto
              bg-light rounded-xl pt-8 pb-10 shadow-2xl">
			{' '}
			{/* className shortened for brevity */}
			<span className="text-xl text-mainDark font-bold flex items-center justify-center mb-6">
				Enter your gmail
			</span>
			<form className="flex flex-col justify-center gap-4 mt-10 px-10">
				<input
					type="email"
					placeholder="forget@gmail.com"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className="p-2 text-mainDark border rounded-md"
					required
				/>
				<button
					type="submit"
					onClick={handleForgotPassword}
					className="bg-white h-16 rounded-md border-2 shadow-md border-primary text-mainDark hover:bg-slate-100 hover:scale-105 active:scale-100 transition-all duration-200">
					Reset Password
				</button>
			</form>
		</div>
	);
};

export default ForgetPasswordModal;
