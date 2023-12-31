const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});

async function generateSignedURL(operationType, bucketName, objectKey, expirationTime) {
  if (operationType !== 'getObject' && operationType !== 'putObject' && operationType !== 'deleteObject') {
    throw new Error('Invalid value for paramter operationType. Supported values are getObject, putObject, and deleteObject');
  }
  
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: expirationTime,
  };

  return await s3.getSignedUrlPromise(operationType, params).then((url) => {
    return url;
  }).catch((error) => { throw new Error(`Failed to generate signed URL: ${error}`); });
}

async function generateUploadURL(bucketName, objectKey, expirationTime) {
  return await generateSignedURL('putObject', bucketName, objectKey, expirationTime).then((uploadURL) => {
    return uploadURL;
  }).catch((error) => { throw new Error(`Failed to generate presigned upload URL: ${error}`); });
}

async function generateDownloadURL(bucketName, objectKey, expirationTime) {
  return await generateSignedURL('getObject', bucketName, objectKey, expirationTime).then((downloadURL) => {
    return downloadURL;
  }).catch((error) => { throw new Error(`Failed to generate presigned download URL: ${error}`); });
}

async function generateDeleteURL(bucketName, objectKey, expirationTime) {
  return await generateSignedURL('deleteObject', bucketName, objectKey, expirationTime).then((deleteURL) => {
    return deleteURL;
  }).catch((error) => { throw new Error(`Failed to generate presigned delete URL: ${error}`); });
}

module.exports = {
  generateUploadURL, 
  generateDownloadURL,
  generateDeleteURL
};
