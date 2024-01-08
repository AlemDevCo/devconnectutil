// Dependencies
import marketplaceConfig from "../../../util/schemas/marketplace/marketplace.js";
import marketplace from "../../../util/schemas/marketplace/posts.js";

import {
    InteractionHandler,
    InteractionHandlerTypes,
} from "@sapphire/framework";
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

        if (category !== "marketplace" || action !== "approve")
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

        let paymentMethods: String = [];
        let currentPost = await marketplace.findById(postid);

        // Appropriate Member
        const appropriateMember = interaction.guild.members.cache.find(
            (u) => u.id === currentPost?.creator
        );

        // Appropriate Channel
        const appropriateChannel = await marketplaceConfig.findOne({
            name: `${currentPost?.selected_role}-${currentPost?.selected_type}`,
        });
        const fetchedAppropriateChannel = interaction.guild.channels.cache.find(
            (c) => c.id === appropriateChannel?.channel_id
        );

        // Current Post Check
        if (!currentPost) {
            return await interaction.followUp({
                ephemeral: true,
                content: "Cannot find the requested post.",
            });
        }

        // Set Post to Approved
        await currentPost.updateOne({
            post_status: "Approved",
            post_reviewer: interaction.user.id,
        });

        // Payment Methods Check
        if (currentPost.payment_robux) {
            paymentMethods.push();
        }
        if (currentPost.payment_usd) {
            paymentMethods.push();
        }
        if (currentPost.payment_percentage) {
            paymentMethods.push();
        }

        // Post Embed
        const postEmbed = new EmbedBuilder()
            .setAuthor({
                name: appropriateMember.user.displayName,
                iconURL: `${appropriateMember?.AURL()}`,
            })
            .setTitle(currentPost.title)
            .setDescription(currentPost.description)
            .addFields(
                {
                    name: "Payment",
                    value: paymentMethods.join("\n"),
                    inline: true,
                },
                {
                    name: "Payment Method",
                    value: currentPost.selected_paymentmethod,
                    inline: true,
                }
            )
            .setColor("Green")
            .setTimestamp();

        // Send Marketplace Post
        appropriateChannel.send({
            content: `${appropriateMember.user}`,
            embeds: [postEmbed],
        });

        return await interaction.deleteReply();
    }
}
