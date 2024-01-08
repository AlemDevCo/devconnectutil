// Dependencies
import configuration from "../../util/schemas/config/string.js";
import ProfanityFilter from "../../util/modules/filter.js";

import { Listener } from "@sapphire/framework";
import { Message, ChannelType, EmbedBuilder } from "discord.js";

export default class extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "messageUpdate",
        });
    }

    async run(oldmessage: Message, newmessage: Message) {
        // Variables
        const messageLogsChannel = await configuration.findOne({
            key: "modlogs",
        });
        const fetchedMsgLogsChannel = newmessage.guild.channels.cache.find(
            (c) => c.id === messageLogsChannel.value
        );

        // Length Check
        if (
            oldmessage.content.length >= 1000 ||
            newmessage.content.length >= 1000
        ) {
            return;
        }

        // Channel Check
        if (fetchedMsgLogsChannel.type !== ChannelType.GuildText) {
            return;
        }

        // Embeds
        const logEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${newmessage.author.username} (${newmessage.author.id})`,
                iconURL: newmessage.author.avatarURL(),
            })
            .addFields(
                {
                    name: "Profanity Filter (Updated Message)",
                    value: [
                        `Channel: ${newmessage.url}`,
                        `Created: <t:${Math.round(
                            newmessage.createdTimestamp / 1000
                        )}:f>`,
                    ].join("\n"),
                },
                {
                    name: "Old Message Content",
                    value: `\`\`\`${oldmessage.content}\`\`\``,
                },
                {
                    name: "New Message Content",
                    value: `\`\`\`${newmessage.content}\`\`\``,
                }
            )
            .setColor("#eb8654")
            .setTimestamp();

        // Check Channel & Profanity Filter
        if (!fetchedMsgLogsChannel) {
            return;
        }
        if (!ProfanityFilter.isProfane(newmessage.content)) {
            return;
        }

        await newmessage.delete();
        return await fetchedMsgLogsChannel.send({
            embeds: [logEmbed],
        });
    }
}
