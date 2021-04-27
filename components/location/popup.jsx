/* eslint-disable react/prop-types */
import React, { useContext } from "react";

import { LanguageContext } from "@contexts/translator";

///////////
// returns a an array of urls as strings if there is a match otherwise null
// e.g. ['https://google.com']
///////////
function extractUrls(item) {
  // web URL regex source: https://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
  const host_pattern = /(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)/;
  const path_pattern = /(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+/;
  const end_pattern = /(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’])/;
  const web_pattern =
    host_pattern.source + path_pattern.source + end_pattern.source;
  // phone regexp adapted from: https://stackoverflow.com/a/16699507
  const phone_pattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  // email regexp adapted from https://www.regular-expressions.info/email.html
  const email_pattern = /[\w.%+-]+@[\w.]+\.[a-z]{2,}/;
  const url_pattern = new RegExp(
    /\b/.source + // all URLs start after a word boundary
      "(" +
      web_pattern +
      "|" +
      phone_pattern.source +
      "|" +
      email_pattern.source +
      ")",
    "gi" // find all occurrences, case-insensitive
  );

  return item.match(url_pattern);
}

function parseLineBreaks(value) {
  return value.replace(/\n/g, "<br />");
}

const PopupSection = ({ content, id }) => {
  const { getTranslation } = useContext(LanguageContext);

  return (
    <div className="p row">
      <p
        // data-translation-id="${_.snakeCase(id)}"
        className="txt-deemphasize key"
      >
        {getTranslation(id)}
      </p>
      {/** Kanad Note: I had to change this from a p tag to a div tag
       * since it was causing issues when doing a ReactDOMServer render */}
      <div className="value">{content}</div>
    </div>
  );
};

const NeedsMoney = ({ location }) => {
  const { getTranslation } = useContext(LanguageContext);

  let link = "";
  if (location.seekingMoneyURL && location.seekingMoneyURL !== "") {
    link = (
      <a
        data-translation-id="seeking_money_link"
        href="${location.seekingMoneyURL}"
        target="_blank"
        // onclick="captureOutboundLink('${location.seekingMoneyURL}', 'donation')"
      >
        {getTranslation("seeking_money_link")}
      </a>
    );
  }
  return (
    <span className="seekingMoney seeking-money card-badge">
      <span data-translation-id="seeking_money">
        {getTranslation("seeking_money")}
      </span>{" "}
      {link}
    </span>
  );
};

const OpenHours = ({ closingHours, id, openingHours }) => {
  if (openingHours && closingHours) {
    const value = openingHours + " to " + closingHours;
    return <PopupSection content={value} id={id} />;
  } else {
    return <PopupSection content={openingHours} id={id} />;
  }
};

const NoIdNeeded = ({ location }) => {
  const { getTranslation } = useContext(LanguageContext);

  if (location.someInfoRequired === true) {
    return (
      <span
        className="noIdNeeded card-badge"
        // data-translation-id="some_info_required"
      >
        {getTranslation("some_info_required")}
      </span>
    );
  } else {
    return (
      <span
        className="noIdNeeded card-badge"
        // data-translation-id="no_id_needed"
      >
        {getTranslation("no_id_needed")}
      </span>
    );
  }
};

const WarmingSite = () => {
  const { getTranslation } = useContext(LanguageContext);
  return (
    <span
      // Kanad note: this translation ID is wrong!
      // data-translation-id="warming_site"
      className="warmingSite card-badge"
    >
      {getTranslation("warm_up_here")}
    </span>
  );
};

// const Address = ({ address }) => {
//   const googleMapDirections = `https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(
//     address
//   )}`;
//   return (
//     <address>
//       <a
//         href={googleMapDirections}
//         target="_blank"
//         onClick="captureOutboundLink('${googleMapDirections}', 'directions')"
//         rel="noreferrer"
//       >
//         {address}
//       </a>
//     </address>
//   );
// };

const PublicTransit = ({ location }) => {
  const options = location.publicTransitOptions;
  const routes = options.map((option, i) => (
    <React.Fragment key={`${option.routeName}-${i}`}>
      {/** Kanad Note: I had to change all these span tags to div tags
       * since it was causing issues when doing a ReactDOMServer render.
       *
       * I also got rid of the separate div with alt text and
       * just added it as an aria-label below.
       * Source: https://stackoverflow.com/a/38438002 */}
      <div
        aria-label={option.altText}
        className="transit-route-option"
        role="text"
      >
        <i className="material-icons-round route-icon">{option.icon}</i>
        <h5
          className="transit-route route-text"
          style={{ backgroundColor: option.backgroundColor }}
        >
          {option.routeName}
        </h5>
        <h5 className="route-text">{option.distance}</h5>
      </div>
    </React.Fragment>
  ));
  return <PopupSection content={routes} id="public_transit" />;
};

