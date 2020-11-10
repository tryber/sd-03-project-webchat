const { param, validationResult } = require('express-validator');

const UserValidationRules = [
  param('id', { message: 'ID inválido ou usuário não existe' }).isMongoId(),
];

const validate = (schemas, status) => async (req, res, next) => {
  await Promise.all(schemas.map((schema) => schema.run(req)));

  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  const errors = result.array();
  return res.status(status).send(errors[0].msg);
};

module.exports = {
  idValidate: validate(UserValidationRules, 404),
};
