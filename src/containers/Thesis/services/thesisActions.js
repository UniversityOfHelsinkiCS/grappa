import { callController } from '../../../util/apiConnection'

export const getTheses = () => {
    const route = '/theses'
    const prefix = 'THESIS_GET_ALL_'
    return callController(route, prefix)
}

export const getThesis = (thesisId) => {
    const route = `/theses${thesisId}`
    const prefix = 'THESIS_GET_ONE_'
    return callController(route, prefix)
}

export const saveThesis = (thesis) => {
    const route = '/theses'
    const prefix = 'THESIS_SAVE_ONE_'
    const method = 'post'
    return callController(route, prefix, thesis, method)
}

export const updateThesis = (thesis) => {
    const route = '/theses'
    const prefix = 'THESIS_UPDATE_ONE_'
    const method = 'put'
    return callController(route, prefix, thesis, method)
}

export const deleteThesis = (thesisId) => {
    const route = `/theses/${thesisId}`
    const prefix = 'THESIS_DELETE_ONE_'
    const method = 'delete'
    return callController(route, prefix, thesisId, method)
}

export const markPrinted = (thesisIds) => {
    const route = '/theses/printed'
    const prefix = 'THESIS_MARK_PRINTED_'
    const method = 'put'
    return callController(route, prefix, thesisIds, method)
}
