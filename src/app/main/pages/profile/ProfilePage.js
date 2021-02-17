import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import clsx from 'clsx';
import AboutTab from './tabs/AboutTab';
import PhotosVideosTab from './tabs/PhotosVideosTab';
import TimelineTab from './tabs/TimelineTab';

const useStyles = makeStyles(theme => ({
	avatar: {
		border: `4px solid ${theme.palette.background.default}`
	},
	layoutHeader: {
		height: 320,
		minHeight: 320,
		background: 'url("assets/images/profile/morain-lake.jpg")',
		backgroundSize: 'cover',
		[theme.breakpoints.down('md')]: {
			height: 240,
			minHeight: 240
		}
	}
}));

function ProfilePage() {
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(0);

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}

	return (
		<FusePageSimple
			classes={{
				header: classes.layoutHeader,
				content: 'w-full max-w-2xl mx-auto',
				toolbar: 'w-full max-w-2xl mx-auto relative flex flex-col min-h-auto h-auto items-start'
			}}
			header={<></>}
			contentToolbar={
				<>
					<div className="w-full px-24 pb-48 flex flex-col md:flex-row flex-1 items-center">
						<FuseAnimate animation="transition.expandIn" delay={300}>
							<Avatar
								className={clsx(classes.avatar, '-mt-64  w-128 h-128')}
								src="assets/images/avatars/Velazquez.jpg"
							/>
						</FuseAnimate>
						<div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography
									className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
									variant="h4"
									color="inherit"
								>
									John Doe
								</Typography>
							</FuseAnimate>

							<div className="flex items-center justify-end -mx-4 mt-24 md:mt-0">
								<Button className="mx-8" variant="contained" color="secondary" aria-label="Follow">
									Follow
								</Button>
								<Button variant="contained" color="primary" aria-label="Send Message">
									Send Message
								</Button>
							</div>
						</div>
					</div>
					<Tabs
						value={selectedTab}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons="off"
						className="w-full px-24 -mx-4 min-h-40"
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: <Divider className="w-full h-full rounded-full opacity-50" />
						}}
					>
						<Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4" disableRipple label="Timeline" />
						<Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4" disableRipple label="About" />
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Photos & Videos"
						/>
					</Tabs>
				</>
			}
			content={
				<div className="p-16 sm:p-24">
					{selectedTab === 0 && <TimelineTab />}
					{selectedTab === 1 && <AboutTab />}
					{selectedTab === 2 && <PhotosVideosTab />}
				</div>
			}
		/>
	);
}

export default ProfilePage;
