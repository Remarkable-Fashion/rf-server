import winston from "winston";
import moment from "moment-timezone";
import { conf } from "./config";

function getRequestLogFormatter() {
    const { combine, timestamp, printf } = winston.format;

    return combine(
        timestamp({ format: () => moment().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ss") }),
        // timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
        printf((info) => {
            const { req } = info.message;
            const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
            return `${info.timestamp} ${info.level}: ${ip}${req.port || ""} ${req.method} '${req.originalUrl}'`;
            // return `${info.timestamp} ${info.level}: ${req.hostname}${req.port || ""} ${req.method} '${req.originalUrl}'`;
        })
    );
}

const logger = winston.createLogger({
    level: "info",
    format: getRequestLogFormatter(),
    // format: winston.format.json(),
    // defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ filename: `${conf().LOG_DIR}/error.log`, level: "error" }),
        new winston.transports.File({ filename: `${conf().LOG_DIR}/combined.log` })
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: getRequestLogFormatter()
        })
    );
}

export { logger };
