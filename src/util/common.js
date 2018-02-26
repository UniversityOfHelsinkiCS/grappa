import moment from 'moment'

export const DISPLAY_DATE_FORMAT = 'DD.MM.YYYY'

export const sortDates = (d1, d2) => moment(d1) - moment(d2)

export const isDateAfter = (d1, d2) => moment(d1).isAfter(d2)

export const isDateAfterNow = date => isDateAfter(date, moment())

export const formatDisplayDate = date => moment(date).format(DISPLAY_DATE_FORMAT)

export const daysBetween = (d1, d2) => moment(d1).diff(moment(d2), 'days')
