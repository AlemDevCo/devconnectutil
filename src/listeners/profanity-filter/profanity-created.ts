// Dependencies
import configuration from "../../util/schemas/config/string.js";
import ProfanityFilter from "../../util/modules/filter.js";

import { Listener } from "@sapphire/framework";
import { Message, ChannelType, EmbedBuilder } from "discord.js";

export default class extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "messageCreate",
        });
    }

    async run(message: Message) {
        // Variables
        const messageLogsChannel = await configuration.findOne({
            key: "modlogs",
        });
        const fetchedMsgLogsChannel = message.guild.channels.cache.find(
            (c) => c.id === messageLogsChannel.value
        );

        // Length Check
        if (message.content.length >= 1000) {
            return;
        }

        // Channel Check
        if (fetchedMsgLogsChannel.type !== ChannelType.GuildText) {
            return;
        }

        // Embeds
        const logEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.username} (${message.author.id})`,
                iconURL: message.author.avatarURL(),
            })
            .addFields(
                {
                    name: "Profanity Filter",
                    value: [
                        `Channel: ${message.url}`,
                        `Created: <t:${Math.round(
                            message.createdTimestamp / 1000
                        )}:f>`,
                    ].join("\n"),
                },
                {
                    name: "Message Content",
                    value: `\`\`\`${message.content}\`\`\``,
                }
            )
            .setColor("Red")
            .setTimestamp();

        // Check Channel & Profanity Filter
        if (!fetchedMsgLogsChannel) {
            return;
        }
        if (!ProfanityFilter.isProfane(message.content)) {
            return;
        }

        await message.delete();
        return await fetchedMsgLogsChannel.send({
            embeds: [logEmbed],
        });
    }
}
