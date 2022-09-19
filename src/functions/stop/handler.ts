import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { AWSError, RDS, DocDB } from 'aws-sdk'
import { StopDBClusterMessage, StopDBClusterResult } from 'aws-sdk/clients/docdb';
import { StopDBInstanceMessage, StopDBInstanceResult } from 'aws-sdk/clients/rds';
import { PromiseResult } from 'aws-sdk/lib/request';

import schema from './schema';

const stop: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  console.log("Stopping RDS instance...")
  let rdsMessage:StopDBInstanceMessage = {
    DBInstanceIdentifier: "instance-identifier"
  };
  
  let rdsResponse:PromiseResult<StopDBInstanceResult, AWSError> = await new RDS().stopDBInstance(rdsMessage).promise()
  console.log(rdsResponse);


  let docDBMessage:StopDBClusterMessage = {
    DBClusterIdentifier: "instance-identifier"
  };
  
  console.log("Stopping DocumentDB instance...")
  let docDBResponse:PromiseResult<StopDBClusterResult, AWSError> = await new DocDB().stopDBCluster(docDBMessage).promise()
  console.log(docDBResponse);

  return formatJSONResponse({
    message: `DB instances stoped!`,
    event,
  });
};

export const main = middyfy(stop);
