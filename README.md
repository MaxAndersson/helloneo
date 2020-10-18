# Neo4J AWS Serverless Cypther Query with Lambda/JWT Authorizer

## Functional requirements: 
 - [x] Use neo4j-driver to execute given query
 - [x] Configure function environment with secured parameters from SSM Parameter Store
 - [x] Expose Lambda with and AWS Api Gateway
 - [x] The endpoint should be secured using JSON Web Token (JWT) and require the request to include a valid JWT included in the authorization header.
 - [x] Include logging, monitoring and alerts (automatically provided with framework in cloudwatch & serverless dashboard)
 - [x] Include at least one test for endpoint
 - [x] Motivate choice of approach.


## Getting Started
A quick introduction the benefits and drawbacks of serverless technologies. [Serverless](../master/Serverless.pdf)
### Prerequisites
- Have aws-cli installed & configured [Instruction](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- Have serverless installed and configures, [Instruction](https://www.serverless.com/framework/docs/getting-started/)

### Configure
<pre> $ serverless </pre>
### Deploy 
<pre>$ serverless deploy</pre>

# Solution
![image](https://docs.aws.amazon.com/apigateway/latest/developerguide/images/custom-auth-workflow.png) - from aws [docs](https://docs.aws.amazon.com/apigateway/latest/devloperguide)

The requirements dictates the use of HMAC + SHA256 commonly refered to as HS256 which is an symmetric type of encryption instead of the commonly used RS256 which is assymmetric. 
