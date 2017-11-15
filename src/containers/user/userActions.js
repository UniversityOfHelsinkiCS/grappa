const action = (suffix, response) => {
    return {
        type: "USER_" + suffix,
        response,
    }
}

export const login = (data) => {
    const prefix = "LOGIN_";
    return callController(prefix, data);
}

export const logout = () => {
    const prefix = "LOGOUT_";
    return callController(prefix);
}

const callController = (prefix, data) => (dispatch) => dispatch(action(prefix + "SUCCESS", data))