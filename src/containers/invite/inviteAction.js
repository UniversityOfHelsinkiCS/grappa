import { callController } from '../../util/apiConnection';

export const acceptThesis = token => callController(`/invite/thesis/${token}`, 'INVITE_ACCEPT_THESIS_');
