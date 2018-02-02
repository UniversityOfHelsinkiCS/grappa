import { createLogger, format, transports } from 'winston';

const { combine, timestamp } = format;
const fileFormat = combine(timestamp(), format.json());

const logger = createLogger({
    transports: [
        new transports.File({
            level: 'info',
            format: fileFormat,
            filename: './logs/grappa.log'
        })
    ]
});

if (process.env.KISSA !== 'true') {
    logger.add(new transports.Console({ level: 'debug', format: format.simple() }));
}

if (process.env.NODE_ENV !== 'test') {
    logger.add(new transports.File({
        level: 'error',
        format: fileFormat,
        filename: './logs/grappa.error.log'
    }));
}

module.exports = logger;
