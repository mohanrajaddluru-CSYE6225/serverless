import { Storage } from '@google-cloud/storage';
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();


const projectId = process.env.PROJECTID;

const encodedKey = process.env.PRIVATEKEY;

const decodedPrivateKey = Buffer.from(encodedKey, 'base64').toString('utf-8');
const gcpAccessKey = JSON.parse(decodedPrivateKey);


const uploadToGCS = async (bucketName, localFilePath, destinationPath) => {
  try
  {
    const storage = new Storage({ projectId, credentials : gcpAccessKey});
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(destinationPath);

    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'application/octet-stream',
      },
      force: true,
    });

    console.log("gcp credentials authenticated successfully");

    const readStream = fs.createReadStream(localFilePath);
    readStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('error', (err) => {
        console.error(`Error uploading file: ${err}`);
        reject(err);
      });

      writeStream.on('finish', () => {
        console.log(`File uploaded successfully to ${bucketName}/${destinationPath}`);
        resolve();
      });

      readStream.on('error', (err) => {
        console.error(`Error reading file: ${err}`);
        reject(err);
      });
    });
    return 1;
  }
  catch(error)
  {
    console.log("Upload to GCS failed with error", error.message);
    return 0;
  }
};


// await uploadToGCS('mygcpbucketfromcode1212128', '/tmp/4f35d02b-aed2-4a3f-a08a-1ca1a8c3dde9.zip', 'thisistest332141');


export default uploadToGCS;
