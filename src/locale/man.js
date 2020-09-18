//! moment.js locale configuration
//! locale : Mandarin [man]

import moment from 'moment/dist/moment'

export default moment.defineLocale('man', {
    relativeTime: {
      future: '%s 5分钟后',
      past: '%s 分钟之前',
      s: '几秒',
      ss: '%d 秒',
      m: '一分钟',
      mm: '%d 分钟',
      h: '一个小时',
      hh: '%d 个小时',
      d: '一天',
      dd: '%d 天',
      M: '一个月',
      MM: '%d 个月',
      y: '一年',
      yy: '%d 年',
    },
});
