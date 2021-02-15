import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo } from 'react';

function Widget3(props) {
	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between px-4 pt-8">
				<Typography className="text-16 px-16 font-semibold" color="textSecondary">
					{props.widget.title}
				</Typography>
				<IconButton aria-label="more">
					<Icon>more_vert</Icon>
				</IconButton>
			</div>
			<div className="text-center py-12">
				<Typography className="text-72 font-bold leading-none text-orange">
					{props.widget.data.count}
				</Typography>
				<Typography className="text-18 font-medium text-orange-800">{props.widget.data.label}</Typography>
			</div>
			<Typography
				className="p-20 pt-0 h-56 flex justify-center items-end text-13 font-semibold"
				color="textSecondary"
			>
				<span className="truncate">{props.widget.data.extra.label}</span>:
				<b className="px-8">{props.widget.data.extra.count}</b>
			</Typography>
		</Paper>
	);
}

export default memo(Widget3);
