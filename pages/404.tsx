import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Custom404 = () => {
	const router = useRouter();
	useEffect(() => {
		router.push('/');
	}, []);
};

export default Custom404;
