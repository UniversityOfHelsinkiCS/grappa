import moment from 'moment'
import jwtDecode from 'jwt-decode'
import { TOKEN_NAME } from './constants'

import { login } from './apiConnection'

export const setToken = token => localStorage.setItem(TOKEN_NAME, token)

export const decodeToken = (token) => {
    try {
        return jwtDecode(token)
    } catch (e) {
        return {}
    }
}

export const tokenAccessInvalid = (token) => {
    const decodedToken = decodeToken(token)
    // Expired
    if (!decodedToken || decodedToken.exp < (new Date().getTime() / 1000)) {
        return true
    }
    // Misses fields
    /*
    const fields = ['enabled', 'userId', 'name']
    if (fields.some(key => !Object.keys(decodedToken).includes(key))) {
        return true
    }
    */
    return false
}

export const getToken = async (forceNew = false) => {
    let token = localStorage.getItem(TOKEN_NAME)
    if (!token || tokenAccessInvalid(token) || forceNew) {
        token = await login()
        setToken(token)
    }
    return token
}

export const DISPLAY_DATE_FORMAT = 'DD.MM.YYYY'

export const sortDates = (d1, d2) => moment(d1) - moment(d2)

export const isDateSameOrAfter = (d1, d2) => moment(d1).isSameOrAfter(d2, 'days')

export const isDateSameOrAfterAsToday = date => isDateSameOrAfter(date, moment())

export const formatDisplayDate = date => moment(date).format(DISPLAY_DATE_FORMAT)

export const daysBetween = (d1, d2) => moment(d1).diff(moment(d2), 'days')

export const isInDisplayDateFormat = date => moment(date, DISPLAY_DATE_FORMAT, true).isValid()

export const momentFromDisplayFormat = date => moment(date, DISPLAY_DATE_FORMAT)
