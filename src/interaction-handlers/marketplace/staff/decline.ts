// Dependencies
import marketplaceConfig from "../../../util/schemas/marketplace/marketplace.js";
import marketplace from "../../../util/schemas/marketplace/posts.js";

import {
    ButtonInteraction,
    ChannelType,
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

        if (category !== "marketplace" || action !== "decline")
            return this.none();

        return this.some();
    }

    async run(interaction: ButtonInteraction) {
        // Deferred Update
        const deferredUpdate = await interaction.deferUpdate({
            fetchReply: true,
        });

        // Variables
        const [category, action, postid] = interaction.customId.split(".");

        let currentPost = await marketplace.findById(postid);

        // Current Post Check
        if (!currentPost) {
            return await interaction.reply({
                ephemeral: true,
                content: "Cannot find the requested post.",
            });
        }

        // Current Post Check
        if (!currentPost) {
            return await interaction.reply({
                ephemeral: true,
                content: "Cannot find the requested post.",
            });
        }

        // Appropriate Member
        const appropriateMember = interaction.guild.members.cache.find(
            (u) => u.id === currentPost.creator
        );

        // Appropriate Member Check
        if (!appropriateMember) {
            return;
        }

        // Set Post to Declined
        await currentPost.updateOne({
            post_status: "Declined",
            post_reviewer: interaction.user.id
        });

        return await interaction.deleteReply()
    }
}
