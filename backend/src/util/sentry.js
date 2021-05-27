const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing') // eslint-disable-line

const { GIT_SHA, NODE_ENV } = process.env
const IN_PRODUCTION = NODE_ENV === 'development' || NODE_ENV === 'staging'


const initializeSentry = (app) => {
    if (!IN_PRODUCTION) return

    Sentry.init({
        dsn: 'https://937cdbbab78348eaa445788e08bdba9c@sentry.cs.helsinki.fi/8',
        release: GIT_SHA,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Tracing.Integrations.Express({ app })
        ],
        environment: NODE_ENV,
        tracesSampleRate: 1.0
    })
}

module.exports = initializeSentry
