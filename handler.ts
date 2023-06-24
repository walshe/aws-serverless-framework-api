"use strict";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { APIGatewayEvent, Context, APIGatewayProxyCallback } from "aws-lambda";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(client);

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => ({
  statusCode,
  body: JSON.stringify(data),
});

export const createNote = async (
  event: APIGatewayEvent,
  context: Context,
  cb: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const data = JSON.parse(event.body as string);

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id as string,
        title: data.title as string,
        body: data.body as string,
      },
      ConditionExpression: "attribute_not_exists(notesId)",
    };

    await documentClient.send(new PutCommand(params));

    cb(null, {
      statusCode: 201,
      body: JSON.stringify(data),
    });
  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message),
    });
  }
};

export const updateNote = async (
  event: APIGatewayEvent,
  context: Context,
  cb: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters?.id as string;
  let data = JSON.parse(event.body as string);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      UpdateExpression: "set #title = :title, #body = :body",
      ExpressionAttributeNames: {
        "#title": "title",
        "#body": "body",
      },
      ExpressionAttributeValues: {
        ":title": data.title,
        ":body": data.body,
      },
      ConditionExpression: "attribute_exists(notesId)",
    };

    await documentClient.send(new UpdateCommand(params));

    cb(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message),
    });
  }
};

export const deleteNote = async (
  event: APIGatewayEvent,
  context: Context,
  cb: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters?.id as string;

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      ConditionExpression: "attribute_exists(notesId)",
    };

    await documentClient.send(new DeleteCommand(params));
    console.log("note deleted");
    const message = `Note ${notesId} has been deleted!`;
    console.log(message);
    console.log('about to call the callabck')
    
    cb(null, {
      statusCode: 200,
      body: message,
    });
    console.log('should not see this')

  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message),
    });
  }
};

export const getAllNotes = async (
  event: APIGatewayEvent,
  context: Context,
  cb: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
    };

    const notes = await documentClient.send(new ScanCommand(params));

    cb(null, {
      statusCode: 200,
      body: JSON.stringify(notes),
    });
  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message),
    });
  }
};
