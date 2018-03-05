import { callController } from '../../../util/apiConnection'

const prefix = process.env.NODE_ENV === 'development' ? '' : '../..'

export const acceptThesis = token => callController(`${prefix}/invite/thesis/${token}`, 'INVITE_ACCEPT_THESIS_')
export const acceptRole = token => callController(`${prefix}/invite/role/${token}`, 'INVITE_ACCEPT_ROLE_')
