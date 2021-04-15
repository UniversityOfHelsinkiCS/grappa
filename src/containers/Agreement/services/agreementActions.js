import { callController } from '../../../util/apiConnection'

export const getAgreements = () => {
    const prefix = 'AGREEMENT_GET_ALL_'
    const route = '/agreements'
    return callController(route, prefix)
}

export const saveAgreement = (agreement) => {
    const prefix = 'AGREEMENT_SAVE_ONE_'
    const method = 'post'
    const route = '/agreements'
    return callController(route, prefix, agreement, method)
}
