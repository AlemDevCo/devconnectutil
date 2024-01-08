// Dependencies
import string from "../util/schemas/config/string.js";

import { Listener } from "@sapphire/framework";
import { Message, EmbedBuilder } from "discord.js";

export default class extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "messageCreate",
        });
    }

    async run(message: Message) {
        // Variables
        const creationsChannel = await string.findOne({
            key: "creations"
        })

        const allowedLinks = [
            "https://www.youtube.com/",

            "https://fxtwitter.com/",
            "https://www.fxtwitter.com/",

            "https://fxdeviantart.com/",
            "https://www.fxdeviantart.com/",
        ];
        const alertLinks = [
            "https://twitter.com",
            "https://www.twitter.com",

            "https://deviantart.com",
            "https://www.deviantart.com",
        ];

        if(!creationsChannel) {
            return;
        }

        // Embeds
        const discussEmbed = new EmbedBuilder()
            .setTitle("Discussion Thread")
            .setColor("#0384fc")
            .setDescription(`Discuss ${message.author}'s creation here!`);

        const disallowedEmbed = new EmbedBuilder()
            .setDescription(
                [
                    `We detected that you tried to send either a Twitter or DeviantArt link in the creations channel.`,
                    `Due to their embed system not working correctly in Discord, we only allow the "**fx**" version of those two sites. Here's how to use it:`,
                    `\`https://twitter.com/\` **-->** \`https://fxtwitter.com/\``,
                    `\`https://deviantart.com/\` **-->** \`https://fxdeviantart.com/\``,
                    ``,
                    `We apologize for this!`,
                ].join("\n")
            )
            .setColor("Red");

        // Check If Channel Correct
        if (message.channelId == creationsChannel.value) {
            if (alertLinks.some((s) => message.content.includes(s))) {
                try {
                    await message.delete();

                    return await message.author.send({
                        embeds: [disallowedEmbed],
                    });
                } catch (e) {
                    return console.log(
                        "[CREATIONS] Failed to delete and message author."
                    );
                }
            } else {
                if (
                    message.attachments.size > 0 ||
                    allowedLinks.some((s) => message.content.includes(s))
                ) {
                    const thread = await message.startThread({
                        name: `${message.author.username}'s Creation Thread`,
                    });

                    await message.react("⭐");
                    await message.react("🤷‍♂️");
                    await message.react("👎");

                    return await thread.send({
                        embeds: [discussEmbed],
                    });
                } else {
                    try {
                        return await message.delete();
                    } catch (e) {
                        return console.log(
                            "[CREATIONS] Failed to delete message."
                        );
                    }
                }
            }
        }
    }
}
