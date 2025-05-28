"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogger = initLogger;
exports.log = log;
exports.logPacket = logPacket;
exports.printMcChatToConsole = printMcChatToConsole;
exports.addLoggerToClientWriteFunction = addLoggerToClientWriteFunction;
var winston_1 = __importDefault(require("winston"));
var fs = require('fs');
var path = require('path');
var logFilePath = path.join(process.pkg ? process.argv[0] : process.argv[1], '..');
var logger;
function initLogger() {
    var loggerConfig = {
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint()),
        transports: [],
        exceptionHandlers: [new winston_1.default.transports.File({ filename: 'log.txt', dirname: logFilePath })],
        rejectionHandlers: [new winston_1.default.transports.File({ filename: 'log.txt', dirname: logFilePath })]
    };
    loggerConfig.transports.push(new winston_1.default.transports.File({
        dirname: logFilePath,
        filename: 'log.txt',
        level: 'debug',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint()),
        options: {
            flags: 'w'
        }
    }));
    loggerConfig.transports.push(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint()),
        level: 'none'
    }));
    logger = winston_1.default.createLogger(loggerConfig);
}
function log(string, level) {
    logger.log(level || 'info', string);
}
function logPacket(packet, packetMeta, toServer) {
    if (packetMeta.name !== 'window_click' && packetMeta.name !== 'open_window' && packetMeta.name !== 'window_items') {
        return;
    }
    fs.writeFileSync('packets.log', "".concat(toServer ? 'toServer' : 'toClient', ": ").concat(JSON.stringify(packet), "\n").concat(JSON.stringify(packetMeta), "\n----------------------------------------------\n"), { flag: 'a+' });
}
function printMcChatToConsole(string) {
    var msg = '';
    var split = string.split('§');
    msg += split[0];
    for (var _i = 0, _a = string.split('§').slice(1, split.length); _i < _a.length; _i++) {
        var a = _a[_i];
        var color = a.charAt(0);
        var message = void 0;
        if (Object.keys(colors).includes(color)) {
            msg += colors[color];
        }
        message = a.substring(1, a.length);
        msg += message;
    }
    console.log('\x1b[0m\x1b[1m\x1b[90m' + msg + '\x1b[0m');
}
// this function adds a logging function to the wrtie function of the client
// resulting in all sent packets being logged by the logPacket function
function addLoggerToClientWriteFunction(client) {
    ;
    (function () {
        var old_prototype = client.write.prototype;
        var old_init = client.write;
        client.write = function (name, packet) {
            old_init.apply(this, arguments);
            logPacket(packet, { name: name, state: null }, true);
        };
        client.write.prototype = old_prototype;
    })();
}
var colors = {
    0: '\x1b[0m\x1b[30m',
    1: '\x1b[0m\x1b[34m',
    2: '\x1b[0m\x1b[32m',
    3: '\x1b[0m\x1b[36m',
    4: '\x1b[0m\x1b[31m',
    5: '\x1b[0m\x1b[35m',
    6: '\x1b[0m\x1b[33m',
    7: '\x1b[0m\x1b[1m\x1b[90m',
    8: '\x1b[0m\x1b[90m',
    9: '\x1b[0m\x1b[34m',
    a: '\x1b[0m\x1b[32m',
    b: '\x1b[0m\x1b[36m',
    c: '\x1b[0m\x1b[31m',
    d: '\x1b[0m\x1b[35m',
    e: '\x1b[0m\x1b[33m',
    f: '\x1b[0m\x1b[37m'
};
//# sourceMappingURL=logger.js.map