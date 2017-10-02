
export const CONTRACT_SAVE_SUCCESS = 'CONTRACT_SAVE_SUCCESS'
export const CONTRACT_SAVE_FAILURE = 'CONTRACT_SAVE_FAILURE'

export function saveSuccess() {
  return {
    type: CONTRACT_SAVE_FAILURE,
    text: 'Sopimus talletettu onnistuneesti'
  };
}

export function saveFailure() {
  return {
    type: CONTRACT_SAVE_FAILURE,
    text: 'Sopimuksen talletus epäonnistui'
  }
}
