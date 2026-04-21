// AWSConfig.js
const AWS = require("aws-sdk");
require("dotenv").config();

const awsRegion = process.env.AWS_REGION || "us-east-1";
const s3Endpoint = process.env.AWS_S3_ENDPOINT;
const forcePathStyle =
  process.env.AWS_S3_FORCE_PATH_STYLE === "true" || Boolean(s3Endpoint);

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: awsRegion,
  signatureVersion: "v4",
};

if (s3Endpoint) {
  awsConfig.endpoint = s3Endpoint;
}

AWS.config.update(awsConfig);

const s3 = new AWS.S3({
  endpoint: s3Endpoint || undefined,
  s3ForcePathStyle: forcePathStyle,
  signatureVersion: "v4",
});

module.exports = { s3 };
