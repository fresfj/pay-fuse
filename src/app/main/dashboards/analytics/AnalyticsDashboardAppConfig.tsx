import lazyWithSlices from 'app/store/lazyWithSlices';
import slices from './store';

const AnalyticsDashboardApp = lazyWithSlices(() => import('./AnalyticsDashboardApp'), slices);

const AnalyticsDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'dashboards/analytics',
			element: <AnalyticsDashboardApp />
		}
	]
};

export default AnalyticsDashboardAppConfig;
