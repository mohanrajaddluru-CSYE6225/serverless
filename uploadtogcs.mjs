import { Storage } from '@google-cloud/storage';
import fs from 'fs';


const bucketProject = process.env.BUCKETPROJECT;

// Replace these values with your own
const projectId = bucketProject;
const keyFilename = 'csye6225-406103-88c242f2446e.json';

const uploadToGCS = async (bucketName, localFilePath, destinationPath) => {
  const storage = new Storage({ projectId, keyFilename });
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(destinationPath);

  const writeStream = file.createWriteStream({
    metadata: {
      contentType: 'text/plain',
    },
    force: true,
  });

  const readStream = fs.createReadStream(localFilePath);
  readStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
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
};

export default uploadToGCS;
