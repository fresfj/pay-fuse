import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectFooterTheme } from 'app/store/fuse/settingsSlice';

type FooterLayout3Props = {
	className?: string;
};
function FooterLayout3(props: FooterLayout3Props) {
	const { className = '' } = props;

	const footerTheme = useSelector(selectFooterTheme);

	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar
				id="fuse-footer"
				className={clsx('relative z-20 shadow-md', className)}
				color="default"
				style={{ backgroundColor: footerTheme.palette.background.paper }}
			>
				<Toolbar className="min-h-48 md:min-h-64 container flex items-center overflow-x-auto px-8 py-0 sm:px-12 lg:px-20">
					Footer
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(FooterLayout3);
