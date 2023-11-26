import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { fromIni, fromCognitoIdentityPool, fromTokenFile } from '@aws-sdk/credential-provider-ini';
import { AssumeRoleCommand, StsClient } from '@aws-sdk/client-sts';

const stsClient = new StsClient();
const roleToAssumeArn = 'arn:aws:iam::387983162026:role/DynamoDBAccess'; // Replace with the ARN of the role you want to assume

// Assume the IAM role
const assumedRole = await stsClient.send(new AssumeRoleCommand({
  RoleArn: roleToAssumeArn,
  RoleSessionName: 'AssumedRoleSession', // Provide a session name
}));

// Use the assumed role credentials
const credentials = fromTokenFile({
  accessKeyId: assumedRole.Credentials.AccessKeyId,
  secretAccessKey: assumedRole.Credentials.SecretAccessKey,
  sessionToken: assumedRole.Credentials.SessionToken,
});

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1', credentials });

// Function to insert an item into the DynamoDB table
const insertItem = async (item) => {
  const tableName = 'testtable';
  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDbClient.send(command);
    console.log('Item inserted successfully.');
  } catch (error) {
    console.error('Error inserting item:', error);
    throw error;
  }
};

const userEmail = 'email.comafvfad';
const messageID = 'this is messageIDadfvadfvda';

// Example item to insert
const itemData = {
  emailid: { S: userEmail },
  assignment: { S: messageID },
};

const item = itemData;

// Call the insertItem function
await insertItem(itemData);

export default insertItem;
