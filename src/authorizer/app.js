var jwt = require('jsonwebtoken');
var AWS = require('aws-sdk');
let response;
// AWS.config.update({region: 'eu-central-1'});
// let ssm = new AWS.SSM({});
// let jwtSecret;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
// exports.lambdaHandler = async (event, context) => {
//     try {
//         let token  = event.authorizeationToken.split(' ')[1]
//         let secret = await getParameters()
//             const decodedToken =  jwt.verify(token, secret, function(err, decodedToken) {
//                 if (err) console.log(err, err.stack); // an error occurred
//                 else {
//                     if (decodedToken.database == 'movies'){
//                     context.succeed(generatePolicy('user', 'Allow', event.MethodArn));
//                     }else {
//                         context.fail('Unauthorized')
//                     }
//                 }
                
//             });
      
//     } catch (err) {
//         console.log(err);
//         return err;
//     }

//     return response
// };

exports.token = async (event,context) => {
    try {
            const secret = process.env.JWT_SECRET
            const token = jwt.sign({'database':'movies'}, secret)
            return {
                'statusCode': 200,
                'body': JSON.stringify({access_token:token})
            }

    } catch (err) {
        console.log(err)
    }
}

// const   getParameters =  async() => {
//     if (jwtSecret == undefined){

//         let params = {
//             Name: "JWT_SECRET",
//             WithDecryption: true
//         };
//         try {
//                 jwtSecret =  await ssm.getParameter(params).promise()
//                 return jwtSecret.Parameter.Value
            
//         } catch (error) {
//             console.log(error)
            
//         }
       
            
//     }else {
//       return jwtSecret.Parameter.Value
//     }
   
// }

// var generatePolicy = function(principalId, effect, resource) {
//     var authResponse = {};
    
//     authResponse.principalId = principalId;
//     if (effect && resource) {
//         var policyDocument = {};
//         policyDocument.Version = '2012-10-17'; 
//         policyDocument.Statement = [];
//         var statementOne = {};
//         statementOne.Action = 'execute-api:Invoke'; 
//         statementOne.Effect = effect;
//         statementOne.Resource = resource;
//         policyDocument.Statement[0] = statementOne;
//         authResponse.policyDocument = policyDocument;
//     }
    
//     return authResponse;
// }