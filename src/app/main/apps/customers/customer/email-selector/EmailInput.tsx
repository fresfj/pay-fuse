import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneNumberInput from '../phone-number-selector/PhoneNumberInput';
import { CustomerEmail } from '../../CustomersApi';

const schema = z.object({
	email: z.string().optional(),
	label: z.string().optional()
});

const defaultValues = {
	email: '',
	label: ''
};

type EmailInputProps = {
	value: CustomerEmail;
	onChange: (T: CustomerEmail) => void;
	onRemove: (T: CustomerEmail) => void;
	hideRemove?: boolean;
};

/**
 * The email input.
 */
function EmailInput(props: EmailInputProps) {
	const { value, hideRemove, onChange, onRemove } = props;

	const { control, formState, handleSubmit, reset } = useForm<CustomerEmail>({
		mode: 'all',
		defaultValues,
		resolver: zodResolver(schema)
	});

	useEffect(() => {
		reset(value);
	}, [reset, value]);

	const { errors } = formState;

	function onSubmit(data: CustomerEmail): void {
		onChange(data);
	}

	return (
		<form
			className="flex space-x-16 mb-16"
			onChange={handleSubmit(onSubmit)}
		>
			<Controller
				control={control}
				name="email"
				render={({ field }) => (
					<TextField
						{...field}
						label="Email"
						placeholder="Email"
						variant="outlined"
						fullWidth
						error={!!errors.email}
						helperText={errors?.email?.message}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
								</InputAdornment>
							)
						}}
					/>
				)}
			/>
			<Controller
				control={control}
				name="label"
				render={({ field }) => (
					<TextField
						{...field}
						label="Label"
						placeholder="Label"
						variant="outlined"
						fullWidth
						error={!!errors.label}
						helperText={errors?.label?.message}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
								</InputAdornment>
							)
						}}
					/>
				)}
			/>
			{!hideRemove && (
				<IconButton
					onClick={() => {
						onRemove(value);
					}}
				>
					<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
				</IconButton>
			)}
		</form>
	);
}

PhoneNumberInput.defaultProps = {
	hideRemove: false
};

export default EmailInput;
