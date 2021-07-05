import React, { useContext, useEffect } from "react";

import Main from "@components/main";

import TranslatorContext from "@contexts/translator";
import LocationsProvider from "@contexts/locations";
import { LanguageContext } from "@contexts/translator";
import { LocationsContext } from "@contexts/locations";


const statusClosed = {
  id: 3,
  name: "closed",
  label: "not open now",
  accessibleColor: "#d7191c",
  count: 0,
};

const statusOptions = [
  {
    id: 0,
    name: "receiving",
    label: "open for receiving donations",
    accessibleColor: "#2c7bb6",
    count: 0,
  },
  {
    id: 1,
    name: "distributing",
    label: "open for distributing donations",
    accessibleColor: "#abd9e9",
    count: 0,
  },
  {
    id: 2,
    name: "both",
    label: "open for both",
    accessibleColor: "#fdae61",
    count: 0,
  },
  statusClosed,
];

function getStatus(item) {
  let name = "";
  if (item.currentlyOpenForDistributing === "yes") {
    if (item.currentlyOpenForReceiving === "yes") {
      name = "both";
    } else {
      name = "distributing";
    }
  } else if (item.currentlyOpenForReceiving === "yes") {
    name = "receiving";
  }
  const status = statusOptions.find((s) => s.name === name);
  return status || statusClosed;
}

// eslint-disable-next-line react/prop-types
const HomePage = ({ initialLocations }) => {
  const { getTranslation, language, setWelcome } = useContext(LanguageContext);
  const { setLocations, filteredLocations, setFilteredLocations } = useContext(LocationsContext);

  useEffect(() => {
    setFilteredLocations(initialLocations)
    setLocations(initialLocations)
  }, []);


  return (
      // <TranslatorContext>
        <Main initialLocations={filteredLocations} />
      // </TranslatorContext>
  );
};

export async function getStaticProps() {
  // TODO: do something with the locale passed into this context?
  const res = await fetch(
    `https://tcmap-api.herokuapp.com/v1/mutual_aid_sites`
  );
  const data = await res.json();

  // TODO: add some error handling for if API request fails
  // if (!data) {
  //   return {
  //     notFound: true,
  //   };
  // }

  const locationList = [];

  data.forEach((item) => {
    const location = Object.keys(item)
      .filter((key) => item[key] !== "")
      .reduce((newObj, key) => {
        newObj[key] = item[key];
        return newObj;
      }, {});

    location.status = getStatus(item);

    locationList.push(location);
  });

  return {
    props: { initialLocations: locationList, },
    // Revalidate every 60 seconds!
    // This might be a good opportunity to axe the backend entirely!
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
    revalidate: 60,
  };
}

export default HomePage;
