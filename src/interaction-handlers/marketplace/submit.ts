// Dependencies
import Configuration from "../../util/schemas/config/string.js";
import marketplaceConfig from "../../util/schemas/marketplace/marketplace.js";
import marketplace from "../../util/schemas/marketplace/posts.js";

import moment from "moment";

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

        if (category !== "marketplace" || action !== "submit")
            return this.none();

        return this.some();
    }

    async run(interaction: ButtonInteraction) {
        try {
            // Deferred Update
            const deferredUpdate = await interaction.deferUpdate({
                fetchReply: true,
            });

            // Variables
            const timestamp = moment().unix();
            const [category, action, postid] = interaction.customId.split(".");

            let paymentMethods: Array<String> = [];
            let currentPost = await marketplace.findById(postid);

            // Marketplace Channel
            const marketplaceQueueChannel = await Configuration.findOne({
                key: "marketplace",
            });
            const fetchedMarketplaceQueueChannel =
                interaction.guild.channels.cache.find(
                    (c) => c.id === marketplaceQueueChannel?.value
                );

            if (!marketplaceQueueChannel || !fetchedMarketplaceQueueChannel) {
                return await interaction.reply({
                    ephemeral: true,
                    content:
                        "Failed to find Marketplace key channel. Please contact `qvgk`.",
                });
            }

            // Current Post Check
            if (!currentPost) {
                return await interaction.followUp({
                    ephemeral: true,
                    content: "Cannot find the requested post.",
                });
            }

            // Marketplace Queue Check
            if (
                !fetchedMarketplaceQueueChannel ||
                fetchedMarketplaceQueueChannel.type !== ChannelType.GuildText
            ) {
                return await interaction.reply({
                    ephemeral: true,
                    content: "Failed to find queue key.",
                });
            }

            // Set Post to Pending
            await currentPost.updateOne({
                post_status: "Pending",
                post_created: `${timestamp}`,
            });

            // Payment Methods Check
            if (currentPost.payment_robux) {
                paymentMethods.push(
                    `**Robux:** R$${currentPost.payment_robux}`
                );
            }
            if (currentPost.payment_usd) {
                paymentMethods.push(`**USD:** $${currentPost.payment_usd}`);
            }
            if (currentPost.payment_percentage) {
                paymentMethods.push(
                    `**Percentage:** ${currentPost.payment_percentage}%`
                );
            }

            // Reviewing Embed
            const reviewEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `@${interaction.user.username} (${interaction.user.id})`,
                    iconURL: interaction.user
                        .avatarURL()
                        .replace(".gif", ".png"),
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
                .setFooter({
                    text: `Post ID: ${currentPost.id}`,
                })
                .setColor("Grey")
                .setTimestamp();

            // Button Components
            const declineButton = new ButtonBuilder()
                .setCustomId(`marketplace.decline.${currentPost.id}`)
                .setLabel("Decline")
                .setStyle(ButtonStyle.Danger);
            const approveButton = new ButtonBuilder()
                .setCustomId(`marketplace.approve.${currentPost.id}`)
                .setLabel("Approve")
                .setStyle(ButtonStyle.Success);
            const managementActionRow =
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    declineButton,
                    approveButton
                );

            fetchedMarketplaceQueueChannel.send({
                content: [
                    `Please review the following post:`,
                    ``,
                    `**Selected Role:** \`${currentPost.selected_role}\``,
                    `**Selected Type:** \`${currentPost.selected_type}\``,
                ].join("\n"),
                embeds: [reviewEmbed],
                components: [managementActionRow],
            });

            // Return Response
            return await interaction.editReply({
                content: "Post successfully submitted.",
                embeds: [],
                components: [],
            });
        } catch (e) {
            return await interaction.user.send(
                `${interaction.user}, sorry but I failed to submit your post. Please ensure you're running this command in the server and try again.`
            );
        }
    }
}
