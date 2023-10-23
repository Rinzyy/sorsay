/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
	reactStrictMode: true,
	env: {
		PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
	},
	i18n,
};
