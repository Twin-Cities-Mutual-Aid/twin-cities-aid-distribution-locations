import React from "react";
import Head from "next/head";

const SEO = () => {
  const description = "A map to coordinate aid and care in the Twin Cities.";
  const image = "https://twin-cities-mutual-aid.org/images/aid2.png";
  const title = "Twin Cities Aid Distribution Locations";
  const url = "https://twin-cities-mutual-aid.org/";

  return (
    <Head>
      <title>Twin Cities Mutual Aid</title>
      <meta
        name="viewport"
        content="initial-scale=1,maximum-scale=1,user-scalable=no"
      />
      <link rel="icon" href="favicon.ico" />
      <script
        src="https://kit.fontawesome.com/5438b173e4.js"
        crossOrigin="anonymous"
      ></script>
      <link
        href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
        rel="stylesheet"
      />
      <meta property="og:image" content={image} />
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Head>
  );
};

export default SEO;
