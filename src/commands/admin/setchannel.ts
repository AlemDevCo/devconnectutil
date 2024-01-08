// Dependencies
import configuration from "../../util/schemas/config/string.js";

import { Command } from "@sapphire/framework";
import { PermissionFlagsBits, ChannelType } from "discord.js";

// Command
export default class extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("setchannel")
                .setDescription("Change a key's channel in the configuration.")
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addStringOption((option) =>
                    option
                        .setName("key")
                        .setDescription(
                            "The key that you would like to set a value for."
                        )
                        .addChoices(
                            {
                                name: "Mod Logs",
                                value: "modlogs"
                            },
                            {
                                name: "Marketplace Queue",
                                value: "marketplace",
                            },
                            {
                                name: "Status Channel",
                                value: "status",
                            },
                            {
                                name: "Creations Channel",
                                value: "creations",
                            },
                            {
                                name: "QOTD Channel",
                                value: "qotd"
                            },
                            {
                                name: "Help Channel",
                                value: "help"
                            }
                        )
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription(
                            "The channel you want to set for the key."
                        )
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
        const editKey = interaction.options.getString("key");
        const editChannel = interaction.options.getChannel("channel");

        let selectedConfiguration = await configuration.findOne({
            key: editKey,
        });

        if (!selectedConfiguration) {
            selectedConfiguration = await configuration.create({
                key: editKey
            })
        }

        await selectedConfiguration.updateOne({
            value: editChannel.id,
        });
        return await interaction.editReply(
            `Successfully set the key \`${editKey}\` to ${editChannel}.`
        );
    }
}
