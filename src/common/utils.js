export const Status = {
  /** initial state */
  IDLE: 'idle',
  /** loading state */
  LOADING: 'loading',
  /** success state */
  SUCCESS: 'success',
  /** error state */
  FAILURE: 'failure',
};

export function isApiError(error) {
  return typeof error === 'object' && error !== null && 'errors' in error;
}

export function loadingReducer(state) {
  state.status = Status.LOADING;
}

export function failureReducer(state, action) {
  state.status = Status.FAILURE;
  state.errors = action.payload.errors;
}
