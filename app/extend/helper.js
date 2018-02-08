'use strict';
// app/extend/helper.js
const moment = require('moment');
exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();

/**
 * 日期处理 Util
 */
exports.dateHelper = {
  getCurrentMonthFirst(date) {
    date = new Date(date);
    date.setDate(1);
    return this.format(date, 'yyyy-MM-dd');
  },
  getCurrentMonthLast(date) {
    date = new Date(date);
    let currentMonth = date.getMonth();
    const nextMonth = ++currentMonth;
    const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    const oneDay = 1000 * 60 * 60 * 24;
    return this.format(new Date(nextMonthFirstDay - oneDay), 'yyyy-MM-dd');
  },
  getNextMonthFirst(date) {
    date = new Date(date);
    let currentMonth = date.getMonth();
    const nextMonth = ++currentMonth;
    const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    return this.format(new Date(nextMonthFirstDay), 'yyyy-MM-dd');
  },
  // 参考: https://www.cnblogs.com/tugenhua0707/p/3776808.html
  format(datetime, fmt) {
    const o = {
      'M+': datetime.getMonth() + 1, // 月份
      'd+': datetime.getDate(), // 日
      'h+': datetime.getHours(), // 小时
      'm+': datetime.getMinutes(), // 分
      's+': datetime.getSeconds(), // 秒
      'q+': Math.floor((datetime.getMonth() + 3) / 3), // 季度
      S: datetime.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  },
};

