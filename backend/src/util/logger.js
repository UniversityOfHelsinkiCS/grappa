const os = require('os')

const winston = require('winston')
const { WinstonGelfTransporter } = require('winston-gelf-transporter')

const transports = []

if (process.env.NODE_ENV !== 'test') {
    transports.push(new winston.transports.File({ filename: 'debug.log' }))
}

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new WinstonGelfTransporter({
      handleExceptions: true,
      host: 'svm-116.cs.helsinki.fi',
      port: 9503,
      protocol: 'udp',
      hostName: os.hostname(),
      additional: {
        app: 'grappa',
        environment: 'production'
      }
    })
  )
}

transports.push(new winston.transports.Console({ level: 'debug' }))

const logger = winston.createLogger({ transports })

module.exports = logger
