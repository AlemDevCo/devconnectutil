// Dependencies
import marketplace from "../../../util/schemas/marketplace/posts.js";

import marketplaceReset from "../../../util/modules/embeds/marketplace-preview.js";

import {
    InteractionHandler,
    InteractionHandlerTypes,
} from "@sapphire/framework";
import {
    StringSelectMenuInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
} from "discord.js";

export default class extends InteractionHandler {
    constructor(
        ctx: InteractionHandler.LoaderContext,
        options: InteractionHandler.Options
    ) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.SelectMenu,
        });
    }

    parse(interaction: StringSelectMenuInteraction) {
        const [category, action] = interaction.customId.split(".");

        if (category !== "marketplace" || action !== "edittype")
            return this.none();

        return this.some();
    }

    async run(interaction: StringSelectMenuInteraction) {
        // Variables
        const newType = interaction.values[0];
        const [category, action, postid] = interaction.customId.split(".");

        let currentPost = await marketplace.findById(postid);

        if (!currentPost) {
            return await interaction.reply({
                ephemeral: true,
                content: "Cannot find the requested post.",
            });
        }

        // Attempt Value Update
        await currentPost.updateOne({
            selected_type: newType,
        });

        // Attempt Embed Reset
        try {
            await marketplaceReset(postid, interaction);
        } catch (e) {
            return await interaction.reply({
                ephemeral: true,
                content: "Failed to reset preview embed.",
            });
        }
    }
}
