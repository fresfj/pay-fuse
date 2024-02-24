import { lazy } from 'react';
import authRoles from '../../../auth/authRoles'

const CheckoutPage = lazy(() => import('./cart/checkoutPage'));
const CheckoutApp = lazy(() => import('./CheckoutApp'));
const ThanksApp = lazy(() => import('./thanks/SuccessPage'))

/**
 * The checkout app config.
 */
const CheckoutAppConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'Checkout',
			element: <CheckoutApp />,
			children: [
				{
					path: ':id',
					element: <CheckoutPage />
				}
			]
		},
		{
			path: 'thanks',
			element: <CheckoutApp />,
			children: [
				{
					path: ':id',
					element: <ThanksApp />
				}
			]
		}
	]
};

export default CheckoutAppConfig;
