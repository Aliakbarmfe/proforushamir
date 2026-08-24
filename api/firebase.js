const fetch = require('node-fetch');

const FIREBASE_DB_URL = "https://proforosh-default-rtdb.firebaseio.com"; // آدرس پایگاه داده فایربیس شما

module.exports = async (req, res) => {
  // تنظیم CORS برای دسترسی فرانت‌اند
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.query.path || '';
  const targetUrl = `${FIREBASE_DB_URL}/${path}.json`;

  try {
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'خطا در ارتباط با فایربیس', details: error.message });
  }
};
