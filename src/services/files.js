const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "ap-southeast-2",
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
