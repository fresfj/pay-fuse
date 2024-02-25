import _ from '@lodash'
import FuseUtils from '@fuse/utils'
import mockApi from '../mock-api.json'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'
import {
  EcommerceOrder,
  EcommerceProduct
} from '../../app/main/apps/e-commerce/ECommerceApi'

import firebase from 'firebase/compat/app'

let productsDB = mockApi.components.examples.ecommerce_products
  .value as EcommerceProduct[]
let ordersDB = mockApi.components.examples.ecommerce_orders
  .value as EcommerceOrder[]

export const eCommerceApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/ecommerce/products').reply(() => {
    const productsRef = firebase
      .firestore()
      .collection('products')
      .orderBy('createdAt', 'desc')

    return new Promise(async (resolve, reject) => {
      productsRef
        .get()
        .then(querySnapshot => {
          const productsDB = querySnapshot.docs.map((doc, index) => {
            return doc.data()
          })

          setTimeout(function () {
            if (Math.random() > 0.1) {
              resolve([200, productsDB])
            } else {
              resolve([500, { success: false }])
            }
          }, 300)
        })
        .catch(error => {
          resolve([404, 'Requested product do not exist.'])
        })
    })
  })

  mock.onPost('/ecommerce/products').reply(({ data }) => {
    const newProduct = {
      id: FuseUtils.generateGUID(),
      ...JSON.parse(data as string)
    } as EcommerceProduct

    productsDB.unshift(newProduct)

    return [200, newProduct]
  })

  mock.onDelete('/ecommerce/products').reply(({ data }) => {
    const ids = JSON.parse(data as string) as string[]

    productsDB = productsDB.filter(item => !ids.includes(item.id))

    return [200, productsDB]
  })

  mock.onGet('/ecommerce/products/:id').reply(config => {
    const { id } = config.params as Params
    const productRef = firebase.firestore().collection('products').doc(id)
    return new Promise(async (resolve, reject) => {
      productRef
        .get()
        .then(async doc => {
          if (doc.exists) {
            const upProducts = []
            await productRef
              .collection('up')
              .get()
              .then(upSnapshot => {
                upSnapshot.forEach(doc => {
                  upProducts.push({ id: doc.id, ...doc.data() })
                })
              })

            resolve([200, { ...doc.data(), upProducts }])
          } else {
            reject([404, 'Requested product do not exist.'])
          }
        })
        .catch(error => {
          reject([500, error])
        })
    })
  })

  mock.onPut('/ecommerce/products/:id').reply(config => {
    const { id } = config.params as Params

    _.assign(_.find(productsDB, { id }), JSON.parse(config.data as string))

    return [200, _.find(productsDB, { id })]
  })

  mock.onDelete('/ecommerce/products/:id').reply(config => {
    const { id } = config.params as Params

    _.remove(productsDB, { id })

    return [200, id]
  })

  mock.onGet('/ecommerce/orders').reply(() => {
    const ordersRef = firebase
      .firestore()
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .limit(12)

    return new Promise(async (resolve, reject) => {
      await ordersRef
        .get()
        .then(async querySnapshot => {
          const newData = querySnapshot.docs.map(doc => {
            const products = []
            doc.data().cart.products.map((itens: any) => {
              products.push({
                id: itens.id,
                name: itens.name ? itens.name : itens.title,
                price: itens.value,
                quantity: itens.quantity,
                total: itens.value,
                image: itens.image
              })
            })

            const ordeAdd = {
              reference: doc.data().uid
                ? doc.data().uid
                : doc.data().payment?.invoiceNumber,
              subtotal: doc.data().cart.subTotal,
              tax: '0',
              discount: doc.data().cart.discount.value,
              total: doc.data().payment?.value
                ? doc.data().payment?.value
                : doc.data().cart?.total,
              date: new Date(doc.data().createdAt.toDate()),
              customer: {
                id: doc.data().customer?.id,
                firstName: doc.data().customer?.firstName
                  ? doc.data().customer?.firstName
                  : doc.data().customer?.name,
                email: doc.data().customer?.email,
                phone: doc.data().customer?.phone,
                invoiceAddress: {
                  address: doc.data().customer?.invoiceAddress?.address,
                  lat: doc.data().customer?.invoiceAddress?.lat,
                  lng: doc.data().customer?.invoiceAddress?.lng
                },
                shippingAddress: {
                  address: doc.data().customer?.shippingAddress?.address,
                  lat: doc.data().customer?.shippingAddress?.lat,
                  lng: doc.data().customer?.shippingAddress?.lng
                }
              },
              products,
              status: [
                {
                  id: 1,
                  name: doc.data().payment.status,
                  date: doc.data().payment.dueDate
                }
              ],
              payment: {
                transactionId: doc.data().payment.id,
                creditCard: doc.data().payment?.creditCard,
                amount: doc.data().payment.value,
                method: doc.data().payment.billingType,
                date: doc.data().payment.dueDate
              },
              shippingDetails: [
                {
                  tracking: '',
                  carrier: '',
                  weight: '',
                  fee: '',
                  date: ''
                }
              ]
            }
            return { ...ordeAdd, id: doc.id }
          })
          resolve([200, newData])
        })
        .catch(error => {
          resolve([404, 'Requested order do not exist.'])
        })
    })
  })

  mock.onPost('/ecommerce/orders').reply(config => {
    const newOrder = {
      id: FuseUtils.generateGUID(),
      ...JSON.parse(config.data as string)
    } as EcommerceOrder

    ordersDB.push(newOrder)

    return [200, newOrder]
  })

  mock.onDelete('/ecommerce/orders').reply(config => {
    const ids = JSON.parse(config.data as string) as string[]
    ordersDB = ordersDB.filter(item => !ids.includes(item.id))

    return [200, ordersDB]
  })

  mock.onGet('/ecommerce/orders/:id').reply(config => {
    const { id } = config.params as Params
    const ordersRef = firebase.firestore().collection('orders').doc(id)

    return new Promise(async (resolve, reject) => {
      await ordersRef
        .get()
        .then(doc => {
          const products = []
          doc.data().cart.products.map((itens: any) => {
            products.push({
              id: itens.id,
              name: itens.name ? itens.name : itens.title,
              price: itens.value,
              quantity: itens.quantity,
              total: itens.value,
              image: itens.image
            })
          })

          const order = {
            id: doc.data().uid,
            reference: doc.data().uid
              ? doc.data().uid
              : doc.data().payment?.invoiceNumber,
            subtotal: doc.data().cart.subTotal,
            tax: '0',
            discount: doc.data().cart.discount.value,
            total: doc.data().payment.value,
            date: doc.data().createdAt.toDate(),
            customer: {
              id: doc.data().customer?.id ? doc.data().customer?.id : 1,
              firstName: doc.data().customer?.firstName
                ? doc.data().customer?.firstName
                : doc.data().customer?.name,
              lastName: '',
              avatar: '',
              company: '',
              jobTitle: '',
              email: doc.data().customer?.email,
              phone: doc.data().customer?.phone,
              address: doc.data().customer?.address,
              addressNumber: doc.data().customer?.addressNumber,
              neighborhood: doc.data().customer?.neighborhood
                ? doc.data().customer?.neighborhood
                : '',
              city: doc.data().customer?.city ? doc.data().customer?.city : '',
              state: doc.data().customer?.state
                ? doc.data().customer?.state
                : '',
              invoiceAddress: {
                address: doc.data().customer?.invoiceAddress?.address,
                lat: doc.data().customer?.invoiceAddress?.lat,
                lng: doc.data().customer?.invoiceAddress?.lng
              },
              shippingAddress: {
                address: doc.data().customer?.shippingAddress?.address,
                lat: doc.data().customer?.shippingAddress?.lat,
                lng: doc.data().customer?.shippingAddress?.lng
              }
            },
            products,
            status: [
              {
                id: 1,
                name: doc.data().payment.status,
                date: doc.data().payment.dueDate
              }
            ],
            payment: {
              transactionId: doc.data().payment.id,
              creditCard: doc.data().payment?.creditCard,
              amount: doc.data().payment.value,
              method: doc.data().payment.billingType,
              date: doc.data().payment.dueDate
            },
            shippingDetails: [
              {
                tracking: '',
                carrier: '',
                weight: '',
                fee: '',
                date: ''
              }
            ]
          }

          resolve([200, order])
        })
        .catch(error => {
          resolve([404, 'Requested order do not exist.'])
        })
    })
  })

  mock.onPut('/ecommerce/orders/:id').reply(config => {
    const { id } = config.params as Params

    _.assign(
      _.find(ordersDB, { id }),
      JSON.parse(config.data as string) as EcommerceOrder
    )

    return [200, _.find(ordersDB, { id })]
  })

  mock.onDelete('/ecommerce/orders/:id').reply(config => {
    const { id } = config.params as Params

    _.remove(ordersDB, { id })

    return [200, id]
  })
}
