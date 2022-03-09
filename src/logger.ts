const winston = require('winston');
import dotenv from "dotenv"
dotenv.config()

const { ElasticsearchTransport } = require('winston-elasticsearch');



const esTransportOpts = {
  level: 'info',
  dataStream: true,
  clientOpts: { node: process.env.ELASTICSEARCH_URL }
};

// const esTransport = new ElasticsearchTransport(esTransportOpts);

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

const logConfiguration = {
  transports: [
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
      }),
      new winston.transports.File({ 
      level: 'info',
      filename: "logs/logfile",
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: true }), //save errors on file
      // esTransport
  ],
  format: winston.format.combine(
      winston.format.label({
          label: `Request🏷️`
      }),
      winston.format.timestamp({
         format: 'MMM-DD-YYYY HH:mm:ss'
     }),
      winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
  )
};

const logger = winston.createLogger(logConfiguration);

logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};



export default logger
