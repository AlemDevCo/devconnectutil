// Dependencies
import marketplace from "../../util/schemas/marketplace/posts.js";

import {
    ButtonInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
} from "discord.js";

export default class extends InteractionHandler {
    parse(interaction: ButtonInteraction) {
        const [category, action] = interaction.customId.split(".");

        if (category !== "marketplace" || action !== "create")
            return this.none();

        return this.some();
    }

    async run(interaction: ButtonInteraction) {
        // Variables
        let currentPost = await marketplace.findOne({
            creator: interaction.user.id,
            post_status: "Draft",
        });

        // Current Post Check
        if (!currentPost) {
            currentPost = await marketplace.create({
                creator: interaction.user.id,

                post_status: "Draft",

                selected_paymentmethod: "Upfront",

                title: "New Post",
                description: "No Description Provided",
            });
        }

        // Attempt Embed Reset
        try {
            await marketplaceReset(currentPost.id, interaction);
        } catch (e) {
            return await interaction.reply({
                ephemeral: true,
                content: "Failed to reset preview embed.",
            });
        }
    }
}
