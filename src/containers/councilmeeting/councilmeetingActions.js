import { callController } from '../../util/apiConnection';

export const getCouncilmeetings = () => {
    const prefix = 'COUNCILMEETING_GET_ALL_';
    const route = '/councilmeetings';
    return callController(route, prefix);
}

export const saveCouncilmeeting = (councilmeeting) => {
    const prefix = 'COUNCILMEETING_SAVE_ONE_';
    const method = 'post';
    const route = '/councilmeetings';
    return callController(route, prefix, councilmeeting, method);
}

export const updateCouncilmeeting = (councilmeeting) => {
    const prefix = 'COUNCILMEETING_UPDATE_ONE_';
    const method = 'put';
    const route = '/councilmeetings/' + councilmeeting.councilmeetingId;
    return callController(route, prefix, councilmeeting, method);
}

export const deleteCouncilmeeting = (councilmeetingId) => {
    const prefix = 'COUNCILMEETING_DELETE_ONE_';
    const method = 'delete';
    const route = '/councilmeetings/' + councilmeetingId;
    return callController(route, prefix, councilmeetingId, method);
}
