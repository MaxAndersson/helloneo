var jwt = require('jsonwebtoken');

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