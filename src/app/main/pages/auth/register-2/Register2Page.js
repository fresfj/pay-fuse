import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().required('You must enter your name'),
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(8, 'Password is too short - should be 8 chars minimum.'),
	passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
	acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.')
});

const defaultValues = {
	name: '',
	email: '',
	password: '',
	passwordConfirm: '',
	acceptTermsConditions: false
};

function Register2Page() {
	const classes = useStyles();

	const { register, formState, handleSubmit, reset, errors } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	function onSubmit() {
		reset(defaultValues);
	}

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto flex-shrink-0 p-24 md:flex-row md:p-0 overflow-hidden'
			)}
		>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
				<motion.div
					initial={{ opacity: 0, scale: 0.6 }}
					animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
				>
					<img className="w-128 mb-32" src="assets/images/logos/fuse.svg" alt="logo" />
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
					<Typography variant="h3" color="inherit" className="font-semibold leading-tight">
						Welcome <br />
						to the <br /> FUSE React!
					</Typography>
				</motion.div>

				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
					<Typography variant="subtitle1" color="inherit" className="mt-32 font-medium">
						Powerful and professional admin template for Web Applications, CRM, CMS, Admin Panels and more.
					</Typography>
				</motion.div>
			</div>

			<Card
				component={motion.div}
				initial={{ x: 200 }}
				animate={{ x: 0 }}
				transition={{ bounceDamping: 0 }}
				className="w-full max-w-400 mx-auto m-16 md:m-0"
				square
				layout
			>
				<CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
					<Typography variant="h6" className="mb-24 font-semibold text-20 sm:text-24">
						Create an account
					</Typography>

					<form
						name="registerForm"
						noValidate
						className="flex flex-col justify-center w-full"
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextField
							className="mb-16"
							label="Name"
							autoFocus
							type="name"
							name="name"
							inputRef={register}
							error={!!errors.name}
							helperText={errors?.name?.message}
							variant="outlined"
							required
							fullWidth
						/>

						<TextField
							className="mb-16"
							label="Email"
							type="email"
							name="email"
							inputRef={register}
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>

						<TextField
							className="mb-16"
							label="Password"
							type="password"
							name="password"
							inputRef={register}
							error={!!errors.password}
							helperText={errors?.password?.message}
							variant="outlined"
							required
							fullWidth
						/>

						<TextField
							className="mb-16"
							label="Password (Confirm)"
							type="password"
							name="passwordConfirm"
							inputRef={register}
							error={!!errors.passwordConfirm}
							helperText={errors?.passwordConfirm?.message}
							variant="outlined"
							required
							fullWidth
						/>

						<FormControl className="items-center" error={!!errors.acceptTermsConditions}>
							<FormControlLabel
								name="acceptTermsConditions"
								label="I read and accept terms and conditions"
								control={<Checkbox inputRef={register} />}
							/>
							<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
						</FormControl>

						<Button
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16"
							aria-label="Register"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
						>
							Create an account
						</Button>
					</form>

					<div className="flex flex-col items-center justify-center pt-32 pb-24">
						<span className="font-normal">Already have an account?</span>
						<Link className="font-normal" to="/pages/auth/login-2">
							Login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default Register2Page;
