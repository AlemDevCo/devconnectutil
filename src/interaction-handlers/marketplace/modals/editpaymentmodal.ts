// Dependencies
import marketplace from "../../../util/schemas/marketplace/posts.js";

import marketplaceReset from "../../../util/modules/embeds/marketplace-preview.js";

import {
    InteractionHandler,
    InteractionHandlerTypes,
} from "@sapphire/framework";
import { ModalSubmitInteraction } from "discord.js";

export default class extends InteractionHandler {
    constructor(
        ctx: InteractionHandler.LoaderContext,
        options: InteractionHandler.Options
    ) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
        });
    }

    parse(interaction: ModalSubmitInteraction) {
        const [category, action] = interaction.customId.split(".");

        if (category !== "marketplace" || action !== "editpaymentmodal")
            return this.none();

        return this.some();
    }

    async run(interaction: ModalSubmitInteraction) {
        // Variables
        const [category, action, postid] = interaction.customId.split(".");

        let robuxAmount: String | null =
            interaction.fields.getTextInputValue("robux");
        let usdAmount: String | null =
            interaction.fields.getTextInputValue("usd");
        let percentageAmount: String | null =
            interaction.fields.getTextInputValue("percentage");

        let currentPost = await marketplace.findById(postid);

        if (!currentPost) {
            return await interaction.reply({
                ephemeral: true,
                content: "Cannot find the requested post.",
            });
        }

        // Value Number Checks
        if (isNaN(robuxAmount as any)) {
            robuxAmount = null;
        }
        if (isNaN(usdAmount as any)) {
            usdAmount = null;
        }
        if (isNaN(percentageAmount as any)) {
            percentageAmount = null;
        }

        // Check Values
        if (robuxAmount) {
            await currentPost.updateOne({ payment_robux: robuxAmount });
        }
        if (usdAmount) {
            await currentPost.updateOne({ payment_usd: usdAmount });
        }
        if (percentageAmount) {
            await currentPost.updateOne({
                payment_percentage: percentageAmount,
            });
        }

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
