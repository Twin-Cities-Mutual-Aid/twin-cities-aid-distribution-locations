//! moment.js locale configuration
//! locale : Dakota [dak]

import moment from 'moment/min/moment-with-locales'

export default moment.defineLocale('dak', {
    relativeTime: {
      future: '%s kiŋháŋ',
      past: '%s hékta',
      s: 'duzáhedaŋ čístidaŋ',
      ss: '%d duzáhedaŋ čístidaŋ',
      m: 'duzáhedaŋ',
      mm: '%d duzáhedaŋ',
      h: 'oáphe',
      hh: '%d oáphe',
      d: 'aŋpétu',
      dd: '%d aŋpétu',
      M: 'wí',
      MM: '%d wí',
      y: 'ómakha',
      yy: '%d ómakha',
    },
});
