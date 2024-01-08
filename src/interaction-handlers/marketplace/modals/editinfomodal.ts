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

        if (category !== "marketplace" || action !== "editinfomodal")
            return this.none();

        return this.some();
    }

    async run(interaction: ModalSubmitInteraction) {
        // Variables
        const [category, action, postid] = interaction.customId.split(".");

        const postTitle = interaction.fields.getTextInputValue("title");
        const postDescription =
            interaction.fields.getTextInputValue("description");

        let currentPost = await marketplace.findById(postid);

        if (!currentPost) {
            return await interaction.reply({
                ephemeral: true,
                content: "Cannot find the requested post.",
            });
        }

        // Attempt Value Update
        await currentPost.updateOne({
            title: postTitle,
            description: postDescription,
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
