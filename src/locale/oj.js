//! moment.js locale configuration
//! locale : Ojibwe [oj]

import moment from 'moment/dist/moment'

export default moment.defineLocale('oj', {
    relativeTime: {
      future: '%s kiŋháŋ',
      past: '%s hékta',
      s: 'Biisi-diba\'igaans',
      ss: '%d Biisi-diba\'igaans',
      m: 'Daso-diba\'agaans',
      mm: '%d Daso-diba\'agaans',
      h: 'Daso-diba\'igan',
      hh: '%d Daso-diba\'igan',
      d: 'Dasogon',
      dd: '%d Dasogon',
      M: 'Daso-giizis',
      MM: '%d Daso-giizis',
      y: 'Daso-gikinoonowin',
      yy: '%d Daso-gikinoonowin',
    },
});
