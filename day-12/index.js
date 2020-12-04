const { readFileSync } = require('fs');
const { resolve } = require('path');

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
