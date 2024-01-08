// Dependencies
import { Command } from "@sapphire/framework";
import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

// Command
export default class extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName("post").setDescription("Marketplace post management.")
        );
    }

    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        // Deferred Reply
        const deferredReply = await interaction.deferReply({
            ephemeral: true,
        });

        // Buttons
        const viewButton = new ButtonBuilder()
            .setCustomId(`marketplace.view`)
            .setLabel("View Posts")
            .setStyle(ButtonStyle.Success);
        const createButton = new ButtonBuilder()
            .setCustomId(`marketplace.create`)
            .setLabel("Create Post")
            .setStyle(ButtonStyle.Primary);

        const mainActionRow =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                viewButton,
                createButton
            );

        // Send Reply
        return await interaction.editReply({
            components: [mainActionRow],
        });
    }
}
