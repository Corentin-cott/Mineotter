import {Otterbots} from "../otterbots";

// Get bot instance
const bot = new Otterbots();

// Start the bot
bot.start();
bot.setActivity("playing", "Minecraft")

// Start tasks (if you not use tasks, you can delete this)
bot.initTask()