//! moment.js locale configuration
//! locale : Oromo [om]

import moment from 'moment/dist/moment'

export default moment.defineLocale('om', {
    relativeTime: {
      future: '%s Keessa',
      past: '%s Dura',
      s: 'Sekondii',
      ss: '%d Sekondii',
      m: 'Daqiiqaa',
      mm: '%d Daqiiqota',
      h: 'Sa\'aatii',
      hh: '%d Sa\'aatota',
      d: 'Guyyaa',
      dd: '%d Guyyoota',
      M: 'Ji\'oota',
      MM: '%d Ji\'oota',
      y: 'Woggaa',
      yy: '%d Woggoota',
    },
});
