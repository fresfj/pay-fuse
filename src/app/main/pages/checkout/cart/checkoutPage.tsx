import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import history from '@history'
import Box from '@mui/material/Box';
import { lighten, ThemeProvider } from '@mui/material/styles';
import { selectMainThemeDark } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import { Button, CardContent, CardHeader, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Fade, Grid, MobileStepper, OutlinedInput, Skeleton, Stack, Step, Stepper } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import { Link, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux'
import { useGetCheckoutMostlyFaqsQuery, useGetECommerceProductQuery } from '../CheckoutApi';
import FuseUtils from '@fuse/utils'

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
import { addToCart, calculateTotalSelector } from '../store/cartSlice';
import LoadingButton from '@mui/lab/LoadingButton';
import clsx from 'clsx';
import { OrderDataProps, createOrder } from '../store/orderSlice';

import { useAppDispatch } from 'app/store/store';
import {
	Customer,
	useCreateCustomersItemMutation,
	useGetCustomersParamsQuery
} from 'src/app/main/apps/customers/CustomersApi'
import { any } from 'promise';

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
		color: '#444394'
	}),
	'& .QontoStepIcon-completedIcon': {
		color: '#444394',
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
			borderColor: '#444394',
			boxShadow: '0 0 1px 1px rgba(0,0,0,.25), inset 0 1px hsla(0,0%,100%,.07)',
			transition: 'width 1s ease-in-out',
			position: 'relative'
		}
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#444394',
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
			color: '#444394'
		},
		[`&.${stepLabelClasses.completed}`]: {
			color: '#444394'
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
function Checkout() {
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
	const [createCustomer] = useCreateCustomersItemMutation();
	const [customerData, setCustomerData] = useState({} as any)
	const { data: customer } = useGetCustomersParamsQuery(customerData, {
		skip: !customerData
	});

	const cookiesLabel = [
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
	const captchaRef = useRef()
	const formikRef = useRef()
	const [reCaptchaReady, setReCaptchaReady] = useState(false)
	const currentValidationSchema = validationSchema[activeStep]
	const isLastStep = activeStep === steps.length - 1

	const {
		data: product,
		isLoading,
		isError
	} = useGetECommerceProductQuery(routeParams.id)

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
		} catch (error) {
			console.error(error)
		}
	}

	const _handleBack = () => {
		setActiveStep(activeStep - 1)
	}

	const _submitForm = async (values: OrderDataProps, actions: any) => {

		setProcess(true)

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
	}
	const _handleSubmit = (values: OrderDataProps, actions: any) => {
		if (isLastStep) {
			if (reCaptchaReady) {
				//captchaRef.current.execute()
			}
			_submitForm(values, actions)
		} else {
			setActiveStep(activeStep + 1)
			actions.setTouched({})
			actions.setSubmitting(false)

			if (activeStep + 1 === 1 && active) {
				handleLocation(values, actions)
				//handleCartToCustomer(values)
			}

			setCustomerData({ email: values.email, cpfCnpj: values.cpfCnpj })
		}
		const expires = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
		const options: OptionsProps = {
			path: '/',
			expires,
			secure: true,
			partitioned: true,
			sameSite: 'none'
		}
		cookiesLabel.forEach(campo => {
			setCookie(campo, values[campo], options)
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

	useDeepCompareEffect(() => {

		if (product) {
			dispatch(addToCart({
				...product,
				quantity: 1,
				installments: 0,
				value: Number(product?.priceTaxIncl)
			}))
		}



		setTimeout(() => {
			setLoading(false)
		}, 800)

	}, [routeParams, product])

	const { data: faqsMost } = useGetCheckoutMostlyFaqsQuery();

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
															{label}
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
								</Card>
							</motion.div>
						</Grid>
						<Grid item xs={12} md={4}>
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
															{item.image && !loading ? (
																<img
																	src={item.image}
																	alt="product-image"
																	className="product-img"
																/>
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
												<span className="total">
													{formatCurrencyMap(total)}
												</span>
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
					<DialogTitle>{'Processo de validação em andamento'}</DialogTitle>
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
			</div>
		</Root>
	);
}

export default Checkout;
