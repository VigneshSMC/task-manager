const { CognitoJwtVerifier } = require('aws-jwt-verify')

const verifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_xABDgI27e",
    tokenUse: "id",
    clientId: "24kbncfjb04asci4r1me4mfki9",
});

module.exports = verifier;