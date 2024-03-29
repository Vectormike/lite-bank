import createValidator from '../../helpers/createValidator';

// Account validators

export class AccountValidator {
  FundAccountValidator = createValidator((Joi) => {
    return {
      accountNumber: Joi.string().max(10).error(new Error('Provide an account number')).required().trim(),
      amount: Joi.number().max(500).error(new Error('Provide amount')).required(),
    };
  });

  TransferFundValidator = createValidator((Joi) => {
    return {
      senderAccountNumber: Joi.string().max(500).error(new Error('Provide an account number')).required().trim(),
      receiverAccountNumber: Joi.string().max(500).error(new Error('Provide an account number')).required().trim(),
      amount: Joi.number().max(500).error(new Error('Amount')).required(),
    };
  });

  WithdrawFundValidator = createValidator((Joi) => {
    return {
      accountNumber: Joi.string().max(500).error(new Error('Provide an account number')).required().trim(),
      amount: Joi.number().max(500).error(new Error('Amount')).required(),
    };
  });
}
