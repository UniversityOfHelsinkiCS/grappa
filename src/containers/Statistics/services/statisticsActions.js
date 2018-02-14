import { callController } from '../../../util/apiConnection'

export const getStatistics = () => {
    const route = '/statistics'
    const prefix = 'THESIS_GET_STATS_'
    return callController(route, prefix)
}
