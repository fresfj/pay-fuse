import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import history from '@history'
import Box from '@mui/material/Box';
import { lighten, ThemeProvider } from '@mui/material/styles';
import { selectMainThemeDark } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import { Button, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fade, FormControl, Grid, IconButton, InputAdornment, MobileStepper, Skeleton, Stack, Step, Stepper, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import { Link, useLocation, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux'
import { useGetCheckoutMostlyFaqsQuery, useGetECommerceProductQuery } from '../CheckoutApi';
import FuseUtils from '@fuse/utils'
import _ from '@lodash';

import { Formik, Form } from 'formik'
import Reaptcha from 'reaptcha'
import { useCookies } from 'react-cookie'
import { useDeepCompareEffect } from '@fuse/hooks';

import { styled } from '@mui/material/styles'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel'

import validationSchema from './formModel/validationSchema'
import checkoutFormModel from './formModel/checkoutFormModel'
import formInitialValues from './formModel/formInitialValues'
import AddressForm from './forms/AddressForm'
import PaymentForm from './forms/PaymentForm'
import { addCustomer, addToCart, calculateTotalSelector, updateProduct } from '../store/cartSlice';
import LoadingButton from '@mui/lab/LoadingButton';
import clsx from 'clsx';
import { OrderDataProps, createOrder, createOrderCartToCustomer, removeCart } from '../store/orderSlice';
import { useAppDispatch } from 'app/store/store';
import {
	Customer,
	useCreateCustomersItemMutation,
	useGetCustomersParamsQuery
} from 'src/app/main/apps/customers/CustomersApi'


const steps = ['Informações', 'Pagamento']
const { formId, formField } = checkoutFormModel

interface QontoStepIconRootProps {
	ownerState?: {
		active: boolean;
	};
}

interface OptionsProps {
	path: string;
	expires: Date;
	secure: boolean;
	partitioned: boolean;
	sameSite: 'none' | 'lax' | 'strict';
}

const Root = styled('div')(({ theme }) => ({
	'& .MuiFilledInput-root': {
		overflow: 'hidden',
		transition:
			'border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		border: '1px solid #E0E3E7',

		'&:hover': {
			boxShadow: '0 0.15rem 0.25rem rgba(0, 0, 0, 0.25)'
		},

		' &.Mui-focused': {
			outline: 0,
			borderColor: '#86b7fe',
			boxShadow: '0 0 0 0.35rem rgba(13, 110, 253, .25)'
		},

		' &.Mui-error': {
			borderColor: ' #d32f2f',
			color: '#d32f2f',
			' &.Mui-focused': {
				boxShadow: '0 0 0 0.35rem rgba(210, 47, 47, .25)'
			}
		}
	},
	'& .g-recaptcha': {
		display: 'none!important'
	},
	'& table ': {
		'& th:first-of-type, & td:first-of-type': {
			paddingLeft: `${0}!important`
		},
		'& th:last-child, & td:last-child': {
			paddingRight: `${0}!important`
		}
	},
	'& .small-text': {
		fontSize: 14,
		fontWeight: 400,
		color: theme.palette.text.secondary
	},
	'& .product-header': {
		padding: `20px!important`,
		minHeight: `50px`,
		fontWeight: 700,
		fontSize: 16,
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark)
	},
	'& .content-card': {
		padding: '15px 20px',
		display: 'flex',
		alignItems: 'center',
		'& .imagem-produto': {
			backgroundColor: theme.palette.primary.dark,
			minWidth: 120,
			maxWidth: 120,
			borderRadius: '0.6rem',
			marginRight: 15
		},
		'& .product-img': {
			margin: '0 auto',
			display: 'block',
			width: '100%',
			height: '100%',
			objectFit: 'fill',
			borderRadius: 6
		},
		'& .info-card': {
			width: '100%'
		}
	},
	'& .product-footer': {
		alignItems: 'flex-end',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		padding: '1.6rem 1.1rem',
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark),
		'& span': {
			flex: 1,
			fontSize: 14,

			'& h6': {
				flex: 1,
				color: theme.palette.getContrastText(theme.palette.primary.dark)
			},

			'&.desc': {
				fontSize: '1.1rem',
				fontWeight: 400
			},
			'&.total': {
				marginTop: '0.2rem',
				fontSize: '2.6rem',
				fontWeight: 400,
				marginRight: 18,

				'& span.fraction': {
					position: 'absolute',
					lineHeight: 1.8
				}
			}
		}
	},
	'& .btn-checkout': {
		padding: '0 42px',
		height: '44px!important',
		maxHeight: '44px!important',
		border: 'none',
		outline: 'none',
		borderRadius: '0.48rem',
		transition: 'all 0.3s',
		fontSize: 16,
		fontWeight: 600,
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark),
		textTransform: 'uppercase',
		'&:hover': {
			boxShadow:
				'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
			transform: 'scale(1.04)'
		}
	}
}))

