export function getQueryParam(paramName) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(paramName) || '';
}

// sets query param without reloading page
export function setQueryParam(paramName, paramVal) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    paramVal ? urlParams.set(paramName, paramVal) : urlParams.delete(paramName);

    let newQueryString = urlParams.toString();
    if (newQueryString.length) {
        newQueryString = `?${newQueryString}`
    }
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${newQueryString}`;
    if (window.history) {
        // history is supported on most modern browsers
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
}