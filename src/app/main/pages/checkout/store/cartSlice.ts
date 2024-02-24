import { createSlice } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import { createSelector } from 'reselect'

const cartSlice = createSlice({
  name: 'checkoutApp/cart',
  initialState: {
    products: [],
    quantity: 0,
    discount: { value: 0, code: '', applied: '' },
    subTotal: 0,
    total: 0
  },
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.products.find(
        item => item.id === action.payload.id
      )
      if (itemExists) {
        //itemExists.quantity++;
      } else {
        state.products.push({ ...action.payload, quantity: 1 })
      }
      updateCartTotals(state)
    },
    incrementQuantity: (state, action) => {
      const item = state.products.find(item => item.id === action.payload)
      item.quantity++
    },
    decrementQuantity: (state, action) => {
      const item = state.products.find(item => item.id === action.payload)
      if (item.quantity === 1) {
        const index = state.products.findIndex(
          item => item.id === action.payload
        )
        state.products.splice(index, 1)
      } else {
        item.quantity--
      }
    },
    removeFromCart: (state, action) => {
      const index = state.products.findIndex(item => item.id === action.payload)
      state.products.splice(index, 1)
      updateCartTotals(state)
    },
    addDiscount: (state, action) => {
      state.discount = action.payload
    },
    removeDiscount: state => {
      state.discount = { value: 0, code: '', applied: '' }
    },
    getTotals(state) {
      let { total, quantity } = state.products.reduce(
        (cartTotal, cartItem) => {
          const { value, quantity } = cartItem
          const valueTotal = value * quantity

          cartTotal.total += valueTotal
          cartTotal.quantity += quantity

          return cartTotal
        },
        {
          total: 0,
          quantity: 0
        }
      )
      state.quantity = quantity
      state.subTotal = total
      state.total = total - state.discount.value
    }
  }
})

const updateCartTotals = state => {
  state.subTotal = state.products.reduce(
    (acc, item) => acc + item.value * item.quantity,
    0
  )
  state.quantity = state.products.reduce((acc, item) => acc + item.quantity, 0)
  state.total = state.subTotal - state.discount.value
}

type AppRootStateType = RootStateType<cartSliceType>
export type cartSliceType = typeof cartSlice

export default cartSlice.reducer

export const {
  addToCart,
  addDiscount,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  removeDiscount,
  getTotals
} = cartSlice.actions

export const getDiscount = state => state.checkoutApp.cart.discount.value
export const itemsCartSelector = state => state.checkoutApp.cart

export const calculateTotalSelector = createSelector(
  itemsCartSelector,
  ({ products, discount }) => {
    return (
      products.reduce((acc, item) => acc + item.value * item.quantity, 0) -
      discount.value
    )
  }
)