const QontoStepIconRoot = styled('div')<QontoStepIconRootProps>(({ theme, ownerState }) => ({
	color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
	display: 'flex',
	height: 42,
	alignItems: 'center',
	...(ownerState.active && {
		color: theme.palette.primary.dark
	}),
	'& .QontoStepIcon-completedIcon': {
		color: theme.palette.primary.dark,
		zIndex: 1,
		fontSize: 18
	},
	'& .QontoStepIcon-circle': {
		width: 8,
		height: 8,
		borderRadius: '50%',
		backgroundColor: 'currentColor',
		zIndex: 1
	},
	'& .nu': {
		position: 'absolute',
		padding: 1,
		width: 16,
		height: 16,
		display: 'flex',
		marginLeft: -4,

		'& .ajg': {
			borderRadius: 9999,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgb(199 210 254 / 1)'
		}
	}
}))

const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 10,
		left: 'calc(-50% + 16px)',
		right: 'calc(50% + 16px)'
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: theme.palette.primary.dark,
			boxShadow: '0 0 1px 1px rgba(0,0,0,.25), inset 0 1px hsla(0,0%,100%,.07)',
			transition: 'width 1s ease-in-out',
			position: 'relative'
		}
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: theme.palette.primary.dark,
			boxShadow: '0 0 1px 1px rgba(0,0,0,.25), inset 0 1px hsla(0,0%,100%,.07)',
			transition: 'width 1s ease-in-out',
			position: 'relative'
		}
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor:
			theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
		borderTopWidth: 4,
		borderRadius: 2,
		boxShadow: 'inset 0 1px 2px rgba(0,0,0,.25), 0 1px hsla(0,0%,100%,.06)',
		backgroundImage:
			'linear-gradient(180deg,hsla(0,0%,100%,.3),hsla(0,0%,100%,.05))',
		overflow: 'visible'
	}
}))

const ColorStepLabel = styled(StepLabel)(({ theme }) => ({
	[`& .${stepLabelClasses.label}`]: {
		[`&.${stepLabelClasses.active}`]: {
			color: theme.palette.primary.dark
		},
		[`&.${stepLabelClasses.completed}`]: {
			color: theme.palette.primary.dark
		}
	}
}))

const _renderTextoProcess = (params, process) => {
	const dispatch = useAppDispatch()
	const [texto, setTexto] = useState('Validando suas informações...')
	const { order } = useSelector((state: any) => state.checkoutApp)

	useEffect(() => {
		if (process && order) {
			setTimeout(() => history.push(`/thanks/${order?.id}`), 7500)
		}
	}, [order, dispatch])

	useEffect(() => {
		const intervalo = setInterval(() => {
			setTexto(textoAtual => {
				switch (textoAtual) {
					case 'Validando suas informações...':
						return 'Validando o seu pagamento...'
					case 'Validando o seu pagamento...':
						return 'Processando o seu pagamento...'
					case 'Processando o seu informações...':
						return 'Aguarde estamos finalização...'
					default:
						return 'Validando suas informações...'
				}
			})
		}, 3500)
		return () => clearInterval(intervalo)
	}, [texto, process])
	return (
		<Fade in={true} style={{ transitionDelay: '200ms' }}>
			<Typography variant="h6" component="div" mr={2}>
				{texto}
			</Typography>
		</Fade>
	)
}

/**
 * The checkout.
 */
