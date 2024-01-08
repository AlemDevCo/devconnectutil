// Dependencies
import posts from "../../../util/schemas/marketplace/posts.js";

import {
    InteractionHandler,
    InteractionHandlerTypes,
} from "@sapphire/framework";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import {
    ButtonInteraction,
    ComponentType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js";

export default class extends InteractionHandler {
    constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button,
        });
    }

    parse(interaction: ButtonInteraction) {
        const [category, action] = interaction.customId.split(".");

        if (category !== "marketplace" || action !== "view") return this.none();

        return this.some();
    }

    async run(interaction: ButtonInteraction) {
        // Deferred Update
        const deferredUpdate = await interaction.deferUpdate();

        // Variables
        const newPagination = new PaginatedMessage();

        const userPosts = await posts.find({
            creator: interaction.user.id,
            $or: [{ post_status: "Pending" }, { post_status: "Declined" }, { post_status: "Approved" }],
        }).sort("-post_created");

        // Return Button
        const returnButton = new ButtonBuilder()
            .setCustomId("marketplace.return")
            .setLabel("Return")
            .setStyle(ButtonStyle.Secondary)
        const returnActionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(returnButton)

        // Tickets Check
        if (userPosts.length < 1) {
            return await interaction.editReply({
                content: "You have no marketplace posts",
                components: [returnActionRow],
            });
        }

        newPagination.setActions([
            {
                emoji: "⬅️",
                customId: "x-previous",
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                run: ({ handler }) => {
                    if (handler.index === 0) {
                        handler.index = handler.pages.length - 1;
                    } else {
                        --handler.index;
                    }
                },
            },
            {
                emoji: "➡️",
                customId: "x-next",
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                run: ({ handler }) => {
                    if (handler.index === handler.pages.length - 1) {
                        handler.index = 0;
                    } else {
                        ++handler.index;
                    }
                },
            }
        ]);

        userPosts.forEach(async (post) => {
            newPagination.addAsyncPageEmbed((embed) => {
                let paymentMethods: Array<String> = []

                // Payments Method Check
                if(post.payment_robux) {
                    paymentMethods.push(`**Robux:** R$${post.payment_robux}`)
                }
                if(post.payment_usd) {
                    paymentMethods.push(`**USD:** $${post.payment_usd}`)
                }
                if(post.payment_percentage) {
                    paymentMethods.push(`**Percentage:** ${post.payment_percentage}%`)
                }

                // Other Checks
                if(paymentMethods.length < 1) {
                    paymentMethods.push("N/A")
                }

                // Set Embed
                embed
                    .setTitle(post.title)
                    .setDescription(post.description)
                    .addFields(
                        {
                            name: "Payment",
                            value: paymentMethods.join("\n"),
                            inline: true
                        },
                        {
                            name: "Payment Method",
                            value: post.selected_paymentmethod,
                            inline: true,
                        }
                    )
                    .setFooter({
                        text: `(${post.id})`
                    })

                if(post.post_status === "Declined") {
                    embed.setColor("Red")
                } else if(post.post_status === "Approved") {
                    embed.setColor("Green")
                }

                return embed;
            });
        });

        newPagination.run(interaction);
    }
}
