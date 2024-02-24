export default {
  formId: 'checkoutForm',
  formField: {
    recaptcha: {
      name: 'recaptcha',
      label: 'reCaptcha*',
      requiredErrorMsg: 'reCaptcha é obrigatório.',
      validatedErrorMsg: 'reCaptcha é inválido'
    },
    fullName: {
      name: 'fullName',
      label: 'Nome completo*',
      requiredErrorMsg: 'Nome completo é obrigatório.',
      validatedErrorMsg: 'Por favor, insira tanto o nome quanto o sobrenome'
    },
    cpfCnpj: {
      name: 'cpfCnpj',
      label: 'CPF*',
      validatedErrorMsg: 'O CPF é inválido.',
      requiredErrorMsg: 'CPF é obrigatório.'
    },
    email: {
      name: 'email',
      label: 'E-mail*',
      validatedErrorMsg: 'O e-mail é inválido.',
      requiredErrorMsg: 'E-mail é obrigatório.'
    },
    phone: {
      name: 'phone',
      label: 'Telefone*',
      validatedErrorMsg: 'O Telefone é inválido.',
      requiredErrorMsg: 'Telefone é obrigatório.'
    },
    zipcode: {
      name: 'zipcode',
      label: 'CEP*',
      requiredErrorMsg: 'CEP é obrigatório.',
      validatedErrorMsg: 'CEP é inválido.'
    },
    neighborhood: {
      name: 'neighborhood',
      label: 'Bairro*',
      requiredErrorMsg: 'neighborhood is required'
    },
    complement: {
      name: 'complement',
      label: 'Complemento*',
      requiredErrorMsg: 'complement is required'
    },
    addressNumber: {
      name: 'addressNumber',
      label: 'Número*',
      requiredErrorMsg: 'addressNumber is required'
    },
    address: {
      name: 'address',
      label: 'Endereço*',
      requiredErrorMsg: 'Address is required'
    },
    city: {
      name: 'city',
      label: 'Cidade*',
      requiredErrorMsg: 'City is required'
    },
    state: {
      name: 'state',
      label: 'State/Province/Region'
    },
    country: {
      name: 'country',
      label: 'Country*',
      requiredErrorMsg: 'Country is required'
    },
    useAddressForPaymentDetails: {
      name: 'useAddressForPaymentDetails',
      label: 'Use this address for payment details'
    },
    nameOnCard: {
      name: 'nameOnCard',
      label: 'Titular do cartão*',
      requiredErrorMsg: 'Titular do cartão é obrigatório'
    },
    installments: {
      name: 'installments',
      label: 'Parcelas*',
      requiredErrorMsg: 'Selecione uma opção de parcelamento'
    },
    cardNumber: {
      name: 'cardNumber',
      label: 'Número do cartão*',
      requiredErrorMsg: 'Número do cartão é obrigatório',
      invalidErrorMsg: 'Card number is not valid (e.g. 4111111111111)'
    },
    expiryDate: {
      name: 'expiryDate',
      label: 'Validade*',
      requiredErrorMsg: 'Validade é obrigatório',
      invalidErrorMsg: 'Expiry date is not valid'
    },
    cvv: {
      name: 'cvv',
      label: 'CVV*',
      requiredErrorMsg: 'CVV é obrigatório',
      invalidErrorMsg: 'CVV is invalid (e.g. 357)'
    },
    paymentMethod: {
      name: 'paymentMethod',
      label: 'Payment Method',
      requiredErrorMsg: 'Payment Method is required'
    }
  }
}
