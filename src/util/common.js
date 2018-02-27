import moment from 'moment'

export const DISPLAY_DATE_FORMAT = 'DD.MM.YYYY'

export const sortDates = (d1, d2) => moment(d1) - moment(d2)

export const isDateSameOrAfter = (d1, d2) => moment(d1).isSameOrAfter(d2, 'days')

export const isDateSameOrAfterAsToday = date => isDateSameOrAfter(date, moment())

export const formatDisplayDate = date => moment(date).format(DISPLAY_DATE_FORMAT)

export const daysBetween = (d1, d2) => moment(d1).diff(moment(d2), 'days')

export const isInDisplayDateFormat = date => moment(date, DISPLAY_DATE_FORMAT, true).isValid()

export const momentFromDisplayFormat = date => moment(date, DISPLAY_DATE_FORMAT)
