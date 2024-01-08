// Dependencies
import config from "../../util/schemas/config/string.js";

import "moment-timezone";
import moment from "moment";

import { Command } from "@sapphire/framework";
import { EmbedBuilder, ChannelType } from "discord.js";

// Command
export default class extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("qotd")
                .setDescription("Send the QOTD!")
                .addStringOption((option) =>
                    option
                        .setName("question")
                        .setDescription("The question for QOTD.")
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        // Deferred Reply
        const deferredReply = await interaction.deferReply({
            ephemeral: true,
        });

        // Variables
        const currentQuestion = interaction.options.getString("question");

        const currentDateShort = moment()
            .tz("America/New_York")
            .format("DD/MM/YY");

        // QOTD Channel
        const qotdChannel = await config.findOne({
            key: "qotd",
        });
        const fetchedQotdChannel = interaction.guild.channels.cache.find(
            (c) => c.id === qotdChannel?.value
        );

        // QOTD Ping
        const qotdPing = interaction.guild.roles.cache.find(
            (r) => r.name === "QOTD Ping"
        );

        // Modlog Channel
        const modlogChannel = await config.findOne({
            key: "modlogs",
        });
        const fetchedModlogChannel = interaction.guild.channels.cache.find(
            (c) => c.id === modlogChannel?.value
        );

        // Channel Exist Check
        if (
            fetchedQotdChannel?.type !== ChannelType.GuildText ||
            fetchedModlogChannel?.type !== ChannelType.GuildText
        ) {
            return await interaction.editReply("Could not verify channel.");
        }

        // Embeds
        const qotdEmbed = new EmbedBuilder()
            .setTitle(`🏖️ **QOTD | ${currentDateShort}** 🏖️`)
            .setDescription(
                [
                    `The following rules apply:`,
                    `- Keep your answers in alignment with the server rules.`,
                    `- Answer in the thread attached to this message!`,
                    ``,
                    `## ${currentQuestion}`,
                ].join("\n")
            )
            .setColor("#0384fc");

        // Send QOTD
        const msg = await fetchedQotdChannel.send({
            content: `${qotdPing}`,
            embeds: [qotdEmbed],
        });

        // Send Modlog
        const modlogEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username} (${interaction.user.id})`,
                iconURL: interaction.user.avatarURL(),
            })
            .setColor("Aqua")
            .addFields(
                {
                    name: "New QOTD",
                    value: `Sent At: ${msg.url}\nCreated: <t:${Math.round(
                        msg.createdTimestamp / 1000
                    )}:f>`,
                },
                {
                    name: "Question",
                    value: `\`\`\`${currentQuestion}\`\`\``,
                }
            )
            .setTimestamp();

        // Send Modlog Embed
        fetchedModlogChannel.send({
            embeds: [modlogEmbed],
        });

        // Start Thread
        msg.startThread({
            name: `QOTD ${currentDateShort}`,
        });

        // Return Reply
        return await interaction.editReply({
            content: `Successfully sent the QOTD to ${fetchedQotdChannel}!`,
        });
    }
}
