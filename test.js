let deserialize = require('./src/deserialize');
let serialize = require('./src/serialize');
let prettyHrtime = require('pretty-hrtime');


let hitRect = require('./src/hitRect');
let hitRegion = require('./src/hitRegion');

let start = process.hrtime(), data;
for (let i = 0; i < 10000; i++) {
  data = serialize(

    hitRegion('test3', [
      [0,0],
      [1,1],
      [2,2]
    ]),
    hitRegion('test4', [
      [3,3],
      [4,4],
      [5,5]
    ])
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