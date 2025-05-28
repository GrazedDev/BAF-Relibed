"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWebhookInitialized = sendWebhookInitialized;
exports.sendWebhookItemPurchased = sendWebhookItemPurchased;
exports.sendWebhookItemSold = sendWebhookItemSold;
exports.sendWebhookItemListed = sendWebhookItemListed;
var axios_1 = __importDefault(require("axios"));
var configHelper_1 = require("./configHelper");
function sendWebhookData(options) {
    var data = {
        content: options.content || '',
        avatar_url: options.avatar_url,
        tts: options.tts,
        embeds: options.embeds || [],
        username: options.username || 'BAF'
    };
    axios_1.default.post((0, configHelper_1.getConfigProperty)('WEBHOOK_URL'), data);
}
function isWebhookConfigured() {
    return !!(0, configHelper_1.getConfigProperty)('WEBHOOK_URL');
}
function sendWebhookInitialized() {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        content: 'Initialized Connection',
        embeds: [
            {
                title: 'Initialized Connection',
                fields: [
                    { name: 'Connected as:', value: "```".concat(ingameName, "```"), inline: false },
                    {
                        name: 'Started at:',
                        value: "<t:".concat((Date.now() / 1000).toFixed(0), ":t>"),
                        inline: false
                    }
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") }
            }
        ]
    });
}
function sendWebhookItemPurchased(itemName, price) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Item Purchased',
                fields: [
                    {
                        name: 'Item:',
                        value: "```".concat(itemName, "```"),
                        inline: true
                    },
                    {
                        name: 'Bought for:',
                        value: "```".concat(price, "```"),
                        inline: true
                    }
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") }
            }
        ]
    });
}
function sendWebhookItemSold(itemName, price, purchasedBy) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Item Sold',
                fields: [
                    {
                        name: 'Purchased by:',
                        value: "```".concat(purchasedBy, "```"),
                        inline: true
                    },
                    {
                        name: 'Item Sold:',
                        value: "```".concat(itemName, "```"),
                        inline: true
                    },
                    {
                        name: 'Sold for:',
                        value: "```".concat(price, "```"),
                        inline: true
                    }
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") }
            }
        ]
    });
}
function sendWebhookItemListed(itemName, price, duration) {
    if (!isWebhookConfigured()) {
        return;
    }
    var ingameName = (0, configHelper_1.getConfigProperty)('INGAME_NAME');
    sendWebhookData({
        embeds: [
            {
                title: 'Item Listed',
                fields: [
                    {
                        name: 'Listed Item:',
                        value: "```".concat(itemName, "```"),
                        inline: false
                    },
                    {
                        name: 'Item Price:',
                        value: "```".concat(price, "```"),
                        inline: false
                    },
                    {
                        name: 'AH Duration:',
                        value: "```".concat(duration, "h```"),
                        inline: false
                    }
                ],
                thumbnail: { url: "https://minotar.net/helm/".concat(ingameName, "/600.png") }
            }
        ]
    });
}
//# sourceMappingURL=webhookHandler.js.map