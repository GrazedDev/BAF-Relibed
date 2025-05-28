import { MyBot, SwapData } from '../types/autobuy'
import { log } from './logger'
import { clickWindow, getWindowTitle } from './utils'

export async function swapProfile(bot: MyBot, data: SwapData) {
    bot.setQuickBarSlot(8)
    bot.activateItem()
    bot.on('windowOpen', window => {
        let title = getWindowTitle(window)
        if (title == 'SkyBlock Menu') {
            bot.currentWindow.requiresConfirmation = false;        clickWindow(bot, 48)
        }
        if (title == 'Profile Management') {
            let clickSlot
            window.slots.forEach(item => {
                if (item && (item.nbt.value as any).display.value.Name.value.includes((data as SwapData).profile)) clickSlot = item.slot
            })
            log('Clickslot is ' + clickSlot)
            bot.currentWindow.requiresConfirmation = false;        clickWindow(bot, clickSlot)
        }
        if (title.includes('Profile:')) {
            bot.currentWindow.requiresConfirmation = false;        clickWindow(bot, 11)
            log('Successfully swapped profiles')
        }
    })
}
