// import { SharedIniFileCredentials } from '@aws-sdk/credential-provider-ini';
import { DynamoDBClient, PutItemCommand, ListTablesCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';

import { fromIni } from '@aws-sdk/credential-provider-ini';


const credentials = fromIni({ profile: 'mohan-dev-iam' });
const config = { region: 'us-east-1', credentials };
const dynamoDbClient = new DynamoDBClient(config);


// const awsProfile = 'mohan-demo-iam';
const region = 'us-east-1';
const tableName = 'testtable';

// const credentials = fromIni({ profile: awsProfile });

// import { SharedIniFileCredentials } from 'aws-sdk';

// const credentials = new SharedIniFileCredentials({ profile: awsProfile });



import pkg from '@aws-sdk/credential-provider-ini';
// const { SharedIniFileCredentials } = pkg;

// Rest of your code...


// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();



// Set up AWS SDK credentials
// const credentials = new SharedIniFileCredentials({ profile: awsProfile });
AWS.config.credentials = credentials;
AWS.config.update({ region });

// Create DynamoDB client
// const dynamoDbClient = new DynamoDBClient({ region });


// const createTable = async () => {
//     const params = {
//       AttributeDefinitions: [
//         { AttributeName: 'emailid', AttributeType: 'S' },
//         // Add more attribute definitions as needed
//       ],
//       KeySchema: [
//         { AttributeName: 'emailid', KeyType: 'HASH' },
//         // Add more key schema elements as needed
//       ],
//       ProvisionedThroughput: {
//         ReadCapacityUnits: 5,
//         WriteCapacityUnits: 5,
//       },
//       TableName: tableName,
//     };
  
//     try {
//       const command = new CreateTableCommand(params);
//       await dynamoDbClient.send(command);
//       console.log('Table created successfully.');
//     } catch (error) {
//       console.error('Error creating table:', error);
//       throw error;
//     }
//   };
  
  // Call the createTable function
// await createTable();


// Function to insert an item into the DynamoDB table
const insertItem = async (item) => {
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

const userEmail = 'email.com';

const messageID = 'this is messageID';

// Example item to insert

const itemData = {
    emailid: { S: userEmail },
    assignment: { S: messageID },
};

const item = itemData;



// Call the insertItem function
await insertItem(itemData);

// Function to list DynamoDB tables
// const listTables = async () => {
//   const command = new ListTablesCommand({});
//   try {
//     const result = await dynamoDbClient.send(command);
//     console.log('Available tables:', result.TableNames);
//   } catch (error) {
//     console.error('Error listing tables:', error);
//   }
// };

// Call the listTables function
// await listTables();

export default insertItem;
