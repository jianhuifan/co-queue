/*!
 * mojing - middlewares/co-queue.js
 * Copyright(c) 2014 ju.taobao.com
 * Author: jianhui.fjh <jianhui.fjh@alibaba-inc.com>
 */

'use strict';

/**
 * Module dependencies.
 */

var co = require('co');

module.exports = Queue;

function Queue(concurrency, debug) {
  if(concurrency === undefined) concurrency = 1;
  var workers = 0;
  var q = {
    tasks: [],
    concurrency: concurrency,
    empty: null,
    error: null,
    push: function (data) {
      q._insert(q, data, false);
      debug && console.log("插值成功，列队长度：%s",q.length());
      return this;
    },
    unshift: function (data) {
      q._insert(q, data, true);
      debug && console.log("插值成功，列队长度：%s",q.length());
      return this;
    },
    run: function(){
      return function(cb){
        process(cb);
      };
      function process(cb) {
        for(var i = workers; i < concurrency; i++) {
          if (!q.tasks.length) {
            q.empty && q.empty();
            break;
          }
          workers++;
          exec(q.tasks.shift());
        }
        function exec(task){
          debug && console.log("单个任务开始");
          co(function* () {
            yield task;
          })(function(err){
            err && q.error && q.error(err, task);
            next();
          });
        }
        function next() {
          debug && console.log("单个任务结束");
          workers--;
          if (q.tasks.length) {
            process(cb);
          }else{
            cb && cb();
          }
        };
      }
    },
    length: function () {
        return q.tasks.length;
    },
    running: function () {
        return workers;
    },
    _insert: function (q, data, pos) {
      if(data.constructor !== Array) data = [data];
      data.forEach(function(task) {
        if (pos) {
          q.tasks.unshift(task);
        } else {
          q.tasks.push(task);
        }
      });
    }
  };
  return q;
};





