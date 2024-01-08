// Dependencies
import marketplace from "../../../util/schemas/marketplace/posts.js";

import {
    ButtonInteraction,
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

    parse(interaction) {
        const [category, action] = interaction.customId.split(".");

        if (category !== "marketplace" || action !== "editinfo")
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
                content: "Cannot find the requested post."
            });
        }

        // Modal
        const editInfoModal = new ModalBuilder()
            .setCustomId(`marketplace.editinfomodal.${currentPost.id}`)
            .setTitle("Edit Post Info");
        const editTitleField = new TextInputBuilder()
            .setCustomId("title")
            .setLabel("Title")
            .setPlaceholder("Briefly describe your post here.")
            .setMinLength(4)
            .setMaxLength(80)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const editDescriptionField = new TextInputBuilder()
            .setCustomId("description")
            .setLabel("Description")
            .setPlaceholder("Describe your post here. Be extra descriptive!")
            .setMinLength(20)
            .setMaxLength(600)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        // Set Default Value
        if(currentPost.title !== "New Post") {
            editTitleField.setValue(currentPost.title)
        }
        if(currentPost.description !== "No Description Provided") {
            editDescriptionField.setValue(currentPost.description)
        }

        // Action Rows
        const editTitleActionRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(editTitleField)
        const editDescriptionActionRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(editDescriptionField)

        editInfoModal.addComponents(editTitleActionRow, editDescriptionActionRow)

        // Send Modal
        await interaction.showModal(editInfoModal)
    }
}
