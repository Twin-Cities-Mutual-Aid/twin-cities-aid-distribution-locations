const { SNOWPACK_PUBLIC_MAPBOXGL_ACCESS_TOKEN, SNOWPACK_PUBLIC_DATA_URL, SNOWPACK_PUBLIC_TRANSLATION_URL, SNOWPACK_PUBLIC_TRACK_JS_TOKEN, SNOWPACK_PUBLIC_AIRTABLE_API_KEY, SNOWPACK_PUBLIC_AIRTABLE_BASE_NAME} = import.meta.env

/**
 * Utilize this function to notify developer of required environment variables when developing
 */
function ensure(variable_name, variable){
  if(!variable && import.meta.env.MODE === 'development'){
    console.error(`${variable_name} must be defined in your environment. See https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations#environment-labels for details`)
  }
  return variable
}

export default {
  dataUrl: ensure("SNOWPACK_PUBLIC_DATA_URL", SNOWPACK_PUBLIC_DATA_URL),
  accessToken: ensure("SNOWPACK_PUBLIC_MAPBOXGL_ACCESS_TOKEN", SNOWPACK_PUBLIC_MAPBOXGL_ACCESS_TOKEN),
  translationUrl: ensure("SNOWPACK_PUBLIC_TRANSLATION_URL", SNOWPACK_PUBLIC_TRANSLATION_URL),
  trackJSToken: ensure("SNOWPACK_PUBLIC_TRACK_JS_TOKEN", SNOWPACK_PUBLIC_TRACK_JS_TOKEN),
  airtableApiKey: ensure("SNOWPACK_PUBLIC_AIRTABLE_API_KEY", SNOWPACK_PUBLIC_AIRTABLE_API_KEY),
  airtableBaseName: ensure("SNOWPACK_PUBLIC_AIRTABLE_BASE_NAME", SNOWPACK_PUBLIC_AIRTABLE_BASE_NAME)
}
