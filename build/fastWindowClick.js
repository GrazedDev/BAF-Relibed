"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFastWindowClicker = getFastWindowClicker;
exports.createFastWindowClicker = createFastWindowClicker;
var utils_1 = require("./utils");
var windowClicker;
function getFastWindowClicker() {
    if (windowClicker) {
        return windowClicker;
    }
    throw 'Window Clicker not created!';
}
function createFastWindowClicker(client) {
    var actionCounter = 1;
    var lastWindowId = 0;
    var _windowClicker = {
        // click purchase in window "BIN Auction View"
        clickPurchase: function (price, windowId) {
            client.write('window_click', {
                windowId: windowId,
                slot: 31,
                mouseButton: 0,
                action: actionCounter,
                mode: 0,
                item: {
                    blockId: 371,
                    itemCount: 1,
                    itemDamage: 0,
                    nbtData: {
                        type: 'compound',
                        name: '',
                        value: {
                            overrideMeta: { type: 'byte', value: 1 },
                            display: {
                                type: 'compound',
                                value: {
                                    Lore: {
                                        type: 'list',
                                        value: {
                                            type: 'string',
                                            value: ['', "\u252C\u00BA7Price: \u252C\u00BA6".concat((0, utils_1.numberWithThousandsSeparators)(price), " coins"), '', '┬ºeClick to purchase!']
                                        }
                                    },
                                    Name: { type: 'string', value: '┬º6Buy Item Right Now' }
                                }
                            },
                            AttributeModifiers: { type: 'list', value: { type: 'end', value: [] } }
                        }
                    }
                }
            });
            actionCounter += 1;
        },
        clickBedPurchase: function (price, windowId) {
            client.write('window_click', {
                windowId: windowId,
                slot: 31,
                mouseButton: 0,
                action: actionCounter,
                mode: 0,
                item: {
                    blockId: 355,
                    itemCount: 1,
                    itemDamage: 0,
                    nbtData: {
                        type: 'compound',
                        name: '',
                        value: {
                            overrideMeta: { type: 'byte', value: 1 },
                            display: {
                                type: 'compound',
                                value: {
                                    Lore: {
                                        type: 'list',
                                        value: {
                                            type: 'string',
                                            value: ['', "\u252C\u00BA7Price: \u252C\u00BA6".concat((0, utils_1.numberWithThousandsSeparators)(price), " coins"), '', '┬ºcCan be bought soon!']
                                        }
                                    },
                                    Name: { type: 'string', value: '┬º6Buy Item Right Now' }
                                }
                            },
                            AttributeModifiers: { type: 'list', value: { type: 'end', value: [] } }
                        }
                    }
                }
            });
            actionCounter += 1;
        },
        // click confirm in window "Confirm Purchase"
        clickConfirm: function (price, itemName, windowId) {
            client.write('window_click', {
                windowId: windowId,
                slot: 11,
                mouseButton: 0,
                action: actionCounter,
                mode: 0,
                item: {
                    blockId: 159,
                    itemCount: 1,
                    itemDamage: 13,
                    nbtData: {
                        type: 'compound',
                        name: '',
                        value: {
                            overrideMeta: { type: 'byte', value: 1 },
                            display: {
                                type: 'compound',
                                value: {
                                    Lore: {
                                        type: 'list',
                                        value: {
                                            type: 'string',
                                            value: [
                                                "\u252C\u00BA7Purchasing: \u252C\u00BAa\u252C\u00BAf\u252C\u00BA9".concat(itemName.replace(/§/g, '┬º')),
                                                "\u252C\u00BA7Cost: \u252C\u00BA6".concat((0, utils_1.numberWithThousandsSeparators)(Math.floor(price)), " coins")
                                            ]
                                        }
                                    },
                                    Name: { type: 'string', value: '┬ºaConfirm' }
                                }
                            },
                            AttributeModifiers: { type: 'list', value: { type: 'end', value: [] } }
                        }
                    }
                }
            });
            actionCounter += 1;
        },
        getLastWindowId: function () {
            return lastWindowId;
        }
    };
    client.on('packet', function (packet, packetMeta) {
        if (packetMeta.name === 'open_window') {
            lastWindowId = packet.windowId;
        }
        //logPacket(packet, packetMeta, false)
    });
    windowClicker = _windowClicker;
}
//# sourceMappingURL=fastWindowClick.js.map