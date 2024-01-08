// Dependencies
import config from "../../util/schemas/config/string.js";

import "moment-timezone";
import moment from "moment";
import { Command } from "@sapphire/framework";
import {
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
    Role,
} from "discord.js";

// Command
export default class extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("servicestatus")
                .setDescription("Send a service status message.")
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addStringOption((option) =>
                    option
                        .setName("status")
                        .setDescription(
                            "The service status that you would like to send."
                        )
                        .setRequired(true)
                        .addChoices(
                            {
                                name: "Operational",
                                value: "1",
                            },
                            {
                                name: "Resolving",
                                value: "2",
                            },
                            {
                                name: "Service Distruption",
                                value: "3",
                            }
                        )
                )
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription(
                            "An additional message that you would like to add."
                        )
                )
        );
    }

    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        // Deferred Reply
        const deferredReply = await interaction.deferReply({
            ephemeral: true,
        });

        // Roles
        const operationalRole = interaction.guild.roles.cache.find(
            (r) => r.name === "Operational"
        );
        const resolvingRole = interaction.guild.roles.cache.find(
            (r) => r.name === "Resolving"
        );
        const distruptionRole = interaction.guild.roles.cache.find(
            (r) => r.name === "Service Disruption"
        );

        // Variables
        const currentTime = moment().tz("America/New_York").format("lll");

        const chosenStatus = interaction.options.getString("status");
        const addedMessage = interaction.options.getString("message");

        let currentText: Array<String> = [];
        let currentStatus: Role;

        // Status Channel
        const statusChannel = await config.findOne({
            key: "status",
        });
        const fetchedStatusChannel = interaction.guild.channels.cache.find(
            (c) => c.id === statusChannel?.value
        );

        // Channel Check
        if (fetchedStatusChannel?.type !== ChannelType.GuildText) {
            return await interaction.editReply("Could not verify channel.");
        }

        // Check Status Key
        switch (chosenStatus) {
            case "1":
                currentStatus = operationalRole;
                fetchedStatusChannel.setName("🟢┃status");
                break;
            case "2":
                currentStatus = resolvingRole;
                fetchedStatusChannel.setName("🟡┃status");
                break;
            case "3":
                currentStatus = distruptionRole;
                fetchedStatusChannel.setName("🔴┃status");
                break;
            default:
                return await interaction.editReply({
                    content:
                        "Failed to set status as the received status couldn't be matched.",
                });
        }

        // Set Status
        currentText.push(`> **Status:** ${currentStatus}`)

        // Set Description
        if (addedMessage) {
            currentText.push(`> **Description:** ${addedMessage}`);
        }

        // Status Embed
        const statusEmbed = new EmbedBuilder()
            .setTitle(`Bot Status - ${currentTime} EST`)
            .setColor(currentStatus.hexColor)
            .setDescription(currentText.join("\n"))
            .setFooter({
                iconURL: interaction.user.avatarURL().replace(".gif", ".png"),
                text: `Sent by @${interaction.user.username}`,
            });

        // Send Status Message
        fetchedStatusChannel.send({
            embeds: [statusEmbed],
        });

        // Edit Reply
        return await interaction.editReply({
            content: `Successfully sent the status message to ${fetchedStatusChannel}!`,
        });
    }
}
