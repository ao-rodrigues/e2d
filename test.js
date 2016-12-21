let deserialize = require('./src/deserialize');
let serialize = require('./src/serialize');
let prettyHrtime = require('pretty-hrtime');

let textStyle = require('./src/textStyle');
let fillText = require('./src/fillText');

//  font: null,
//  textAlign: null,
//  textBaseline: null,
//  direction: null
let start = process.hrtime(), data;
let tree = [
  textStyle({ font: '12px monospace' }, fillText("Hello World!")),
  textStyle({ textAlign: 'left' }, fillText("Hello World!")),
  textStyle({ textAlign: 'right' }, fillText("Hello World!")),
  textStyle({ textAlign: 'center' }, fillText("Hello World!")),
  textStyle({ textAlign: 'start' }, fillText("Hello World!")),
  textStyle({ textAlign: 'end' }, fillText("Hello World!")),
];

for (let i = 0; i < 10000; i++) {
  data = serialize(
    tree
  );
}
let end = process.hrtime(start);
let stime = prettyHrtime(end, {precise:true});
setTimeout(() => console.log('data is', data));

setTimeout(() => console.log(`serialization 10000x took ${stime}`));

let result;
start = process.hrtime();
for(let i = 0; i < 10000; i++) {
 result = deserialize(data);
}
end = process.hrtime(start);
let dtime = prettyHrtime(end, {precise:true});
setTimeout(() => console.log('result is', result));
setTimeout(() => console.log(`deserialization 10000x took ${dtime}`));