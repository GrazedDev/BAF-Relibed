"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionId = getSessionId;
exports.isExpired = isExpired;
var configHelper_1 = require("./configHelper");
var crypto_1 = __importDefault(require("crypto"));
var SESSIONS_KEY = 'SESSIONS';
function getSessionId(username) {
    var sessions = (0, configHelper_1.getConfigProperty)(SESSIONS_KEY);
    if (!sessions) {
        sessions = {};
        (0, configHelper_1.updatePersistentConfigProperty)(SESSIONS_KEY, {});
    }
    if (!sessions[username]) {
        sessions[username] = {
            id: crypto_1.default.randomUUID(),
            expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 180)
        };
        (0, configHelper_1.updatePersistentConfigProperty)(SESSIONS_KEY, sessions);
    }
    if (isExpired(sessions[username].expires)) {
        delete sessions[username];
        (0, configHelper_1.updatePersistentConfigProperty)(SESSIONS_KEY, sessions);
        return null;
    }
    else {
        return sessions[username].id;
    }
}
function isExpired(date) {
    return date.getTime() < new Date().getTime();
}
//# sourceMappingURL=coflSessionManager.js.map