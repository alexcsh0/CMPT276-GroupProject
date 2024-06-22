/**
 * Url to the main api endpoint
 * @returns string for the api endpoint
 */
export function getApiUrl() {
  return process.env.REACT_APP_API_ENDPOINT ?? 'http://localhost:8080';
}