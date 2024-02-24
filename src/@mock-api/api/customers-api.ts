import _ from '@lodash'
import FuseUtils from '@fuse/utils'
import CustomerModel from 'src/app/main/apps/customers/models/CustomerModel'
import { PartialDeep } from 'type-fest'
import { Customer } from 'src/app/main/apps/customers/CustomersApi'
import mockApi from '../mock-api.json'
import firebase from 'firebase/compat/app'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'

const customersDB = mockApi.components.examples.contacts.value as Customer[]
const tagsDB = mockApi.components.examples.contacts_tags.value

export const customersApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/customers').reply(() => {
    return [200, customersDB]
  })

  mock.onPost('/customers').reply(({ data }) => {
    const newCustomer = CustomerModel({
      id: FuseUtils.generateGUID(),
      ...JSON.parse(data as string)
    } as PartialDeep<Customer>)
    customersDB.push(newCustomer)

    return [200, newCustomer]
  })

  mock.onGet('/customers/tags').reply(() => {
    return [200, tagsDB]
  })

  mock.onGet('/customer').reply(({ params }) => {
    const { email, cpfCnpj } = params as Params
    return new Promise(async (resolve, reject) => {
      if (email && cpfCnpj) {
        firebase
          .firestore()
          .collection('customers')
          .where('email', '==', email)
          .where('cpfCnpj', '==', cpfCnpj)
          .get()
          .then(async customerSnapshot => {
            if (customerSnapshot.empty) {
              resolve([200, {}])
            } else {
              const customersData: any[] = []
              customerSnapshot.forEach(doc => {
                const customerData = doc.data()
                customersData.push(customerData)
              })
              resolve([200, customersData])
            }
          })
          .catch(error => {
            reject([500, error])
          })
      } else {
        reject()
      }
    })
  })

  mock.onGet('/customers/:id').reply(config => {
    const { id } = config.params as Params

    const customer = _.find(customersDB, { id })

    if (customer) {
      return [200, customer]
    }

    return [404, 'Requested customer do not exist.']
  })

  mock.onPut('/customers/:id').reply(config => {
    const { id } = config.params as Params

    const newData = JSON.parse(config.data as string) as Customer

    _.assign(_.find(customersDB, { id }), newData)

    return [200, _.find(customersDB, { id })]
  })

  mock.onDelete('/customers/:id').reply(config => {
    const { id } = config.params as Params

    _.remove(customersDB, { id })

    return [200, id]
  })
}
