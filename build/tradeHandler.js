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
exports.tradePerson = tradePerson;
var BAF_1 = require("./BAF");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
function tradePerson(bot, data) {
    return __awaiter(this, void 0, void 0, function () {
        var wss, addedCoins, addedItems, trading;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, BAF_1.getCurrentWebsocket)()];
                case 1:
                    wss = _a.sent();
                    addedCoins = false;
                    addedItems = false;
                    trading = true;
                    _a.label = 2;
                case 2:
                    if (!trading) return [3 /*break*/, 4];
                    bot.chat('/trade ' + data.target);
                    bot.on('message', function (msgE) { return __awaiter(_this, void 0, void 0, function () {
                        var msg;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    msg = msgE.getText(null);
                                    if (!(msg == 'You cannot trade while the server is lagging!')) return [3 /*break*/, 2];
                                    bot.chat('The server is lagging, give it a second');
                                    return [4 /*yield*/, (0, utils_1.sleep)(5000)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    if (msg.startsWith('Cannot find player named')) {
                                        (0, logger_1.log)('Player is not avaliable to trade with, please rerequest when they are capable of trading');
                                        trading = false;
                                        return [2 /*return*/];
                                    }
                                    else if (msg == 'You are too far away to trade with that player!') {
                                        bot.chat('Hey ' + data.target + ' come here so we can trade!');
                                    }
                                    else if (msg.startsWith('You have sent a trade request to ')) {
                                        (0, logger_1.log)('successfully sent trade, waiting for them to accept');
                                        bot.on('windowOpen', function (window) { return __awaiter(_this, void 0, void 0, function () {
                                            var _i, _a, slot;
                                            return __generator(this, function (_b) {
                                                trading = false;
                                                (0, logger_1.log)('Trade window opened');
                                                if (!addedItems) {
                                                    for (_i = 0, _a = data.slots; _i < _a.length; _i++) {
                                                        slot = _a[_i];
                                                        slot += 44;
                                                        bot.currentWindow.requiresConfirmation = false;
                                                        (0, utils_1.clickWindow)(bot, slot);
                                                        (0, logger_1.log)('Clicked slot ' + slot);
                                                    }
                                                    (0, logger_1.log)('Added all items');
                                                }
                                                if (data.coins > 0 && !addedCoins) {
                                                    bot._client.once('open_sign_entity', function (_a) {
                                                        var location = _a.location;
                                                        var price = data.coins;
                                                        (0, logger_1.log)('New sign entity');
                                                        (0, logger_1.log)('price to set ' + Math.floor(price).toString());
                                                        bot._client.write('update_sign', {
                                                            location: {
                                                                x: location.z,
                                                                y: location.y,
                                                                z: location.z
                                                            },
                                                            text1: "\"".concat(Math.floor(price).toString(), "\""),
                                                            text2: '{"italic":false,"extra":["^^^^^^^^^^^^^^^"],"text":""}',
                                                            text3: '{"italic":false,"extra":["Your auction"],"text":""}',
                                                            text4: '{"italic":false,"extra":["starting bid"],"text":""}'
                                                        });
                                                        addedCoins = true;
                                                    });
                                                    bot.currentWindow.requiresConfirmation = false;
                                                    (0, utils_1.clickWindow)(bot, 36);
                                                }
                                                if (!(data.coins > 0) || addedCoins) {
                                                    wss.send(JSON.stringify({ type: 'affirmFlip', data: [JSON.stringify(window.slots)] }));
                                                }
                                                return [2 /*return*/];
                                            });
                                        }); });
                                    }
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, utils_1.sleep)(5000)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=tradeHandler.js.map