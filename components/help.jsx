import React, { useContext } from "react";

import { LanguageContext } from "@contexts/translator";

// eslint-disable-next-line react/prop-types
const Help = ({ close }) => {
  const { getTranslation } = useContext(LanguageContext);

  return (
    <div id="help-info" className="help-info padded spaced-lines">
      <button
        id="help-info-close-button"
        className="help-info-close-button"
        aria-label="Close help info section"
        onClick={close}
      >
        X{" "}
        <span
        // data-translation-id="close"
        >
          {getTranslation("close")}
        </span>
      </button>
      <p className="p txt-small">
        <span
          // data-translation-id="project_description"
          // I don't love this but alas
          dangerouslySetInnerHTML={{
            __html: getTranslation("project_description"),
          }}
        />
        .
      </p>
      <br />
      <p className="p txt-small bold">
        <span
        // data-translation-id="project_feedback"
        >
          {getTranslation("project_feedback")}
        </span>{" "}
        <a
          href="mailto:support@tcmap.org"
          // data-translation-id="project_contact"
        >
          {getTranslation("project_contact")}
        </a>
        .
      </p>
      <p className="p txt-small bold">
        <span
        // data-translation-id="project_data"
        >
          {getTranslation("project_data")}
        </span>{" "}
        <a
          href="https://airtable.com/shr2el3WSJHLNgQUx/tblGDXjVZuA2GejcN"
          target="_blank"
          // onClick="captureOutboundLink('https://airtable.com/shr2el3WSJHLNgQUx/tblGDXjVZuA2GejcN', 'airtable')"
          rel="noreferrer"
        >
          Airtable
        </a>
        .
      </p>
      <p className="p txt-small bold">
        <span
        // data-translation-id="project_learn"
        >
          {getTranslation("project_learn")}
        </span>{" "}
        <a
          href="https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/blob/master/README.md"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </p>
      <p className="p txt-extra-small italic">
        <span
        // TODO: no translation lol
        // data-translation-id="disclaimer"
        >
          TCMAP aggregates, compiles, and logs information on our maps solely
          through the work of volunteers. We cannot guarantee the complete
          accuracy of this information, including usernames or accounts provided
          for direct donations. Your use of this website is completely
          voluntary, and you assume any and all risks and liabilities, financial
          or otherwise, with providing goods, services, or funds to any
          distribution site listed on our map. TCMAP does not assume any
          responsibility for your use of this website and has no obligation to
          provide users with financial or other assistance.
        </span>
      </p>
    </div>
  );
};

export default Help;
