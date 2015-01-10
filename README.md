# co-queue for koa
Lined up mechanism based on co, run multiple at the same time, FIFO mode


## API

## demo.js

```
var co = require('co');
var sleep = require('co-sleep');
var Queue = require('../index');

var taskArray = [1,2,3,4,5];

var queue = Queue(function *(task){
  yield sleep(task*1000);
  console.log('task[%s] begin',task);
  return task;
}, 3, true);

queue.error = function(err, task){
  console.log('task[%s] error: %j', task, err);
};

queue.empty = function(){
  console.log('queue empty!');
};

setInterval(function(){
  console.log("running task number: %s, tasks length: %s。", queue.worknum, queue.tasks.length);
},1000);

co(function* () {
  yield queue.push(taskArray).run();
  console.log("results：%s", queue.results);
})();

```

##demo stdout：

```
$ node --harmony test/demo.js
push success, task length: 5
one task begin
one task begin
one task begin
running task number: 3, tasks length: 2。
task[1] begin
one task end
one task begin
running task number: 3, tasks length: 1。
task[2] begin
one task end
one task begin
running task number: 3, tasks length: 0。
task[3] begin
one task end
queue empty!
running task number: 2, tasks length: 0。
running task number: 2, tasks length: 0。
task[4] begin
one task end
queue empty!
running task number: 1, tasks length: 0。
running task number: 1, tasks length: 0。
task[5] begin
one task end
results：1,2,3,4,5
running task number: 0, tasks length: 0。
running task number: 0, tasks length: 0
```
