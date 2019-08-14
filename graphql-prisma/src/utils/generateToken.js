import jwt from 'jsonwebtoken';

const generatedToken = (id) => {
  // token params: payload, secret, how long token should be valid
  return jwt.sign({ userId: id },'thisissecret', { expiresIn: "7 days"});
}

export { generatedToken as default };