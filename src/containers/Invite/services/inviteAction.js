import { callController } from '../../../util/apiConnection'

export const acceptThesis = token => callController(`/invite/thesis/${token}`, 'INVITE_ACCEPT_THESIS_')
export const acceptRole = token => callController(`/invite/role/${token}`, 'INVITE_ACCEPT_ROLE_')