function CheckoutPage() {
	const mainThemeDark = useSelector(selectMainThemeDark)
	const dispatch = useAppDispatch();
	const routeParams = useParams()
	const [process, setProcess] = useState(false)
	const [loading, setLoading] = useState(true)
	const [activeStep, setActiveStep] = useState(0)
	const [validate, setValidate] = useState(true)
	const [active, setActive] = useState(true)
	const total = useSelector(calculateTotalSelector)
	const { cart } = useSelector((state: any) => state.checkoutApp)
	const [createCustomer] = useCreateCustomersItemMutation()
	const [customerData, setCustomerData] = useState()
	const { data: customer } = useGetCustomersParamsQuery(customerData, { skip: !customerData })
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const currentAmount = searchParams.get('amount') || '';
	const [amount, setAmount] = useState(currentAmount)
	const cookiesLabel = [
		'cartId',
		'fullName',
		'email',
		'phone',
		'cpfCnpj',
		'zipcode',
		'address',
		'addressNumber',
		'complement'
	]
	const [cookies, setCookie, removeCookie] = useCookies(cookiesLabel)
	const captchaRef = useRef<Reaptcha>(null)
	const formikRef = useRef()
	const [reCaptchaReady, setReCaptchaReady] = useState(false)
	const currentValidationSchema = validationSchema[activeStep]
	const isLastStep = activeStep === steps.length - 1
	const [cartId, setCartId] = useState(cookies?.cartId || '')

	const {
		data: product,
		isLoading,
		isError
	} = useGetECommerceProductQuery(routeParams.id, {
		skip: routeParams.id === 'billing'
	})

	const handleLoadReCaptcha = () => {
		setReCaptchaReady(true)
	}

	async function handleLocation(values, actions) {
		try {
			const location: any = await FuseUtils.getLocation(
				`${values.address}, ${values.addressNumber}`
			)

			const address: any = {
				address: location?.address,
				lat: location?.lat,
				lng: location?.lng
			}

			actions.setFieldValue('invoiceAddress', address)
			actions.setFieldValue('shippingAddress', address)
			return address
		} catch (error) {
			console.error(error)
		}
	}

	const _handleBack = () => {
		setActiveStep(activeStep - 1)
	}

	const _submitForm = async (values: OrderDataProps, actions: any) => {

		setProcess(true)
		const options: OptionsProps = {
			path: '/',
			expires: new Date(0),
			secure: true,
			partitioned: true,
			sameSite: 'none'
		}

		if (customer && customer.length > 0) {
			await dispatch(createOrder({ ...values, customerId: customer[0].id } as any)).then(async ({ payload }) => {
				setTimeout(() => {
					setProcess(false)
					actions.setSubmitting(false)
					setActiveStep(activeStep + 1)
				}, 12000)
			})
		} else {
			createCustomer({ customer: values } as any)
				.unwrap()
				.then(async (action) => {
					await dispatch(createOrder({ ...values, customerId: action.id } as any)).then(async ({ payload }) => {
						setTimeout(() => {
							setProcess(false)
							actions.setSubmitting(false)
							setActiveStep(activeStep + 1)
						}, 12000)
					})
				});
		}

		cookiesLabel.forEach(cookie => { removeCookie(cookie, options) })
		dispatch(removeCart(cartId))
	}

	const _handleSubmit = async (values: OrderDataProps, actions: any) => {
		const expires = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
		const options: OptionsProps = {
			path: '/',
			expires,
			secure: true,
			partitioned: true,
			sameSite: 'none'
		}

		if (isLastStep) {
			if (reCaptchaReady) {
				captchaRef.current.execute()
			}
			_submitForm(values, actions)
		} else {
			setActiveStep(activeStep + 1)
			actions.setTouched({})
			actions.setSubmitting(false)
			setCustomerData({ email: values.email, cpfCnpj: values.cpfCnpj } as any)
			if (activeStep + 1 === 1 && active) {
				handleLocation(values, actions).then(async (local) => {
					const data = { ...values, invoiceAddress: local, shippingAddress: local }
					if (!cartId) {
						await dispatch(createOrderCartToCustomer(data)).then(({ payload }) => {
							setCartId(payload.id)
							setCookie('cartId', payload.id, options)
						})
					}
				})
			}
		}

		cookiesLabel.forEach(campo => {
			if (campo !== 'cartId') {
				setCookie(campo, values[campo], options)
			}
		})
	}

	const _handleSubmitOn = (values) => {
		if (values.paymentMethod === 'pix' || values.paymentMethod === 'boleto') {
			setValidate(false)
		} else {
			setValidate(true)
		}
	}

	const _renderStepContent = (step) => {
		switch (step) {
			case 0:
				return <AddressForm formField={formField} />
			case 1:
				return <PaymentForm formField={formField} />
			default:
				return <div>Ocorreu um error! Em seu pagamento informe o suporte.</div>
		}
	}

	const QontoStepIcon = (props) => {
		const { active, completed, className } = props
		return (
			<QontoStepIconRoot ownerState={{ active }} className={className}>
				{active && (
					<span className="nu">
						<span className="ajg"></span>
					</span>
				)}
				{completed ? (
					<FuseSvgIcon className="QontoStepIcon-completedIcon">
						material-outline:done_all
					</FuseSvgIcon>
				) : (
					<div className="QontoStepIcon-circle" />
				)}
			</QontoStepIconRoot>
		)
	}

	const formatCurrencyMap = number => {
		let currency,
			fraction,
			values = ''
		const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: 'BRL'
		})

		CURRENCY_FORMATTER.formatToParts(number)
			.map(({ type, value }) => {
				switch (type) {
					case 'currency':
						return (currency = value)
					case 'fraction':
						return (fraction = value)
					default:
						return (values += value)
				}
			})
			.join('')
		return (
			<>
				<span className="currency">{currency}</span>
				{values}
				<span className="fraction">{fraction}</span>
			</>
		)
	}

	useEffect(() => {
		if (customer && customer.length > 0) {
			dispatch(addCustomer(customer[0]))
		} else if (customerData && active) {
			createCustomer({ customer: cart.customer } as any)
				.unwrap()
				.then(async (action) => {
					dispatch(addCustomer(action))
				})
		}
	}, [setCustomerData, customer])

	useDeepCompareEffect(() => {

		if (product) {
			dispatch(addToCart({
				...product,
				quantity: 1,
				installments: 0,
				value: Number(product?.priceTaxIncl)
			}))
		}

		if (amount && routeParams.id === 'billing') {
			dispatch(addToCart({
				id: 1,
				name: 'Pagamento',
				image: '',
				images: [{ id: 1, name: 'Pagamento' }],
				upProducts: [],
				quantity: 1,
				installments: 0,
				value: Number(amount)
			}))
		}

		setTimeout(() => {
			setLoading(false)
		}, 800)

	}, [routeParams, product])

	const [open, setOpen] = React.useState(false);

	const handleClickListItem = () => {
		setOpen(true);
	};

	const handleClose = (newValue?: string) => {
		setOpen(false);

		if (newValue !== amount && !isNaN(Number(newValue))) {
			const newSearchParams = new URLSearchParams(location.search);
			newSearchParams.set('amount', newValue);
			const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
			dispatch(updateProduct({ id: 1, newValue }));
			setAmount(newValue)
			history.push(newUrl);
		}
	}

	return (
		<Root className="flex flex-col flex-auto min-w-0">
			<ThemeProvider theme={mainThemeDark}>
				<Box
					className="relative pb-112 px-16 sm:pb-192 sm:px-64 overflow-hidden"
					sx={{
						backgroundColor: 'primary.dark',
						color: theme =>
							theme.palette.getContrastText(theme.palette.primary.main)
					}}
				>
					<div className={clsx('FusePageCarded-header', 'container')}>
						<div className="flex flex items-center w-full mt-10 mx-10 pt-16 sm:pt-32 justify-between">
							<object
								className="w-64"
								type="image/svg+xml"
								data="assets/images/logo/logo-animation.svg"
							/>
						</div>
					</div>
					<svg
						className="absolute inset-0 pointer-events-none"
						viewBox="0 0 960 540"
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMax slice"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g
							className="text-gray-700 opacity-25"
							fill="none"
							stroke="currentColor"
							strokeWidth="100"
						>
							<circle r="234" cx="196" cy="23" />
							<circle r="234" cx="790" cy="491" />
						</g>
					</svg>
				</Box>
			</ThemeProvider>
			<div className="flex flex-col items-center px-4 sm:px-40">
				<Box className="w-full max-w-sm md:max-w-7xl -mt-64 sm:-mt-96">
					<Grid container spacing={2} className="product">
						<Grid item xs={12} md={8} className="order-last md:order-first">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { delay: 0.2 } }}
							>
								<Card className="relative mb-30 pt-0 sm:px-20 rounded-6 shadow hover:shadow-lg transition-shadow ease-in-out duration-150">
									<CardContent>
										<div className="py-4">
											<MobileStepper
												variant="dots"
												steps={2}
												position="static"
												activeStep={activeStep}
												nextButton={<></>}
												backButton={
													activeStep !== 0 && (
														<Button
															variant="outlined"
															sx={{ borderRadius: 2 }}
															startIcon={
																<FuseSvgIcon>
																	heroicons-outline:arrow-narrow-left
																</FuseSvgIcon>
															}
															onClick={_handleBack}
														>
															Voltar
														</Button>
													)
												}
												sx={{
													flexGrow: 1,
													height: 60,
													bgcolor: 'transparent',
													justifyContent:
														activeStep !== 0 ? 'space-between' : 'end',
													'& .MuiMobileStepper-dot': {
														backgroundColor: 'primary.dark'
													},
													'& .MuiMobileStepper-dotActive ~ .MuiMobileStepper-dot':
													{
														backgroundColor: '#eaeaf0'
													}
												}}
											/>
										</div>
										<Stack spacing={2}>
											<Stepper
												activeStep={activeStep}
												connector={<QontoConnector />}
											>
												{steps.map(label => (
													<Step key={label}>
														<ColorStepLabel StepIconComponent={QontoStepIcon}>
															<Typography
																variant="h4"
																component="h2"
																className="m-8 text-2xl antialiased font-semibold text-sky-400/75"
															>
																{label}
															</Typography>
														</ColorStepLabel>
													</Step>
												))}
											</Stepper>
										</Stack>
										<Formik
											innerRef={formikRef}
											initialValues={formInitialValues(cookies)}
											validationSchema={
												validate ? currentValidationSchema : false
											}
											onSubmit={_handleSubmit}
										>
											{({ isSubmitting, values, setFieldValue }) => (
												<Form id={formId}>
													<Reaptcha
														ref={captchaRef}
														size="invisible"
														sitekey="6LeMznUpAAAAAL8J6VHcqTKW1nUlXWHlC79SpLUm"
														onLoad={handleLoadReCaptcha}
														onVerify={recaptchaResponse => {
															setFieldValue('recaptcha', recaptchaResponse)
														}}
													/>
													{_renderStepContent(activeStep)}
													<div className="mt-20">
														<LoadingButton
															fullWidth
															className="btn btn-checkout btn-success"
															disabled={isSubmitting}
															onClick={() => _handleSubmitOn(values)}
															loadingPosition={'center'}
															type="submit"
															variant="contained"
															color="primary"
														>
															{isSubmitting ? (
																<span
																	className="d-flex justify-content-center align-items-center"
																	style={{ color: '#828199' }}
																>
																	<CircularProgress
																		color="inherit"
																		size={20}
																		className="mx-2"
																	/>{' '}
																	Loading…
																</span>
															) : (
																<span>
																	{isLastStep
																		? 'Adquirir Agora'
																		: 'Revisar Informações'}
																</span>
															)}
														</LoadingButton>
													</div>
												</Form>
											)}
										</Formik>
									</CardContent>
									<div className="flex flex-col items-center my-24 px-12 text-justify">
										<p className="small text-wrap mb-0">
											<small>
												Este site é criptografadas e protegido por reCAPTCHA e
												Google.{' '}
												<a
													href="https://policies.google.com/privacy"
													target="_blank"
													title="Política de privacidade"
												>
													Política de privacidade
												</a>{' '}
												e{' '}
												<a
													href="https://policies.google.com/terms"
													target="_blank"
													title="Termos de serviço"
												>
													Termos de serviço
												</a>{' '}
												se aplicam.
											</small>
										</p>
										<p className="small text-wrap mb-0">
											<small>
												DPay está processando este pedido à serviço de{' '}
												<b>DIGITAL STAGE</b>. Ao prosseguir você está
												concordando com os{' '}
												<a
													href="https://ds3i.com.br/terms-use/"
													target="_blank"
													title="Termos de compra"
												>
													Termos de compra
												</a>
											</small>
										</p>
									</div>
								</Card>
							</motion.div>
						</Grid>
						<Grid item xs={12} md={4} className='relative md:sticky top-10 h-fit'>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { delay: 0.3 } }}
							>
								<Card
									sx={{ height: 'max-content' }}
									className="relative rounded-6 shadow hover:shadow-lg transition-shadow ease-in-out duration-150"
								>
									<CardHeader
										sx={{ padding: 0 }}
										title={
											<Typography
												className="product-header p-0 text-white"
												component={'div'}
											>
												COMPRA 100% SEGURA
											</Typography>
										}
									/>
									<CardContent sx={{ padding: '0 !important' }}>
										{cart?.products.length > 0 ? (
											cart.products.map((item, k) => (
												<div key={k}>
													{k > 0 ? <Divider /> : ''}
													<div className="content-card">
														<div className="imagem-produto">
															{item?.images?.length > 0 && !loading ? (

																item.featuredImageId ? (
																	<img
																		className="w-full block rounded product-img"
																		src={_.find(item.images, { id: item.featuredImageId })?.url}
																		alt={item.name}
																	/>
																) : (
																	<img
																		className="w-full block rounded product-img"
																		src="assets/images/apps/ecommerce/on-payment.png"
																		alt={item.name}
																	/>
																)

															) : (
																<Skeleton
																	sx={{ borderRadius: 2 }}
																	animation="wave"
																	variant="rounded"
																	width={120}
																	height={120}
																/>
															)}
														</div>
														<div className="info-card">
															<div className="product-name">
																<Typography variant="h6">
																	{loading ? (
																		<Skeleton animation="wave" width="100%" />)
																		:
																		item.name
																	}
																</Typography>
															</div>
															<div className="product-price">
																<small className="d-block small-text">
																	{loading ? (
																		<Skeleton animation="wave" width="100%" />
																	) : (
																		`à vista ${FuseUtils.formatCurrency(
																			item.value
																		)}`
																	)}
																</small>
															</div>
														</div>
													</div>
												</div>
											))
										) : (
											<div className="content-card" key={1}>
												<div className="imagem-produto">
													<Skeleton
														sx={{ borderRadius: 2 }}
														animation="wave"
														variant="rounded"
														width={120}
														height={120}
													/>
												</div>
												<div className="info-card">
													<div className="product-name">
														<Typography variant="h6">
															<Skeleton animation="wave" width="100%" />
														</Typography>
													</div>
													<div className="product-price">
														<Skeleton animation="wave" width="100%" />
													</div>
												</div>
											</div>
										)}
										<div className="product-footer">
											<span className="text-white">Valor total previsto</span>
											{loading ? (
												<Skeleton
													className="total"
													animation="wave"
													width="60%"
												/>
											) : (
												<span className="total proportional-nums">
													{formatCurrencyMap(total)}
												</span>
											)}

											{amount && (
												<div className="flex flex-col justify-center w-full mt-12">
													<div className="p-8 grid justify-items-center">
														<Button className='w-[90%] rounded-8' variant="outlined" onClick={handleClickListItem}>Alterar valor</Button>
													</div>
												</div>
											)}

										</div>
									</CardContent>
								</Card>
							</motion.div>
						</Grid>
					</Grid>
				</Box>
				<Dialog
					open={process}
					fullWidth
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
					style={{ backdropFilter: 'blur(5px)' }}
				>
					<DialogTitle>{'Validação em andamento'}</DialogTitle>
					<DialogContent sx={{ marginY: 2 }}>
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
						>
							{_renderTextoProcess(routeParams, process)}
							<CircularProgress color="inherit" />
						</Grid>
					</DialogContent>
				</Dialog>
				<ConfirmationDialogRaw
					id="ringtone-menu"
					keepMounted
					open={open}
					onClose={handleClose}
					value={amount}
				/>
			</div>
		</Root>
	);
}

