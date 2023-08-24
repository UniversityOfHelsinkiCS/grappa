import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

const { GIT_SHA, NODE_ENV } = process.env
const IN_PRODUCTION = NODE_ENV === 'production'

const initializeSentry = () => {
    if (!IN_PRODUCTION) return
    Sentry.init({
        dsn: 'https://bd3a3596f974cbb41f49fabbe408c5b5@toska.cs.helsinki.fi/8',
        release: GIT_SHA,
        environment: NODE_ENV,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0
    })
}

export default initializeSentry
