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
exports.initAFKHandler = initAFKHandler;
exports.tryToTeleportToIsland = tryToTeleportToIsland;
var logger_1 = require("./logger");
var utils_1 = require("./utils");
function initAFKHandler(bot) {
    var consecutiveTeleportAttempts = 0;
    registerCheckInverval();
    function registerCheckInverval() {
        var _this = this;
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var teleportWasTried;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tryToTeleportToIsland(bot)];
                    case 1:
                        teleportWasTried = _a.sent();
                        if (teleportWasTried) {
                            consecutiveTeleportAttempts++;
                            (0, logger_1.log)("ConsecutiveTeleportAttemps: ".concat(consecutiveTeleportAttempts));
                            registerCheckInverval();
                        }
                        else {
                            consecutiveTeleportAttempts = 0;
                            registerCheckInverval();
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 10000 * (consecutiveTeleportAttempts + 1));
    }
}
function tryToTeleportToIsland(bot_1) {
    return __awaiter(this, arguments, void 0, function (bot, delayBeforeTeleport) {
        var scoreboard;
        if (delayBeforeTeleport === void 0) { delayBeforeTeleport = 5000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isLimbo(bot.scoreboard.sidebar)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, utils_1.sleep)(delayBeforeTeleport)];
                case 1:
                    _a.sent();
                    (0, logger_1.log)('Bot seems to be in limbo. Sending "/lobby"');
                    (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §fYou seem to be in limbo.');
                    (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §fWarping back to lobby...');
                    bot.chat('/lobby');
                    return [2 /*return*/, true];
                case 2:
                    if (!!bot.scoreboard.sidebar.items.map(function (item) { return item.displayName.getText(null).replace(item.name, ''); }).find(function (e) { return e.includes('Purse:') || e.includes('Piggy:'); })) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, utils_1.sleep)(delayBeforeTeleport)];
                case 3:
                    _a.sent();
                    (0, logger_1.log)("Bot seems to be in lobby (Sidebar title = ".concat(bot.scoreboard.sidebar.title, "). Sending \"/play sb\""));
                    (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §fYou seem to be in the lobby.');
                    (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §fWarping back into skyblock...');
                    bot.chat('/play sb');
                    return [2 /*return*/, true];
                case 4:
                    scoreboard = bot.scoreboard.sidebar.items.map(function (item) { return item.displayName.getText(null).replace(item.name, ''); });
                    if (!!scoreboard.find(function (e) { return e.includes('Your Island'); })) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, utils_1.sleep)(delayBeforeTeleport)];
                case 5:
                    _a.sent();
                    (0, logger_1.log)('Bot is not on island. Warping back');
                    (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §fYou seem to not be on your island.');
                    (0, logger_1.printMcChatToConsole)('§f[§4BAF§f]: §fWarping back to island...');
                    bot.chat('/is');
                    return [2 /*return*/, true];
                case 6: return [2 /*return*/, false];
            }
        });
    });
}
function isLimbo(sidebar) {
    var isLimbo = true;
    sidebar.items.forEach(function (item) {
        if (item.displayName.getText(null).replace(item.name, '') !== '') {
            isLimbo = false;
        }
    });
    return isLimbo;
}
//# sourceMappingURL=AFKHandler.js.map