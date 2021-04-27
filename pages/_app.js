/* eslint-disable react/prop-types */
import React from "react";

import 'mapbox-gl/dist/mapbox-gl.css';

import "../src/styles/normalize.css";
import "../src/styles/styles.css";
import "../src/styles/welcome.css";
import "../src/styles/translator.css";
import "../src/styles/theme.css";

// TODO: convert these component-level CSS files into modules!
// https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css
import "../src/styles/components/location-card.css";
import "../src/styles/components/map-popup.css";
import "../src/styles/components/form-control.css";
import "../src/styles/components/search.css";
// import "../src/styles/components/covid-banner.css"; // done!
// import "../src/styles/components/hours-banner.css"; // done!
import "../src/styles/typography.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
