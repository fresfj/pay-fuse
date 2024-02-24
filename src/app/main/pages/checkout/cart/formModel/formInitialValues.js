import checkoutFormModel from './checkoutFormModel'
const {
  formField: {
    recaptcha,
    fullName,
    cpfCnpj,
    email,
    phone,
    neighborhood,
    complement,
    addressNumber,
    address,
    city,
    zipcode,
    country,
    useAddressForPaymentDetails,
    installments,
    nameOnCard,
    cardNumber,
    expiryDate,
    cvv,
    paymentMethod
  }
} = checkoutFormModel

export default data => {
  return {
    [fullName.name]: data.fullName || '',
    [cpfCnpj.name]: data.cpfCnpj || '',
    [email.name]: data.email || '',
    [phone.name]: data.phone || '',
    [zipcode.name]: data.zipcode || '',
    [neighborhood.name]: '',
    [complement.name]: data.complement || '',
    [addressNumber.name]: data.addressNumber || '',
    [address.name]: '',
    [city.name]: '',
    [country.name]: '',
    [useAddressForPaymentDetails.name]: false,
    [installments.name]: '',
    [nameOnCard.name]: '',
    [cardNumber.name]: '',
    [expiryDate.name]: '',
    [cvv.name]: '',
    [paymentMethod.name]: 'card'
  }
}
