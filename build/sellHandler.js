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
exports.onWebsocketCreateAuction = onWebsocketCreateAuction;
var BAF_1 = require("./BAF");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
var webhookHandler_1 = require("./webhookHandler");
var setPrice = false;
var durationSet = false;
var retryCount = 0;
function onWebsocketCreateAuction(bot, data) {
    return __awaiter(this, void 0, void 0, function () {
        var ws;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, BAF_1.getCurrentWebsocket)()];
                case 1:
                    ws = _a.sent();
                    if (bot.state) {
                        (0, logger_1.log)('Currently busy with something else (' + bot.state + ') -> not selling');
                        if (retryCount > 10) {
                            retryCount = 0;
                            return [2 /*return*/];
                        }
                        setTimeout(function () {
                            retryCount++;
                            onWebsocketCreateAuction(bot, data);
                        }, 2000);
                        return [2 /*return*/];
                    }
                    bot.state = 'selling';
                    (0, logger_1.log)('Selling item...');
                    (0, logger_1.log)(data);
                    sellItem(data, bot, ws);
                    return [2 /*return*/];
            }
        });
    });
}
function sellItem(data, bot, ws) {
    return __awaiter(this, void 0, void 0, function () {
        var timeout, handler;
        return __generator(this, function (_a) {
            timeout = setTimeout(function () {
                (0, logger_1.log)('Seems something went wrong while selling. Removing lock', 'warn');
                bot.state = null;
                bot.removeAllListeners('windowOpen');
            }, 10000);
            handler = function (window) {
                sellHandler(data, bot, window, ws, function () {
                    clearTimeout(timeout);
                    bot.removeAllListeners('windowOpen');
                });
            };
            bot.on('windowOpen', handler);
            bot.chat('/ah');
            return [2 /*return*/];
        });
    });
}
// Store the reason if the last sell attempt failed
// If it happens again, send a error message to the backend
var previousError;
function sellHandler(data, bot, sellWindow, ws, removeEventListenerCallback) {
    return __awaiter(this, void 0, void 0, function () {
        var title, clickSlot, i, item, itemSlot, id, uuid, resetAndTakeOutItem, lore, priceLine, obj;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        return __generator(this, function (_1) {
            title = (0, utils_1.getWindowTitle)(sellWindow);
            (0, logger_1.log)(title);
            if (title.toString().includes('Auction House')) {
                bot.currentWindow.requiresConfirmation = false;
                (0, utils_1.clickWindow)(bot, 15);
            }
            if (title == 'Manage Auctions') {
                clickSlot = void 0;
                for (i = 0; i < sellWindow.slots.length; i++) {
                    item = sellWindow.slots[i];
                    if (item && item.nbt.value.display.value.Name.value.includes('Create Auction')) {
                        if (item && ((_f = (_e = (_d = (_c = (_b = (_a = item.nbt.value) === null || _a === void 0 ? void 0 : _a.display) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.Lore) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.toString().includes('You reached the maximum number'))) {
                            (0, logger_1.log)('Maximum number of auctons reached -> cant sell');
                            removeEventListenerCallback();
                            bot.state = null;
                            return [2 /*return*/];
                        }
                        clickSlot = item.slot;
                    }
                }
                bot.currentWindow.requiresConfirmation = false;
                (0, utils_1.clickWindow)(bot, clickSlot);
            }
            if (title == 'Create Auction') {
                bot.currentWindow.requiresConfirmation = false;
                (0, utils_1.clickWindow)(bot, 48);
            }
            if (title == 'Create BIN Auction') {
                if (!setPrice && !durationSet) {
                    if (!sellWindow.slots[13].nbt.value.display.value.Name.value.includes('Click an item in your inventory!')) {
                        bot.currentWindow.requiresConfirmation = false;
                        (0, utils_1.clickWindow)(bot, 13);
                    }
                    itemSlot = data.slot - bot.inventory.inventoryStart + sellWindow.inventoryStart;
                    if (!sellWindow.slots[itemSlot]) {
                        if (previousError === 'Slot empty') {
                            ws.send(JSON.stringify({
                                type: 'clientError',
                                data: { data: data, message: 'createAuction slot empty' }
                            }));
                        }
                        previousError = 'Slot empty';
                        bot.state = null;
                        removeEventListenerCallback();
                        (0, logger_1.log)('No item at index ' + itemSlot + ' found -> probably already sold', 'warn');
                        return [2 /*return*/];
                    }
                    id = (_m = (_l = (_k = (_j = (_h = (_g = sellWindow.slots[itemSlot]) === null || _g === void 0 ? void 0 : _g.nbt) === null || _h === void 0 ? void 0 : _h.value) === null || _j === void 0 ? void 0 : _j.ExtraAttributes) === null || _k === void 0 ? void 0 : _k.value) === null || _l === void 0 ? void 0 : _l.id) === null || _m === void 0 ? void 0 : _m.value;
                    uuid = (_t = (_s = (_r = (_q = (_p = (_o = sellWindow.slots[itemSlot]) === null || _o === void 0 ? void 0 : _o.nbt) === null || _p === void 0 ? void 0 : _p.value) === null || _q === void 0 ? void 0 : _q.ExtraAttributes) === null || _r === void 0 ? void 0 : _r.value) === null || _s === void 0 ? void 0 : _s.uuid) === null || _t === void 0 ? void 0 : _t.value;
                    if (data.id !== id && data.id !== uuid) {
                        if (previousError === "Item doesn't match") {
                            ws.send(JSON.stringify({
                                type: 'clientError',
                                data: { data: data, slot: JSON.stringify(sellWindow.slots[itemSlot]), message: 'createAuction item doesnt match' }
                            }));
                        }
                        previousError = 'Item doesnt match';
                        bot.state = null;
                        removeEventListenerCallback();
                        (0, logger_1.log)('Item at index ' + itemSlot + '" does not match item that is supposed to be sold: "' + data.id + '" -> dont sell', 'warn');
                        (0, logger_1.log)(JSON.stringify(sellWindow.slots[itemSlot]));
                        return [2 /*return*/];
                    }
                    previousError = null;
                    bot.currentWindow.requiresConfirmation = false;
                    (0, utils_1.clickWindow)(bot, itemSlot);
                    bot._client.once('open_sign_entity', function (_a) {
                        var location = _a.location;
                        var price = data.price;
                        (0, logger_1.log)('Price to set ' + Math.floor(price).toString());
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
                    });
                    (0, logger_1.log)('opening pricer');
                    bot.currentWindow.requiresConfirmation = false;
                    (0, utils_1.clickWindow)(bot, 31);
                    setPrice = true;
                }
                else if (setPrice && !durationSet) {
                    bot.currentWindow.requiresConfirmation = false;
                    (0, utils_1.clickWindow)(bot, 33);
                }
                else if (setPrice && durationSet) {
                    resetAndTakeOutItem = function () {
                        bot.currentWindow.requiresConfirmation = false;
                        (0, utils_1.clickWindow)(bot, 13); // Take the item out of the window
                        removeEventListenerCallback();
                        setPrice = false;
                        durationSet = false;
                        bot.state = null;
                    };
                    try {
                        lore = (_0 = (_z = (_y = (_x = (_w = (_v = (_u = sellWindow.slots[29]) === null || _u === void 0 ? void 0 : _u.nbt) === null || _v === void 0 ? void 0 : _v.value) === null || _w === void 0 ? void 0 : _w.display) === null || _x === void 0 ? void 0 : _x.value) === null || _y === void 0 ? void 0 : _y.Lore) === null || _z === void 0 ? void 0 : _z.value) === null || _0 === void 0 ? void 0 : _0.value;
                        priceLine = lore.find(function (el) { return (0, utils_1.removeMinecraftColorCodes)(el).includes('Item price'); });
                        if (!priceLine) {
                            (0, logger_1.log)('Price not present', 'error');
                            (0, logger_1.log)(sellWindow.slots[29]);
                            resetAndTakeOutItem();
                            return [2 /*return*/];
                        }
                        if (priceLine.startsWith('{')) {
                            obj = JSON.parse(priceLine);
                            priceLine = obj.extra[1].text.replace(/[,.]/g, '').split(' coins')[0];
                        }
                        else {
                            priceLine = (0, utils_1.removeMinecraftColorCodes)(priceLine);
                            priceLine = priceLine.split(': ')[1].split(' coins')[0];
                            priceLine = priceLine.replace(/[,.]/g, '');
                        }
                        if (Number(priceLine) !== Math.floor(data.price)) {
                            (0, logger_1.log)('Price is not the one that should be there', 'error');
                            (0, logger_1.log)(data);
                            (0, logger_1.log)(sellWindow.slots[29]);
                            resetAndTakeOutItem();
                            return [2 /*return*/];
                        }
                    }
                    catch (e) {
                        (0, logger_1.log)('Checking if correct price was set in sellHandler through an error: ' + JSON.stringify(e), 'error');
                    }
                    bot.currentWindow.requiresConfirmation = false;
                    (0, utils_1.clickWindow)(bot, 29);
                }
            }
            if (title == 'Auction Duration') {
                setAuctionDuration(bot, data.duration).then(function () {
                    durationSet = true;
                });
                bot.currentWindow.requiresConfirmation = false;
                (0, utils_1.clickWindow)(bot, 16);
            }
            if (title == 'Confirm BIN Auction') {
                bot.currentWindow.requiresConfirmation = false;
                (0, utils_1.clickWindow)(bot, 11);
            }
            if (title == 'BIN Auction View') {
                (0, logger_1.log)('Successfully listed an item');
                removeEventListenerCallback();
                setPrice = false;
                durationSet = false;
                bot.state = null;
                (0, logger_1.printMcChatToConsole)("\u00A7f[\u00A74BAF\u00A7f]: \u00A7fItem listed: ".concat(data.itemName, " \u00A7ffor ").concat((0, utils_1.numberWithThousandsSeparators)(data.price), " coins"));
                (0, webhookHandler_1.sendWebhookItemListed)(data.itemName, (0, utils_1.numberWithThousandsSeparators)(data.price), data.duration);
                bot.closeWindow(sellWindow);
            }
            return [2 /*return*/];
        });
    });
}
function setAuctionDuration(bot, time) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, logger_1.log)('setAuctionDuration function');
            return [2 /*return*/, new Promise(function (resolve) {
                    bot._client.once('open_sign_entity', function (_a) {
                        var location = _a.location;
                        bot._client.write('update_sign', {
                            location: {
                                x: location.z,
                                y: location.y,
                                z: location.z
                            },
                            text1: "\"".concat(Math.floor(time).toString(), "\""),
                            text2: '{"italic":false,"extra":["^^^^^^^^^^^^^^^"],"text":""}',
                            text3: '{"italic":false,"extra":["Auction"],"text":""}',
                            text4: '{"italic":false,"extra":["hours"],"text":""}'
                        });
                        resolve();
                    });
                })];
        });
    });
}
//# sourceMappingURL=sellHandler.js.map