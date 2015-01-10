

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













