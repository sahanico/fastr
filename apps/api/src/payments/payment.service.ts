import axios from 'axios';

const CONVERGEPAY_BASE_URL = `${process.env.CONVERGEPAY_BASE_URL}`;

async function getSessionToken(body: any) {
  console.log('body: ', body);
  console.log('CONVERGEPAY_BASE_URL: ', CONVERGEPAY_BASE_URL);
  const data = Object.keys(body)
    .map((key) => `${key}=${encodeURIComponent(body[key])}`)
    .join('&');
  let response;
  try {
    response = await axios({
      method: 'post',
      url: `${CONVERGEPAY_BASE_URL}/hosted-payments/transaction_token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    });
  } catch (e) {
    console.log('err: ', e);
  }
  if (response && response.status === 200) {
    return response.data;
  }
  return false;
}

export default {
  getSessionToken,
};
