function validateRequest(req, res, schema) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  console.log('error: ', error);
  console.log('value: ', value);
  if (error) {
    res.status(400).send(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    req.body = value;
    return true;
  }
}

module.exports = validateRequest;
