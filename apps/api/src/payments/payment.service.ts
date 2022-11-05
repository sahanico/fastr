import axios from 'axios';

const CONVERGEPAY_BASE_URL = `${process.env.CONVERGEPAY_BASE_URL_DEMO}`;

async function getSessionToken(body: any) {
  const data = Object.keys(body)
    .map((key) => `${key}=${encodeURIComponent(body[key])}`)
    .join('&');
  const response = await axios({
    method: 'post',
    url: `${CONVERGEPAY_BASE_URL}/hosted-payments/transaction_token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  });
  if (response.status === 200) {
    return response.data;
  }
  return false;
}

export default {
  getSessionToken,
};