// builds the section within the popup and replaces and URLs with links
const SectionUrl = ({ id, value }) => {
  const { getTranslation } = useContext(LanguageContext);
  let urls = extractUrls(value);
  let parsedText = parseLineBreaks(value);

  if (urls) {
    const distinctUrls = [...new Set(urls)];
    distinctUrls.forEach((url) => {
      let target_url = url;
      if (!/[a-z]/i.test(url))
        target_url = "tel:" + url.replace(/[^\d()-.]/g, "");
      else if (/[\w.%+-]@[\w.]+/.test(url)) target_url = "mailto:" + url;
      else if (!/http/i.test(url)) target_url = "http://" + url;

      parsedText = parsedText.replace(
        new RegExp(url, "g"),
        // I removed on onClick handler here because nah
        `<a href="${target_url}" target="_blank">${url}</a>`
      );
    });
  }

  return (
    <div className="p row">
      <p data-translation-id={id} className="txt-deemphasize key">
        {getTranslation(id)}
      </p>
      <p
        className="value"
        dangerouslySetInnerHTML={{
          __html: parsedText,
        }}
      />
    </div>
  );
};

const Popup = ({ getTranslation, language, location }) => (
  <LanguageContext.Provider value={{ getTranslation, language }}>
    {Object.keys(location).map((locationProperty, i) => {
      switch (locationProperty) {
        case "name":
          return <h2 key={i}>{location.name}</h2>;
        case "neighborhood":
          return (
            <h3 key={i} className="h3">
              {location.neighborhood}
            </h3>
          );
        case "address":
          return (
            <address key={i}>
              <a
                href={`https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(
                  location.address
                )}`}
                target="_blank"
                // onClick="captureOutboundLink('${googleMapDirections}', 'directions')"
                rel="noreferrer"
              >
                {location.address}
              </a>
            </address>
          );
        case "openingForDistributingDonations":
          return (
            <OpenHours
              key={i}
              closingHours={location.closingForDistributingDonations}
              id="aid_distribution_hours"
              openingHours={location.openingForDistributingDonations}
            />
          );
        case "openingForReceivingDonations":
          return (
            <OpenHours
              key={i}
              closingHours={location.closingForReceivingDonations}
              id="aid_receiving_hours"
              openingHours={location.openingForReceivingDonations}
            />
          );
        case "seekingMoney":
          return <NeedsMoney key={i} location={location} />;
        case "noIdNeeded":
          return <NoIdNeeded key={i} location={location} />;
        case "warmingSite":
          return <WarmingSite key={i} location={location} />;
        case "publicTransitOptions":
          return <PublicTransit key={i} location={location} />;
        case "accepting":
          return (
            <SectionUrl key={i} id="accepting" value={location.accepting} />
          );
        case "notAccepting":
          return (
            <SectionUrl
              key={i}
              id="not_accepting"
              value={location.notAccepting}
            />
          );
        case "seekingVolunteers":
          return (
            <SectionUrl
              key={i}
              id="seeking_volunteers_badge"
              value={location.seekingVolunteers}
            />
          );
        case "mostRecentlyUpdatedAt":
          return (
            <div
              key={i}
              className="updated-at"
              title={location.mostRecentlyUpdatedAt}
            >
              <span data-translation-id="last_updated">Last updated</span>{" "}
              <span data-translate-font>
                {/* TODO: format this! */}
                {/* ${moment(location.mostRecentlyUpdatedAt, "YYYY-MM-DDTHH:mm:ss.SSSZ").fromNow()} */}
                {"A million years ago FIX THIS"}
              </span>
            </div>
          );
        case "urgentNeed":
          return (
            <SectionUrl key={i} id="urgent_need" value={location.urgentNeed} />
          );
        case "notes":
          return <SectionUrl key={i} id="notes" value={location.notes} />;
        default:
          return null;
      }
    })}
  </LanguageContext.Provider>
);
export default Popup;
