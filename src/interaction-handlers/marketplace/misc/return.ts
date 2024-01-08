// Dependencies
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from "@sapphire/framework";
import {
    ButtonInteraction,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js";

export default class extends InteractionHandler {
    constructor(
        ctx: InteractionHandler.LoaderContext,
        options: InteractionHandler.Options
    ) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button,
        });
    }

    parse(interaction: ButtonInteraction) {
        const [category, action] = interaction.customId.split(".");

        if (category !== "marketplace" || action !== "return") return this.none();

        return this.some();
    }

    async run(interaction: ButtonInteraction) {
        // Deferred Updated
        const deferredUpdate = await interaction.deferUpdate();

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
            content: null,
            embeds: [],
            components: [mainActionRow],
        });
    }
}
