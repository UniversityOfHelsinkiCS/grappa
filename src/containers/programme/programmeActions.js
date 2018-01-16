import { callController } from '../../util/apiConnection';

export const getProgrammes = () => {
    const route = '/programmes';
    const prefix = 'PROGRAMME_GET_ALL_';
    return callController(route, prefix);
};

export const saveProgramme = (programme) => {
    const route = '/programmes';
    const prefix = 'PROGRAMME_SAVE_ONE_';
    const method = 'post';
    return callController(route, prefix, programme, method);
};

export const updateProgramme = (programme) => {
    const route = '/programmes';
    const prefix = 'PROGRAMME_UPDATE_ONE_';
    const method = 'put';
    return callController(route, prefix, programme, method);
};

export const deleteProgramme = (programmeId) => {
    const route = '/programmes/' + programmeId;
    const prefix = 'PROGRAMME_DELETE_ONE_';
    const method = 'delete';
    return callController(route, prefix, programmeId, method);
};
