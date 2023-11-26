// import simpleGit from 'simple-git';

import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import {Storage} from '@google-cloud/storage';
// import { exec } from 'child_process';
import uploadtogcs from './uploadtogcs.mjs';
import sendAssignmentSubmissionStatus from './awssnsemail.mjs';

const bucketName = process.env.BUCKETNAME;

console.log(bucketName);

const storage = new Storage();
// const sorageBucketName = storage.bucket(bucketName);



const downloadRepo = async (repoUrl, destination) => {
  try {
    const zipUrl = repoUrl;
    // console.log("i am the url here",repoUrl )
    const response = await axios.get(zipUrl, { responseType: 'arraybuffer' });

    const __filename = new URL(import.meta.url).pathname;
    const __dirname = path.dirname(__filename);

    const zipFilePath = path.join('/tmp', `${destination}.zip`);
    fs.writeFileSync(zipFilePath, Buffer.from(response.data));

    console.log('Repository cloned and zipped successfully.');
  } catch (error) {
    console.error('Error downloading repository:');
    throw error;
  }
};



export const handler = async (event) => 
{
  try 
  {
    console.log("This is inside the event");
    console.log(await event);
    const Records = await event.Records[0];
    const Sns = await Records.Sns;
    const Message = await Sns.Message;
    const MessageAttributes = await Sns.MessageAttributes;
    
    console.log(MessageAttributes)
    
    const submissionURL = await MessageAttributes.submission_url.Value
    const submittedUserEmail = await MessageAttributes.user_email.Value
    const submittedassignmentID = await MessageAttributes.assignmentID.Value
    const submissionID = await MessageAttributes.submissionID.Value
    const assignmentName = await MessageAttributes.assignmentName.Value
    
    console.log(await submissionURL,"this is url",await submittedUserEmail, "This is email", await submittedassignmentID, await submissionID);

    await downloadRepo(submissionURL, submittedassignmentID);

    console.log(bucketName, "This is bucket name")

    const submittedBucketName = `${submittedassignmentID}-${submittedUserEmail}`;

    await uploadtogcs(bucketName,`/tmp/${submittedassignmentID}.zip`, submittedBucketName);

    console.log("Here message passed to gcs");

    await sendAssignmentSubmissionStatus(submittedUserEmail, assignmentName);

    console.log("here is the email sent");
  } 
  catch (error) 
  {
    console.error('Error:', error.message);
    return {statusCode: 500,body: 'Error processing SNS message.'};
  }
};