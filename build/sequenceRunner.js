"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSequence = runSequence;
var BAF_1 = require("./BAF");
var consoleHandler_1 = require("./consoleHandler");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
function runSequence(bot, sequence) {
    return __awaiter(this, void 0, void 0, function () {
        var timeout, wss, _loop_1, _i, _a, step;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (bot.state) {
                        setTimeout(function () {
                            runSequence(bot, sequence);
                        }, 2000);
                        return [2 /*return*/];
                    }
                    bot.state = 'runningSequence';
                    timeout = setTimeout(function () {
                        if (bot.state === 'runningSequence') {
                            (0, logger_1.log)("Resetting 'bot.state === runningSequence' lock");
                            bot.state = null;
                            bot.removeAllListeners('windowOpen');
                        }
                    }, 10000);
                    return [4 /*yield*/, (0, BAF_1.getCurrentWebsocket)()];
                case 1:
                    wss = _b.sent();
                    _loop_1 = function (step) {
                        var _c, currentWindow, regexp_1, slot;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _c = step.type;
                                    switch (_c) {
                                        case 'execute': return [3 /*break*/, 1];
                                        case 'click': return [3 /*break*/, 3];
                                        case 'upload': return [3 /*break*/, 8];
                                    }
                                    return [3 /*break*/, 10];
                                case 1: return [4 /*yield*/, (0, consoleHandler_1.handleCommand)(bot, step.data)];
                                case 2:
                                    _d.sent();
                                    return [3 /*break*/, 11];
                                case 3: 
                                // wait for window to open (or 2 seconds) because a new window might be in process of opening
                                return [4 /*yield*/, waitForWindowOpen(bot, 2000)];
                                case 4:
                                    // wait for window to open (or 2 seconds) because a new window might be in process of opening
                                    _d.sent();
                                    currentWindow = bot.currentWindow;
                                    if (!currentWindow) {
                                        (0, logger_1.log)("No current window after 2 seconds during sequence run. ".concat(step), 'error');
                                        return [2 /*return*/, "continue"];
                                    }
                                    regexp_1 = new RegExp(step.data);
                                    slot = currentWindow.slots.find(function (item) {
                                        return regexp_1.test(JSON.stringify(item));
                                    });
                                    if (!slot) return [3 /*break*/, 6];
                                    bot.currentWindow.requiresConfirmation = false;
                                    return [4 /*yield*/, (0, utils_1.clickWindow)(bot, slot.slot)];
                                case 5:
                                    _d.sent();
                                    return [3 /*break*/, 7];
                                case 6:
                                    (0, logger_1.log)("Could not find slot to click during sequence. ".concat(step), 'error');
                                    _d.label = 7;
                                case 7: return [3 /*break*/, 11];
                                case 8:
                                    (0, logger_1.log)("Uploading inventory (".concat(bot.currentWindow.title, ")..."));
                                    // wait for window to open (or 2 seconds) because a new window might be in process of opening
                                    return [4 /*yield*/, waitForWindowOpen(bot, 2000)];
                                case 9:
                                    // wait for window to open (or 2 seconds) because a new window might be in process of opening
                                    _d.sent();
                                    wss.send(JSON.stringify({
                                        type: 'uploadUpperInventory',
                                        data: JSON.stringify(bot.currentWindow)
                                    }));
                                    return [3 /*break*/, 11];
                                case 10: return [3 /*break*/, 11];
                                case 11: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = sequence.steps;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    step = _a[_i];
                    return [5 /*yield**/, _loop_1(step)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (bot.currentWindow) {
                        bot.closeWindow(bot.currentWindow);
                    }
                    bot.removeAllListeners('windowOpen');
                    clearTimeout(timeout);
                    bot.state = null;
                    return [2 /*return*/];
            }
        });
    });
}
function waitForWindowOpen(bot, maxWaitTime) {
    if (maxWaitTime === void 0) { maxWaitTime = 2000; }
    return new Promise(function (resolve) {
        function handler(window) {
            bot.removeListener('windowOpen', handler);
            resolve(window);
        }
        setTimeout(function () {
            bot.removeListener('windowOpen', handler);
            resolve(null);
        }, maxWaitTime);
        bot.addListener('windowOpen', handler);
    });
}
//# sourceMappingURL=sequenceRunner.js.map