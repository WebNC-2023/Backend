const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

module.exports = {
  putFile: async (file) => {
    const fileName = file.name;
    const fileType = file.mimetype;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: fileType,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  createImageByUrl: async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const fileName = `${uuidv4()}.jpg`;

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: response.data,
        ContentType: "jpg",
      };
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      return fileName;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  get: async (id) => {
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: id,
      }),
      { expiresIn: 3600 } // 1 hour
    );

    return url;
  },
};
