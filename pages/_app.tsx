import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import store from '../lib/store';
import Layout from '../Components/Layout';
import { Lato, Montserrat } from '@next/font/google';
import '../styles/globals.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { appWithTranslation } from 'next-i18next';
const mont = Lato({
	subsets: ['latin'],
	weight: ['400'],
});

type ComponentWithPageLayout = AppProps & {
	Component: AppProps['Component'] & {
		PageLayout?: any;
	};
};

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main className={mont.className}>
			<Provider store={store}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</Provider>
		</main>
	);
}

export default appWithTranslation(MyApp);