export default CheckoutPage;

export interface ConfirmationDialogRawProps {
	id: string;
	keepMounted: boolean;
	value: string;
	open: boolean;
	onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
	const { onClose, value: valueProp, open, ...other } = props;
	const [value, setValue] = useState(valueProp);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!open) {
			setValue(valueProp);
		}
	}, [valueProp, open]);

	const handleCancel = () => {
		onClose();
	};

	const handleOk = () => {
		onClose(value);
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = (event.target as HTMLInputElement).value
		const regex = /^\d*\.?\d{0,2}$/

		const floatValue = parseFloat(inputValue)
		const isInRange = floatValue >= 25 && floatValue <= 5000
		setValue(inputValue)

		if (regex.test(inputValue) && isInRange) {
			setError(false)
		} else {
			setError(true)
		}
	}

	return (
		<Dialog
			sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 }, color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
			fullWidth
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			style={{ backdropFilter: 'blur(5px)' }}
			maxWidth="xs"
			onClose={handleCancel}
			open={open}
			{...other}
		>
			<DialogTitle>Alterar valor</DialogTitle>
			<IconButton
				aria-label="close"
				onClick={handleCancel}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
			>
				<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
			</IconButton>
			<DialogContent dividers>
				<FormControl fullWidth>
					<TextField id="filled-basic" type='tel' value={value} onChange={handleInputChange} label="Novo valor"
						variant="filled"
						error={error}
						helperText={error ? 'O valor deve estar entre R$ 25 e R$ 5.000' : ''}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">R$</InputAdornment>
							)
						}} />
				</FormControl>
			</DialogContent>
			<DialogActions className='grid gap-4 grid-cols-2'>
				<Button className='rounded-8' autoFocus onClick={handleCancel}>
					Cancelar
				</Button>
				<Button className='rounded-8' variant='contained' color="secondary" onClick={handleOk}>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
}