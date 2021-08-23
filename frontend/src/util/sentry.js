import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

const { GIT_SHA, NODE_ENV } = process.env
const IN_PRODUCTION = NODE_ENV === 'development' || NODE_ENV === 'staging'

const initializeSentry = () => {
    if (!IN_PRODUCTION) return
    Sentry.init({
        dsn: 'https://937cdbbab78348eaa445788e08bdba9c@sentry.cs.helsinki.fi/8',
        release: GIT_SHA,
        environment: NODE_ENV,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0
    })
}

export default initializeSentry
