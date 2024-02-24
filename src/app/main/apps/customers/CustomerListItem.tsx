import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Customer } from './CustomersApi';

type CustomerListItemPropsType = {
	customer: Customer;
};

/**
 * The customer list item.
 */
function CustomerListItem(props: CustomerListItemPropsType) {
	const { customer } = props;

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/apps/customers/${customer.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={customer.name}
						src={customer.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={customer.name}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{customer.title}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default CustomerListItem;
