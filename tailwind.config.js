module.exports = {
	important: true,
	content: [
		'./node_modules/flowbite-react/**/*.js',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./Components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#604fcd',
				Whitesh:'#f8f8f8',
				Grayesh:'#eaeaea',
				DarkerGray:'#d2d2d2',
				mainDark: '#130b43',
				light: '#f7f6fa',
			},
			transitionProperty: {
				height: 'height',
			},
		},
	},
	plugins: [require('flowbite/plugin')],
};
