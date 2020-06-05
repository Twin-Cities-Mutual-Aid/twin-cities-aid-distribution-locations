const { SNOWPACK_PUBLIC_MAPBOXGL_ACCESS_TOKEN, SNOWPACK_PUBLIC_DATA_URL, SNOWPACK_PUBLIC_TRANSLATION_URL} = import.meta.env

/**
 * Utilize this function to notify developer of required environment variables when developing
 */
function ensure(variable_name, variable){
  if(import.meta.env.MODE === 'development'){
    console.error(`${variable_name} must be defined in your environment. See https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations#environment-labels for details`)
  }
  variable
}

export default {
  dataUrl: ensure("SNOWPACK_PUBLIC_DATA_URL", SNOWPACK_PUBLIC_DATA_URL),
  accessToken: ensure("SNOWPACK_PUBLIC_MAPBOXGL_ACCESS_TOKEN", SNOWPACK_PUBLIC_MAPBOXGL_ACCESS_TOKEN),
  translationUrl: ensure("SNOWPACK_PUBLIC_TRANSLATION_URL", SNOWPACK_PUBLIC_TRANSLATION_URL),
}
