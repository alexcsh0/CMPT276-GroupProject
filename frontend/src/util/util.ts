import { type SelectChangeEvent } from '@mui/material';

/**
 * Url to the main api endpoint
 * @returns string for the api endpoint
 */
export function getApiUrl() {
  return process.env.REACT_APP_API_ENDPOINT ?? 'http://localhost:8080';
}

/**
 * A generic function for calling a set state function from a mui input
 * @param setFn the function to call with the value when changed
 * @returns on change function that sets the state
 */
export function getHandleChange(setFn: (val: string) => void) {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setFn(event.target.value);
  }
}

/**
 * A generic function for calling a set state function from mui checkbox
 * @param setFn the function to call with the value when changed
 * @returns on change function that sets the state
 */
export function getCheckboxChange(setFn: (val: boolean) => void) {
  return (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setFn(checked);
  }
};
