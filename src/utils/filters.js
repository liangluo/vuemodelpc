import { String } from 'core-js';

function formatTime(time, fmt) {
  fmt = fmt || 'yyyy-MM-dd'
  if (!time) return '';
  const Year = time.slice(0, 4);
  const Month = time.slice(4, 6);
  const Day = time.slice(6, 8);
  const hour = time.slice(8, 10);
  const fen = time.slice(10, 12);
  const seconds = time.slice(13, 14);

  var o = {
    'M+': Month, // 月份
    'd+': Day, // 日
    'h+': hour, // 小时
    'm+': fen, // 分
    's+': seconds
  };
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (Year + '').substr(4 - RegExp.$1.length)); }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
}
export {
  formatTime
}
