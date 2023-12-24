const express = require('express');
const s3 = require('./services/s3')
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.get('/upload/:objectKey', async (req, res) => {
  try {
    const objectKey = req.params.objectKey;
    const url = await s3.generateUploadURL(process.env.S3_BUCKET, objectKey, 180);
    res.send({ url })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/download/:objectKey', async (req, res) => {
  try {
    const objectKey = req.params.objectKey;
    const url = await s3.generateDownloadURL(process.env.S3_BUCKET, objectKey, 180);
    res.send({ url })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
