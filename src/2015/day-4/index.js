const md5 = require('md5');
const [input] = require('./input.json');

// Part 1
let num = 0;
while (!md5(input + (num += 1)).startsWith('00000')) {}
console.log('Part 1:', num);

// Part 2
num = 0;
while (!md5(input + (num += 1)).startsWith('000000')) {}
console.log('Part 2:', num);
