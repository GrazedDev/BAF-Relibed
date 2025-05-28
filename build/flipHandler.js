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
exports.flipHandler = flipHandler;
var configHelper_1 = require("./configHelper");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
function flipHandler(bot, flip) {
    return __awaiter(this, void 0, void 0, function () {
        var timeout, isBed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flip.purchaseAt = new Date(flip.purchaseAt);
                    if (bot.state) {
                        setTimeout(function () {
                            flipHandler(bot, flip);
                        }, 1100);
                        return [2 /*return*/];
                    }
                    bot.state = 'purchasing';
                    timeout = setTimeout(function () {
                        if (bot.state === 'purchasing') {
                            (0, logger_1.log)("Resetting 'bot.state === purchasing' lock");
                            bot.state = null;
                            bot.removeAllListeners('windowOpen');
                        }
                    }, 10000);
                    isBed = flip.purchaseAt.getTime() > new Date().getTime();
                    bot.lastViewAuctionCommandForPurchase = "/viewauction ".concat(flip.id);
                    bot.chat(bot.lastViewAuctionCommandForPurchase);
                    (0, logger_1.printMcChatToConsole)("\u00A7f[\u00A74BAF\u00A7f]: \u00A7fTrying to purchase flip".concat(isBed ? ' (Bed)' : '', ": ").concat(flip.itemName, " \u00A7for ").concat((0, utils_1.numberWithThousandsSeparators)(flip.startingBid), " coins (Target: ").concat((0, utils_1.numberWithThousandsSeparators)(flip.target), ")"));
                    return [4 /*yield*/, useRegularPurchase(bot, flip, isBed)];
                case 1:
                    _a.sent();
                    clearTimeout(timeout);
                    return [2 /*return*/];
            }
        });
    });
}
function useRegularPurchase(bot, flip, isBed) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        bot.addListener('windowOpen', function (window) { return __awaiter(_this, void 0, void 0, function () {
            var title, multipleBedClicksDelay, delayUntilBuyStart, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.sleep)((0, configHelper_1.getConfigProperty)('FLIP_ACTION_DELAY'))];
                    case 1:
                        _a.sent();
                        title = (0, utils_1.getWindowTitle)(window);
                        if (!title.toString().includes('BIN Auction View')) return [3 /*break*/, 8];
                        multipleBedClicksDelay = (0, configHelper_1.getConfigProperty)('BED_MULTIPLE_CLICKS_DELAY');
                        delayUntilBuyStart = isBed
                            ? flip.purchaseAt.getTime() - new Date().getTime() - (multipleBedClicksDelay > 0 ? multipleBedClicksDelay : 0)
                            : flip.purchaseAt.getTime() - new Date().getTime();
                        return [4 /*yield*/, (0, utils_1.sleep)(delayUntilBuyStart)];
                    case 2:
                        _a.sent();
                        if (!(isBed && (0, configHelper_1.getConfigProperty)('BED_MULTIPLE_CLICKS_DELAY') > 0)) return [3 /*break*/, 7];
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < 3)) return [3 /*break*/, 6];
                        bot.currentWindow.requiresConfirmation = false;
                        (0, utils_1.clickWindow)(bot, 31);
                        return [4 /*yield*/, (0, utils_1.sleep)((0, configHelper_1.getConfigProperty)('BED_MULTIPLE_CLICKS_DELAY'))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        bot.currentWindow.requiresConfirmation = false;
                        (0, utils_1.clickWindow)(bot, 31);
                        _a.label = 8;
                    case 8:
                        if (title.toString().includes('Confirm Purchase')) {
                            bot.currentWindow.requiresConfirmation = false;
                            (0, utils_1.clickWindow)(bot, 11);
                            bot.removeAllListeners('windowOpen');
                            bot.state = null;
                            resolve();
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
//# sourceMappingURL=flipHandler.js.map