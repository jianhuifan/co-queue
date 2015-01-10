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

function Queue(worker, concurrency, debug) {
  if(concurrency === undefined) concurrency = 1;
  var q = {
    worknum: 0,
    tasks: [],
    results: [],
    concurrency: concurrency,
    empty: null,
    error: null,
    push: function (data) {
      q._insert(q, data, false);
      debug && console.log("push success, task length: %s",q.tasks.length);
      return this;
    },
    unshift: function (data) {
      q._insert(q, data, true);
      debug && console.log("unshift success, task length: %s",q.tasks.length);
      return this;
    },
    run: function (){
      return function(cb){
        q._checktorun(cb);
      };
    },
    _checktorun: function(cb){
      for(var i = q.worknum; i < concurrency; i++) {
        if (!q.tasks.length) {
          q.empty && q.empty();
          break;
        }
        var task = q.tasks.shift();
        q._exec(task, cb);
      }
    },
    _exec: function (task, cb){
      q.worknum++;
      debug && console.log("one task begin");
      co(function* () {
        return yield worker(task);
      })(function(err,result){
        err && q.error && q.error(err, task);
        q.results.push(result);
        q.worknum--;
        debug && console.log("one task end");
        // 检查是否结束
        if (!q.tasks.length && q.worknum===0) {
          cb();
        }else{
          q._checktorun(cb);
        }
      });
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





