//! moment.js locale configuration
//! locale : Karen [kar]

import moment from 'moment/dist/moment'

export default moment.defineLocale('so', {
    relativeTime: {
      future: '%s vXtylR',
      past: '%s ylRuGHm',
      s: 'vXtpJ;uD;wD>ylR',
      ss: '%d pJ;uD;',
      m: 'wrH;eH;',
      mm: '%d rH;eH;wz.(tgM>wrH;eH;)',
      h: 'we.&H.',
      hh: '%d e.&H.wz.(tgM>we.&H.)',
      d: 'weHR',
      dd: '%d eHRwz.(tgM>weHR)',
      M: 'wrH;eH;',
      MM: '%d vgwz.',
      y: 'eH.',
      yy: '%d eH.wz.(tgM>weH.)',
    },
});
