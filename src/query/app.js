let response;

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

var neo4j = require('neo4j-driver')
const {NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD} = process.env;
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
const db = driver.session()


exports.lambdaHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const result = await db.run('MATCH(n) RETURN COUNT(n) as num')
        response = {
            'statusCode': 200,
            'body': JSON.stringify({num: result.records[0].get('num').toNumber()})
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

