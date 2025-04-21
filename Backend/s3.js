// s3.js
require("dotenv").config(); // should be first!

console.log("ENV CHECK:");
console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "✅" : "❌");
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME);
console.log("S3_FILE_KEY:", process.env.S3_FILE_KEY);

require("dotenv").config(); // Make sure it's at the top!

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const csv = require("csv-parser");

// Debug log to check env variables
console.log("Loaded Region:", process.env.AWS_REGION); // should log 'us-east-1'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getCSVFile = async () => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: process.env.S3_FILE_KEY,
  });

  try {
    const response = await s3.send(command);
    const results = [];

    return new Promise((resolve, reject) => {
      response.Body.pipe(csv())
        .on("data", (data) => {
          console.log("Parsed row:", data); // 👈 Add this to debug
          results.push({
            salinity: data["Salinity (ppt)"],
            dissolvedOxygen: data["Dissolved Oxygen (mg/L)"],
            pH: data["pH (standard units)"]
          });
        })
        .on("end", () => resolve(results))
        .on("error", reject);
    });

  } catch (err) {
    console.error("Error fetching from S3:", err);
    throw err;
  }
};

module.exports = { getCSVFile };
