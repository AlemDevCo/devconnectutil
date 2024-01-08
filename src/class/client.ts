import { SapphireClient } from "@sapphire/framework";
import {
    ActivityType,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
} from "discord.js";

import { config } from "dotenv";
config();

export default class extends SapphireClient {
    constructor() {
        super({
            intents: Object.keys(GatewayIntentBits),
            partials: Object.keys(Partials),
        });
    }

    async start() {
        this.login(process.env.TOKEN_EMU);
    }
}
