import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { PartialDeep } from 'type-fest'
import { AppThunk, RootStateType } from 'app/store/types'
import axios from 'axios'
import { cartSliceType } from './cartSlice'
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import FuseUtils from '@fuse/utils'

const API_BACKEND = import.meta.env.VITE_API_BACKEND
const options = { headers: { 'Content-Type': 'application/json' } }

export interface OrderDataProps {
  customerId?: string
  address: string
  addressNumber: string
  state: string
  neighborhood: string
  city: string
  complement: string
  zipcode: string
  cardNumber: string
  fullName: string
  email: string
  cpfCnpj: string
  phone: string
  country?: string
  paymentMethod: string
  price: string
  cvv: string
  nameOnCard: string
  expiryDate: string
  installments: number
  installmentsOptions: [any]
  invoiceAddress?: []
  shippingAddress?: []
  useAddressForPaymentDetails: boolean
  createdAt?: string
}

export const getOrder = createAsyncThunk(
  'checkoutApp/order/getOrder',
  async (orderId: string, { dispatch, getState }) => {
    const firestore = firebase.firestore()
    const orderRef = firestore.collection('orders').doc(orderId)

    return new Promise((resolve, reject) => {
      orderRef.onSnapshot(
        snapshot => {
          if (snapshot.exists) {
            const data = snapshot.data()
            if (data && Array.isArray(data.cart.products)) {
              const updatedProducts = data.cart.products.map(product => {
                if (product.updatedAt instanceof firebase.firestore.Timestamp) {
                  return {
                    ...product,
                    updatedAt: product.updatedAt.toDate().toISOString()
                  }
                }
                return product
              })
              const updatedData = {
                ...data,
                createdAt: data.createdAt.toDate().toISOString(),
                cart: {
                  ...data.cart,
                  products: updatedProducts
                }
              }
              dispatch(refreshOrder(updatedData))
            } else {
              reject()
            }
          } else {
            reject()
          }
        },
        error => {
          reject(error)
        }
      )
    })
  }
)

