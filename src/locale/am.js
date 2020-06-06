//! moment.js locale configuration
//! locale : Amharic [am]

import moment from 'moment/dist/moment'

export default moment.defineLocale('am', {
    relativeTime: {
      future: '%s ውስጥ',
      past: '%s በፊት',
      s: 'ጥቂት ሰከንዶ',
      ss: '%d ሴኮንድ',
      m: 'አንድ ደቂቃ',
      mm: '%d ድቂቃዎች',
      h: 'አንድ ሰዓት',
      hh: '%d ሰዓታት',
      d: 'አንድ ቀን',
      dd: '%d ቀናት',
      M: 'አንድ ወር',
      MM: '%d ወራት',
      y: 'አንድ ዓመት',
      yy: '%d አመታት',
    },
});
