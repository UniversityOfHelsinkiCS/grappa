
export const CONTRACT_SAVE_SUCCESS = 'CONTRACT_SAVE_SUCCESS'
export const CONTRACT_SAVE_FAILURE = 'CONTRACT_SAVE_FAILURE'

export const saveSuccess = function() {
    return {
      type: CONTRACT_SAVE_SUCCESS,
      text: 'Sopimus talletettu onnistuneesti'
    };
}

export const saveFailure = function() {
    return {
        type: CONTRACT_SAVE_FAILURE,
        text: 'Sopimuksen talletus epäonnistui'
    };
}
