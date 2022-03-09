import createValidator from '../../helpers/createValidator';

export class UserValidator {
  createUserManuallyValidator = createValidator((Joi) => {
    return {
      email: Joi.string().email().required().trim().lowercase().error(new Error('A valid email address is required')),
      role: Joi.string().trim().lowercase().valid('student', 'admin').error(new Error(`Role must be either "student" or "admin"`)),
    };
  });
}
