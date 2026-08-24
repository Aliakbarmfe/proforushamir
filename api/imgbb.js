const fetch = require('node-fetch');

const IMGBB_API_KEY = "32b44cf4a92e03d876d7d02104feabfb";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'فقط متد POST مجاز است' });
  }

  try {
    const { image } = req.body; // رشته base64 عکس

    if (!image) {
      return res.status(400).json({ error: 'تصویری ارسال نشده است' });
    }

    // حذف پیشوند Data-URL در صورت وجود (مانند data:image/png;base64,)
    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, '');

    const formData = new URLSearchParams();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', cleanBase64);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'خطا در آپلود تصویر به ImgBB', details: error.message });
  }
};