export const sendOrderToAsaas = createAsyncThunk(
  'checkoutApp/order/sendOrderToAsaas',
  async (data: any, { dispatch, getState }) => {
    const current = new Date()
    const date = `${current.getFullYear()}-${
      current.getMonth() + 1
    }-${current.getDate()}`
    let payRef = null
    let dataCard = null

    if (data.cart.paymentMethod === 'card') {
      const exp = data.cart?.cardExpiry.split('/')
      dataCard = {
        totalValue: data.cart?.installmentTotal,
        installmentCount: data.cart?.installments,
        installmentValue: data.cart?.installmentValue,
        creditCard: {
          holderName: data.cart?.cardName,
          number: data.cart?.cardNumber,
          expiryMonth: exp[0],
          expiryYear: `20${exp[1]}`,
          ccv: data.cart?.cardCCV
        },
        creditCardHolderInfo: {
          name: data.customer.name,
          email: data.customer.email,
          cpfCnpj: data.customer.cpfCnpj,
          postalCode: data.customer.postalCode,
          addressNumber: data.customer.addressNumber,
          phone: data.customer.phone
        }
      }
    }
    const dataPayments = {
      customer: data.customer.id,
      billingType:
        data.cart.paymentMethod.toUpperCase() === 'CARD'
          ? 'CREDIT_CARD'
          : data.cart.paymentMethod.toUpperCase(),
      dueDate: date,
      description: data.cart.products[0].name,
      externalReference: data.cart.products[0].id,
      postalService: false,
      value: data.cart?.installmentTotal
        ? data.cart?.installmentTotal
        : data.cart.total,
      ...dataCard,
      remoteIp: '8.8.8.8'
    }

    const firestore = firebase.firestore()
    const timestamp = firebase.firestore.Timestamp.now()
    const id: string = FuseUtils.generateGUID()

    const payment = await axios.post(`${API_BACKEND}payments`, dataPayments)

    const state: any = {
      id,
      customer: data.customer,
      payment: payment.data,
      cart: data.cart
    }

    return new Promise(async (resolve, reject) => {
      await firestore
        .collection('orders')
        .doc(id)
        .set({ ...state, createdAt: timestamp })
        .then(() => {
          resolve(state)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
)

export const removeCart = createAsyncThunk(
  'checkoutApp/order/removeCart',
  async (cartId: string, { dispatch, getState }) => {
    if (!firebase.apps.length) {
      return false
    }

    const firestore = firebase.firestore()
    const cartRef = firestore.collection('carts').doc(cartId)

    return new Promise((resolve, reject) => {
      cartRef
        .delete()
        .then(() => {
          resolve('delete com sucesso' as any)
        })
        .catch(error => {
          reject('Erro ao delete os dados')
        })
    })
  }
)

export const createOrderCartToCustomer = createAsyncThunk(
  'checkoutApp/order/createOrderCartToCustomer',
  async (orderData: PartialDeep<OrderDataProps>, { dispatch, getState }) => {
    const AppState = getState() as AppCheckoutStateType
    const { cart } = AppState.checkoutApp

    if (!firebase.apps.length) {
      return false
    }

    const firestore = firebase.firestore()
    const cartRef = firestore.collection('carts')
    const timestamp = firebase.firestore.Timestamp.now()
    const id: string = FuseUtils.generateGUID()

    const { customer, ...cartAlt } = cart

    const data: any = {
      id,
      customer: cart.customer,
      cart: cartAlt
    }

    return new Promise((resolve, reject) => {
      cartRef
        .doc(id)
        .set({ ...data, createdAt: timestamp })
        .then(() => {
          resolve(data)
        })
        .catch(error => {
          resolve(error)
        })
    })
  }
)

type AppCheckoutStateType = RootStateType<cartSliceType>

export const createOrder = createAsyncThunk(
  'checkoutApp/order/createOrder',
  async (orderData: PartialDeep<OrderDataProps>, { dispatch, getState }) => {
    const AppState = getState() as AppCheckoutStateType
    const { cart } = AppState.checkoutApp
    let installment: any

    if (orderData?.installments) {
      const installmentsSelected =
        orderData?.installmentsOptions[orderData?.installments - 1]
      const installmentTotal = installmentsSelected.total
      const installmentValue = installmentsSelected.value

      installment = {
        installments: orderData?.installments,
        installmentTotal,
        installmentValue
      }
    }
    const customerData = {
      customerId: orderData.customerId,
      avatar: null,
      background: null,
      name: orderData.fullName,
      cpfCnpj: orderData.cpfCnpj,
      emails: [{ email: orderData.email, label: 'default' }],
      phoneNumbers: [
        { country: 'br', phoneNumber: orderData.phone, label: 'default' }
      ],
      title: '',
      company: '',
      birthday: null,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      addressNumber: orderData.addressNumber,
      complement: orderData.complement,
      neighborhood: orderData.neighborhood,
      city: orderData.city,
      state: orderData.state,
      postalCode: orderData.zipcode,
      invoiceAddress: orderData.invoiceAddress,
      shippingAddress: orderData.shippingAddress,
      notes: '',
      tags: []
    }
    const params = {
      email: orderData.email,
      cpfCnpj: orderData.cpfCnpj
    }
    const cartData = {
      ...cart,
      paymentMethod: orderData.paymentMethod,
      cardName: orderData?.nameOnCard,
      cardNumber: orderData?.cardNumber,
      cardExpiry: orderData?.expiryDate,
      cardCCV: orderData?.cvv,
      observations: 'SISTEMA CHECKOUT DE PAGAMENTO',
      ...installment
    }

    await axios
      .get(`${API_BACKEND}customers`, { params })
      .then(async customer => {
        const order: any = {
          customer: { ...customerData, id: customer.data.id },
          cart: cartData
        }

        return await dispatch(sendOrderToAsaas(order)).then(
          async ({ payload }) => payload
        )
      })
      .catch(async err => {
        if (err?.response.status === 404) {
          const customer = await axios.post(
            `${API_BACKEND}customers`,
            customerData
          )
          const order: any = {
            customer: { ...customerData, id: customer.data.id },
            cart: cartData
          }
          return await dispatch(sendOrderToAsaas(order)).then(
            async ({ payload }) => payload
          )
        } else {
          console.error(`err:`, err)
        }
      })
  }
)

const orderSlice = createSlice({
  name: 'checkoutApp/order',
  initialState: null,
  reducers: {
    resetOrder: () => null,
    refreshOrder: (state, action) => {
      return action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createOrderCartToCustomer.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(sendOrderToAsaas.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        return null
      })
      .addCase(getOrder.pending, (state, action) => {
        return action.payload
      })
  }
})

export const { resetOrder, refreshOrder } = orderSlice.actions
export const selectOrder = ({ checkoutApp }) => checkoutApp.order
export default orderSlice.reducer
export type orderSliceType = typeof orderSlice
