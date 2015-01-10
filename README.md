# co-queue for koa
基于co的列队机制，同时运行n个，FIFO模式

## demo.js

```
var co = require('co');
var sleep = require('co-sleep');

var taskArray = [1,2,3,4,5,6,7,8].map(function(task){
  return function* (){
    yield sleep(task*2000);
    console.log(task+'任务结束');
  };
});

var queue = Queue(3, true);  //第二个参数，debug模式
queue.error = function(err,task){
  console.log("出错啦");
};
setInterval(function(){
  console.log("当前运行任务数：%s, 剩余任务数：%s。", queue.running(), queue.length());
},1000);

co(function* () {
  yield queue.push(taskArray).run();
})();
```

##demo测试结果如下：

```
$ node --harmony demo.js
插值成功，列队长度：8
单个任务开始
单个任务开始
单个任务开始
当前运行任务数：3, 剩余任务数：5。
当前运行任务数：3, 剩余任务数：5。
1任务结束
单个任务结束
单个任务开始
当前运行任务数：3, 剩余任务数：4。
当前运行任务数：3, 剩余任务数：4。
2任务结束
单个任务结束
单个任务开始
当前运行任务数：3, 剩余任务数：3。
当前运行任务数：3, 剩余任务数：3。
3任务结束
单个任务结束
单个任务开始
当前运行任务数：3, 剩余任务数：2。
当前运行任务数：3, 剩余任务数：2。
当前运行任务数：3, 剩余任务数：2。
当前运行任务数：3, 剩余任务数：2。
4任务结束
单个任务结束
单个任务开始
当前运行任务数：3, 剩余任务数：1。
当前运行任务数：3, 剩余任务数：1。
当前运行任务数：3, 剩余任务数：1。
当前运行任务数：3, 剩余任务数：1。
5任务结束
单个任务结束
单个任务开始
当前运行任务数：3, 剩余任务数：0。
当前运行任务数：3, 剩余任务数：0。
当前运行任务数：3, 剩余任务数：0。
6任务结束
当前运行任务数：3, 剩余任务数：0。
单个任务结束
当前运行任务数：2, 剩余任务数：0。
当前运行任务数：2, 剩余任务数：0。
当前运行任务数：2, 剩余任务数：0。
当前运行任务数：2, 剩余任务数：0。
当前运行任务数：2, 剩余任务数：0。
7任务结束
单个任务结束
当前运行任务数：1, 剩余任务数：0。
当前运行任务数：1, 剩余任务数：0。
当前运行任务数：1, 剩余任务数：0。
当前运行任务数：1, 剩余任务数：0。
当前运行任务数：1, 剩余任务数：0。
当前运行任务数：1, 剩余任务数：0。
8任务结束
单个任务结束
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
当前运行任务数：0, 剩余任务数：0。
```
