// Dependencies
import marketplace from "../../util/schemas/marketplace/marketplace.js";

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
                .setName("setmarketplace")
                .setDescription("Change a marketplace channel's ID in the configuration.")
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addStringOption((option) =>
                    option
                        .setName("key")
                        .setDescription(
                            "The key that you would like to set a value for."
                        )
                        .addChoices(
                            {
                                name: "Scripter",
                                value: "Scripter",
                            },
                            {
                                name: "Builder",
                                value: "Builder",
                            },
                            {
                                name: "Modeler",
                                value: "Modeler",
                            },
                            {
                                name: "Graphics Artist",
                                value: "Graphics Artist",
                            },
                            {
                                name: "Animator",
                                value: "Animator",
                            },
                            {
                                name: "UI Designer",
                                value: "UI Designer",
                            },
                            {
                                name: "Video Editor",
                                value: "Video Editor",
                            },
                            {
                                name: "Programmer",
                                value: "Programmer",
                            }
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription(
                            "The type of channel you would like to edit."
                        )
                        .addChoices(
                            {
                                name: "Hiring",
                                value: "Hiring",
                            },
                            {
                                name: "For-Hire",
                                value: "For-Hire",
                            }
                        )
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription(
                            "The channel you want to set for the channel."
                        )
                        .addChannelTypes(ChannelType.GuildText)
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
        const editType = interaction.options.getString("type");
        const editChannel = interaction.options.getChannel("channel");

        let selectedMarketplace = await marketplace.findOne({
            name: `${editKey}-${editType}`,
        });

        if (!selectedMarketplace) {
            selectedMarketplace = await marketplace.create({
                name: `${editKey}-${editType}`
            })
        }

        await selectedMarketplace.updateOne({
            channel_id: editChannel.id,
        });
        return await interaction.editReply(
            `Successfully set the channel \`${editKey} ${editType}\` to ${editChannel}.`
        );
    }
}
