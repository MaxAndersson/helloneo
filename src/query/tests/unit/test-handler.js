'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert
const AWS = require('aws-sdk')

const lambda = new AWS.Lambda({region: 'eu-central-122'})


describe('Tests handler', function () {
    it('verifies successful response', async () => {
    return lambda.invoke({
            FunctionName: 'neo4jserverless-dev-query',
            Payload: "",
        }, function(err, data) {
            if (err)  assert.fail('expected', 'actual', err);
            else {
                let payload = JSON.parse(data.Payload)
                let body = JSON.parse(payload.body)
                expect(body.num).to.be.an('number')
                expect(body.num).to.be.equal(171)
            }        // successful response
          });
    });
});
