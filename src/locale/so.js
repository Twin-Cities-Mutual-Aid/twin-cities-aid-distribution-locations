//! moment.js locale configuration
//! locale : Somali [so]

import moment from 'moment/min/moment-with-locales'

export default moment.defineLocale('so', {
    relativeTime: {
      future: '%s Gudaha',
      past: '%s Kahor',
      s: 'dhowr ilbiriqsiyo',
      ss: '%d ilbiriqsiyo',
      m: 'Daqiiqad',
      mm: '%d Daqiiqado',
      h: 'Saacad',
      hh: '%d Saacado',
      d: 'Maalin',
      dd: '%d Maalmo',
      M: 'Bil',
      MM: '%d Bilo',
      y: 'Sanad',
      yy: '%d Sanado',
    },
});
