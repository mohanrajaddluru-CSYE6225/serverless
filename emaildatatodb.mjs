import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const tableName = process.env.DYNAMODBTABLENAME

const dynamoDBRegion = process.env.REGION

const dynamoDbClient = new DynamoDBClient({ region: dynamoDBRegion});

const insertItemToDynamoDB = async (itemData) => {
  const params = {
    TableName: tableName,
    Item: itemData,
  };

  try 
  {
    const command = new PutItemCommand(params);
    await dynamoDbClient.send(command);
    console.log('Item inserted successfully.');
  } 
  catch (error) 
  {
    console.error('Error inserting item:', error);
    throw error;
  }
};

export default insertItemToDynamoDB;
