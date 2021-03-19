import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import { getProjects, selectProjects } from './store/projectsSlice';
import { selectWidgets } from './store/widgetsSlice';

const useStyles = makeStyles(theme => ({
	selectedProject: {
		background: lighten(theme.palette.primary.dark, 0.1),
		color: theme.palette.primary.contrastText,
		borderRadius: '16px 0 0 0'
	},
	projectMenuButton: {
		background: lighten(theme.palette.primary.dark, 0.1),
		color: theme.palette.primary.contrastText,
		borderRadius: '0 16px 0 0',
		marginLeft: 1
	}
}));

function ProjectDashboardAppHeader(props) {
	const { pageLayout } = props;
	const classes = useStyles(props);

	const dispatch = useDispatch();
	const widgets = useSelector(selectWidgets);
	const projects = useSelector(selectProjects);

	const [selectedProject, setSelectedProject] = useState({
		id: 1,
		menuEl: null
	});

	useEffect(() => {
		dispatch(getProjects());
	}, [dispatch]);

	function handleChangeProject(id) {
		setSelectedProject({
			id,
			menuEl: null
		});
	}

	function handleOpenProjectMenu(event) {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: event.currentTarget
		});
	}

	function handleCloseProjectMenu() {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: null
		});
	}

	if (_.isEmpty(projects)) {
		return null;
	}

	return (
		<div className="flex flex-col justify-between flex-1 px-24 pt-24">
			<div className="flex justify-between items-start">
				<Typography className="py-0 sm:py-24 text-24 md:text-32 font-bold" variant="h4">
					Welcome back, John!
				</Typography>
				<Hidden lgUp>
					<IconButton
						onClick={ev => pageLayout.current.toggleRightSidebar()}
						aria-label="open left sidebar"
						color="inherit"
					>
						<Icon>menu</Icon>
					</IconButton>
				</Hidden>
			</div>
			<div className="flex items-end">
				<div className="flex items-center">
					<div className={clsx(classes.selectedProject, 'flex items-center h-40 px-16 text-16')}>
						{_.find(projects, ['id', selectedProject.id]).name}
					</div>
					<IconButton
						className={clsx(classes.projectMenuButton, 'h-40 w-40 p-0')}
						aria-owns={selectedProject.menuEl ? 'project-menu' : undefined}
						aria-haspopup="true"
						onClick={handleOpenProjectMenu}
					>
						<Icon>more_horiz</Icon>
					</IconButton>
					<Menu
						id="project-menu"
						anchorEl={selectedProject.menuEl}
						open={Boolean(selectedProject.menuEl)}
						onClose={handleCloseProjectMenu}
					>
						{projects &&
							projects.map(project => (
								<MenuItem
									key={project.id}
									onClick={ev => {
										handleChangeProject(project.id);
									}}
								>
									{project.name}
								</MenuItem>
							))}
					</Menu>
				</div>
			</div>
		</div>
	);
}

export default ProjectDashboardAppHeader;
