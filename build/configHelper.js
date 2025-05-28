"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfigHelper = initConfigHelper;
exports.updatePersistentConfigProperty = updatePersistentConfigProperty;
exports.getConfigProperty = getConfigProperty;
var fs = require('fs');
var path = require('path');
var filePath = path.join(process.pkg ? process.argv[0] : process.argv[1], '..', 'config.toml');
var json2toml = require('json2toml');
var toml = require('toml');
var config = {
    INGAME_NAME: '',
    WEBHOOK_URL: '',
    FLIP_ACTION_DELAY: 100,
    ENABLE_CONSOLE_INPUT: true,
    USE_COFL_CHAT: true,
    SESSIONS: {},
    WEBSOCKET_URL: 'wss://sky.coflnet.com/modsocket',
    BED_MULTIPLE_CLICKS_DELAY: 50
};
json2toml({ simple: true });
function initConfigHelper() {
    if (fs.existsSync(filePath)) {
        var existingConfig_1 = toml.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }));
        // add new default values to existing config if new property was added in newer version
        var hadChange_1 = false;
        Object.keys(config).forEach(function (key) {
            if (existingConfig_1[key] === undefined) {
                existingConfig_1[key] = config[key];
                hadChange_1 = true;
            }
        });
        if (hadChange_1) {
            fs.writeFileSync(filePath, prepareTomlBeforeWrite(json2toml(existingConfig_1)));
        }
        config = existingConfig_1;
    }
}
function updatePersistentConfigProperty(property, value) {
    config[property] = value;
    fs.writeFileSync(filePath, prepareTomlBeforeWrite(json2toml(config)));
}
function getConfigProperty(property) {
    return config[property];
}
function prepareTomlBeforeWrite(tomlString) {
    var lines = tomlString.split('\n');
    var index = lines.findIndex(function (l) { return l.startsWith('BED_MULTIPLE_CLICKS_DELAY = '); });
    lines.splice(index, 0, '# Bed flips are clicked 3 times with this setting. First delay in milliseconds before it should mathematically work. Once exactly at the time and once after the time. Disable it with a value less than 0.');
    return lines.join('\n');
}
//# sourceMappingURL=configHelper.js.map