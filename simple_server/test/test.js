const app = require('../src/server');
const mocha = require('mocha');
const request = require('supertest');
const axios = require('axios');
const fs = require('fs');
const should = require('should');
const { constants } = require('buffer');

// Supress http request logging
process.env.NODE_ENV = 'test';

// Set constants and declare variables
const imagePath = 'test/test_image.jpeg';
const imageFile = fs.readFileSync(imagePath);
const objectKey = 'test_image';
let response, aws_response, first_upload_url, second_upload_url, download_url, delete_url;

describe('.env File', () => {
  it('Contains AWS Access Key', () => { process.env.AWS_ACCESS_KEY_ID.should.be.ok; });
  it('Contains AWS Secret Access Key', () => { process.env.AWS_SECRET_ACCESS_KEY.should.be.ok; });
  it('Contains AWS Region', () => { process.env.AWS_REGION.should.be.ok; });
  it('Contains S3 Bucket', () => { process.env.S3_BUCKET.should.be.ok; });
  it('Contains Port', () => { process.env.PORT.should.be.ok; })
});

describe('API Routes', () => {

  describe('GET /api', () => {
    it('Status', async () => { 
      response = await request(app).get('/api');
      response.should.be.ok; 
    });
    it('Body contains welcome message', () => { response.body.should.have.property('message').equal('Welcome to the Easy Store API!'); });
  });

  // Get upload URL from API and upload image
  describe('GET /upload/:objectKey', () => {
    it('Status', async () => { 
      response = await request(app).get(`/api/upload/${objectKey}`);
      response.should.be.ok; 
    });
    it('Returns upload URL', () => { response.body.should.have.property('url') });
    it('URL allows image upload', async () => {
      first_upload_url = response.body.url;
      aws_response = await axios.put(first_upload_url, imageFile);
      aws_response.should.be.ok;
    });
    it('Returns new upload URL on second request', async () => { 
      response = await request(app).get(`/api/upload/${objectKey}`);
      response.should.be.ok;
      second_upload_url = response.body.url;
      first_upload_url.should.not.equal(second_upload_url);
     })
     it('Second upload with same object key is rejected', async () => {
      aws_response = await axios.put(second_upload_url, imageFile);
      aws_response.should.not.be.ok;
     })
  });

  // Get download URL from API and download image
  describe('GET /download/:objectKey', () => {
    it('Status', async () => {
      response = await request(app).get(`/api/download/${objectKey}`);
      response.should.be.ok;
    });
    it('Returns download URL', () => { response.body.should.have.property('url') });
    it('URL allows image download', async () => {
      download_url = response.body.url;
      aws_response = await axios.get(download_url);
      aws_response.should.be.ok;
    });
  });

  // Get delete URL from API and delete image
  describe('GET /delete/:objectKey', () => {
    it('Status', async () => {
      response = await request(app).get(`/api/delete/${objectKey}`);
      response.should.be.ok;
    })
    it('Returns delete URL', () => { response.body.should.have.property('url') });
    it('URL allows image deletion', async () => {
      delete_url = response.body.url;
      aws_response = await axios.delete(delete_url);
      aws_response.should.be.ok;
    });
  });

  describe('GET /bucket_info', () => {
    before(async () => {
      try {
        response = await request(app).get('/api/bucket_info');
      } catch(e) {
        console.error(`API request failed: ${e}`);
      }
    });
    it('Status', () => { response.should.be.ok; })
    it('Region is accurate', () => { response.body.should.have.property('region').equal(process.env.AWS_REGION); });
    it('Bucket name is accurate', () => { response.body.should.have.property('bucket').equal(process.env.S3_BUCKET); });
  })
  
});