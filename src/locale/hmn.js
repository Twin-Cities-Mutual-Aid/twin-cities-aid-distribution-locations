//! moment.js locale configuration
//! locale : Hmong [hmn]

import moment from 'moment/dist/moment'

export default moment.defineLocale('hmn', {
    relativeTime: {
      future: 'tshuav %s',
      past: 'dhlau %s',
      s: 'dhlau ob peb chib',
      ss: '%d chib',
      m: '1 feeb',
      mm: '%d feeb',
      h: '1 teev',
      hh: '%d teev',
      d: '1 nub',
      dd: '%d nub',
      M: '1 hli',
      MM: '%d hli',
      y: '1 xyoo',
      yy: '%d xyoo',
    },
});
