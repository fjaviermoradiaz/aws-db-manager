import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { AWSError, DocDB, RDS } from 'aws-sdk'
import { StopDBClusterMessage, StopDBClusterResult } from 'aws-sdk/clients/docdb';
import { StopDBInstanceMessage } from 'aws-sdk/clients/rds';
import { PromiseResult } from 'aws-sdk/lib/request';

import schema from './schema';

const start: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  console.log("Starting RDS instance...")
  let message:StopDBInstanceMessage = {
    DBInstanceIdentifier: "instance-identifier"
  };
  
  let response:PromiseResult<RDS.Types.StopDBInstanceResult, AWSError> = await new RDS().startDBInstance(message).promise()
  console.log(response);

  let docDBMessage:StopDBClusterMessage = {
    DBClusterIdentifier: "cluster-identifier"
  };
  
  console.log("Stopping DocumentDB instance...")
  let docDBResponse:PromiseResult<StopDBClusterResult, AWSError> = await new DocDB().startDBCluster(docDBMessage).promise()
  console.log(docDBResponse);

  return formatJSONResponse({
    message: `DB instances started!`,
    event,
  });
};

export const main = middyfy(start);
