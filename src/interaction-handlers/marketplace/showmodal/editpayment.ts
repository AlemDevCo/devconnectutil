// Dependencies
import marketplace from "../../../util/schemas/marketplace/posts.js";

import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from "discord.js";

export default class extends InteractionHandler {
    constructor(
        ctx,
        options
    ) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button,
        });
    }

    parse(interaction: ButtonInteraction) {
        const [category, action] = interaction.customId.split(".");

        if (category !== "marketplace" || action !== "editpayment")
            return this.none();

        return this.some();
    }

    async run(interaction: ButtonInteraction) {
        // Variables
        const [category, action, postid] = interaction.customId.split(".");

        let currentPost = await marketplace.findById(postid);

        if (!currentPost) {
            return await interaction.reply({
                ephemeral: true,
                content: "Cannot find the requested post.",
            });
        }

        // Modal
        const editPaymentModal = new ModalBuilder()
            .setCustomId(`marketplace.editpaymentmodal.${currentPost.id}`)
            .setTitle("Edit Post Info");
        const editRobuxField = new TextInputBuilder()
            .setCustomId("robux")
            .setLabel("Robux Payment")
            .setPlaceholder("The amount of Robux you'd like to set.")
            .setMaxLength(10)
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        const editUSDField = new TextInputBuilder()
            .setCustomId("usd")
            .setLabel("USD Payment")
            .setPlaceholder("The amount of USD you'd like to set.")
            .setMaxLength(10)
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        const editPercentageField = new TextInputBuilder()
            .setCustomId("percentage")
            .setLabel("Percentage Payment")
            .setPlaceholder("The percentage you'd like to set.")
            .setMaxLength(2)
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        // Set Default Value
        if (currentPost.payment_robux) {
            editRobuxField.setValue(currentPost.payment_robux);
        }
        if (currentPost.payment_usd) {
            editUSDField.setValue(currentPost.payment_usd);
        }
        if (currentPost.payment_percentage) {
            editPercentageField.setValue(currentPost.payment_percentage);
        }

        // Action Rows
        const editRobuxActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                editRobuxField
            );
        const editUSDActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                editUSDField
            );
        const editPercentageActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                editPercentageField
            );

        editPaymentModal.addComponents(
            editRobuxActionRow,
            editUSDActionRow,
            editPercentageActionRow
        );

        // Send Modal
        await interaction.showModal(editPaymentModal);
    }
}
