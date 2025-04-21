const crypto = require("crypto");

const generateID = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

module.exports = generateID;