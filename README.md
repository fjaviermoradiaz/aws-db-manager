# EKS Lambda Manager

Proyecto para parar instancias RDS y DocumentDB

## Installation

Paso a paso de como usar [Apagado automático RDS y DocumentDB](https://medium.com/@jvimora/apagado-autom%C3%A1tico-rds-y-documentdb-cdb966a620d3)

```bash
npm install -g serverless
```
## Crear el proyecto
Creamos nuestro proyecto en un nuevo directorio ejecutamos el siguiente comando

```bash
sls create -t aws-nodejs-typescript
```
## Test
Ahora ya podéis probar que el proyecto se ha creado correctamente invocando la función hello desde local:

```bash
sls invoke local — function hello
```

## Instalar dependencias aws-sdk
Una vez que comprobamos que el ejemplo funciona, ya podemos empezar a modificar nuestra lambda, o bien podemos crear una nueva. Lo primero que necesitamos es la sdk de aws

```bash
npm i aws-sdk
```
## Deploy
Ahora tenemos todo nuestro código preparado para ralizar la función que queremos, solo queda desplegarlo, y es tan simple como hacer lo siguiente:

```bash
sls deploy
```


## Lambda
```typescript
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
```


## Cron
La lambda podemos ejecutarla manualmente, a través de una llamada a un endpoint de API Gateway o a través de una tarea periódica con CloudWatch Rules.

Para ello vamos al archivo index.ts y vemos que está configurado para llamar a la lambda a través de un endpoint de API Gateway, sustituimos ese código por el siguiente:
```typescript
import { handlerPath } from '@libs/handler-resolver';
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      schedule: 'cron(0 19 ? * MON-FRI *)',
    }
  ],
};
```
