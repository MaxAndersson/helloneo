# Neo4J AWS Serverless Cypther Query with Lambda/JWT Authorizer
<center>

![matrix](https://routerjockey.com/wp-content/uploads/2017/02/Matrix-code-gif.gif)

</center>

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
![image](https://docs.aws.amazon.com/apigateway/latest/developerguide/images/custom-auth-workflow.png) 
- from aws [docs](https://docs.aws.amazon.com/apigateway/latest/devloperguide)

The solution is made to be as minimal as possible to comply with the best pactices for serverless functions as good as possible.  Less dependencies means shorter coldstart, smaller attack surface and simplified structure. Running though the solution I will talk about alternatives, descitions and considerations with running this type of solution.

## Authorizer/Security
First out is the JWT/Authorizer module, that only implements a way to sign a unique token to give access to the query function deployed in a sepereate package. The simplest way of implementing JWT is to sign a payload with a HMAC + SHA256 algorithm also known as HS256, which uses semmetric encryption to esstablish the source of the payload, while gives us a good way to make sure that we can trust the claims make with our secret-key. Although the drawback is when we emplore distributed multi-tenancy and we might not know our trusted sources and claims at beforehand and might need to be able to verify signatures though authentication flows such as OAuth or other federated solutions via an IDP. Then we can use RS256 instead that uses public/private-key assymmetirc encryption to veryfy the payload. 

In this solution we a simple key-value pair (database, movies) signed with HMAC, will be enough. But if we wanted to extrend this we could provision a solution such as aws Cognito, Google Identity, Okta, Auth0 or Keycloak to manage our users, tentants and claims etc. 

The lambda solution in the aws could uses mainly works with two premissions such as which IAM user that can invoke the function and what it is allowed to execute itself.  In a security conscious evnironment we would follow the principal of least privilage and develop roles, policies and groups that minimized the attack surface and only gives the execution environment the premissions it need to get its job done.

Another consideration while implementing this type of function is the tradeoffs we need to consider when it comes to handling sensitive configuration parameters such as passwords and secrets etc. 

For the purposes of this solution we have choosen to expose the variables with the enviromental variables, that can easierly be accessed by and proccess in the execution evironment. Using unencrypted variables like this is not adviced in high seurity contexts, but for our purposes it's fine. The risk being that debugging frameworks or a developer might accedently flush the environmental variables into the logs or as part of a stack trace.
The better alternative for security is to gather and decrypt the variables in runtime, but that instead gives us an extended bootup time and lambda functions coldstart periods will be longer. 


## Best Practices
* Best Practices Functions
  - [x] Take advantage of execution context reuse to improve the performance of your function.
  - [x] Use a keep-alive directive to maintain persistent connections, [Reuse]( https://docs.amazonaws.cn/en_us/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html )
  - [x] Use environment variables to pass operational parameters to your function.
  - [x] Control the dependencies in your function's deployment package.
  - [x] Minimize your deployment package size to its runtime necessities.
  - [x] Reduce the time it takes Lambda to unpack deployment packages
  - [x] Minimize the complexity of your dependencies.
  - [x] Avoid using recursive code

* Best Practices Configuration
  - [x] Performance testing your Lambda function
  - [ ] Load test your Lambda function
  - [ ] Use most-restrictive permissions when setting IAM policies.
  - [ ] Be familiar with AWS Lambda quotas
  - [ ] Delete Lambda functions that you are no longer using.

Best practices helps us keep a consistent and secure environment for our function executions, and while this solution subscribes to all of these practices, some are out of scope for this assignment. But to improve upon you would make use all of these best practices are fullfilled. 

## Design Decisions
### Choice of framework
While there are a few frameworks out there to implement lambda functions, such as SAM, Pulumi, Cloud Formation or simply deploying via the web interface. We need to consider a set of parameters. We will look at reusability, portability, versioning, idempotency, cost and maintainability.

- Reusability
  - To be able to redeploy our function and maybe leverage is in another project environment, we want our infrastruction definition to be declarativly defined in something like infrastructure as code, to be able to manage it and reproduce the results we deploy to our environment. This rules out just implementing our solution directly in our aws lambda web interface, because it relinquishes our control over our infrastructure and makes it mutable, which if a problem arises might be hard to find the root cause.
- Portability
  - Frameworks such as SAM in contrast to Pulumi or Serverless are who maintains them and what how we agnostic we want our infrastructure to be. Using SAM for example might give you a native integration that will adapt with how the lambda offerings will develop in the future, but at the same time it is offered & maintained by AWS. This means it will likely not cater towards deploying it at another cloud provider if it by any reason would be relevant. On the other hand framework like Pulumi and Serverless are more agnostic and does not exhibit same vendor-lockin effect (other then to their product)

- Versioning, Idempotency & Maintanability
  - Immutable infrastructure helps us maintain and redistribute our software in an organized manner, and by using version control in combination with infrastructure as code, we can create an package our solution in a manner that helps with root cause analysis, workflow management and continues intregration/Deployment or delivery. Another factor is developer knowleadge domain, how many in our team has experience working with it, is it easy to pick up, and is it compatible with other infrastructure as code that we are currently using.   

- Cost
  - By not using a native framework we might incurr costs in the choice of our framework, and choosing a native option such as Cloud Formation might reduce operational costs, while a less verbose framework such as serverless might reduce developer costs. 

#### Motivation 
Considering all above factors I've choosen to work with serverless for this solution due to it's portability to multiple cloud providers, and it's less verbose structure then native Cloud Formation. You get alot of the required resources by default, such as api gateways as soon as your specify an functions event, related roles and policies are also made by default along with other resources that you might have to specify explicitly for a solution like this. Another factor is maturity. Serverless has been around for a long while and has a mature framework to work with these type of solutions. Another factor is also familiarity, since serverless is what i've used before it makes sense to implement the solution in a well known domain.

## Possible improvements
- Secret management
- Granular Policies
- Price Optimizeation with load testing for diffrent memory allocations
- Deouple database interaction from function handler, and implement bussiness logic in seperate modules.
- Implement controller, models etc.. for seperation of concerns.
- Use an IDP instead of signed JWT tokens.
- Integrate a pipeline with CodeDeploy, Jenkins, Github CI or such to manage function deployments.
- Configure api gateway with user friendly responses
- Static linting, security scanning, etc. 
- Define OpenApi spec.
- Rate limiting, use a logger framework etc..