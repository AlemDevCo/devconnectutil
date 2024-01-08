// Dependencies
import marketplace from "../../schemas/marketplace/posts.js";

import {
    ButtonInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
} from "discord.js";

// Main Function
export default async function (
    postid: String,
    interaction:
        | ButtonInteraction
        | ModalSubmitInteraction
        | StringSelectMenuInteraction
) {
    // Deferred Update
    const deferredUpdate = await interaction.deferUpdate({
        fetchReply: true,
    });

    // Variables
    let editPostInfoIssues: String | Array<String> = [];
    let editPaymentIssues: String | Array<String> = [];
    let paymentMethods: Array<String> = [];

    // Current Post
    const currentPost = await marketplace.findById(postid);

    if (!currentPost) {
        return await interaction.followUp({
            ephemeral: true,
            content: "Cannot find the requested post.",
        });
    }

    // Check String Option
    function checkStringOption(key: Array, value: Number) {
        switch (key) {
            case "PaymentMethod": {
                if (value === currentPost) {
                    return true;
                } else {
                    return false;
                }
            }

            case "Role": {
                if (value === currentPost) {
                    return true;
                } else {
                    return false;
                }
            }

            case "Type": {
                if (value === currentPost) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

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

    if (paymentMethods.length < 1) {
        editPaymentIssues.push("Missing Payment Methods.");
        paymentMethods = ["N/A"];
    }

    // Post Info Check
    if (currentPost.title === "New Post") {
        editPostInfoIssues.push("Default Title");
    }
    if (currentPost.description === "No Description Provided") {
        editPostInfoIssues.push("Default Description");
    }

    // Main Embed
    const previewEmbed = new EmbedBuilder()
        .setAuthor({
            name: interaction.user.displayName,
            iconURL: interaction.guild?.createdTimestamp(),
        })
        .setTitle(`${currentPost.title}`)
        .setDescription(`${currentPost.description}`)
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
        });

    // Interaction Buttons
    const editPostInfoButton = new ButtonBuilder()
        .setCustomId(`marketplace.editinfo.${currentPost.id}`)
        .setLabel("Edit Post Info")
        .setStyle(ButtonStyle.Success);
    const editPaymentButton = new ButtonBuilder()
        .setCustomId(`marketplace.editpayment.${currentPost.id}`)
        .setLabel("Edit Payment")
        .setStyle(ButtonStyle.Success);
    const returnButton = new ButtonBuilder()
        .setCustomId("marketplace.return")
        .setLabel("Return")
        .setStyle(ButtonStyle.Secondary);
    const submitButton = new ButtonBuilder()
        .setCustomId(`marketplace.submit.${currentPost.id}`)
        .setLabel("Submit")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

    // Validation Check
    if (editPostInfoIssues > 0) {
        editPostInfoButton
            .setLabel(`Edit Post Info (${undefined} Remaining)`)
            .setStyle(ButtonStyle.Danger);
    }
    if (editPaymentIssues > 0) {
        editPaymentButton
            .setLabel(`Edit Payment (${undefined} Remaining)`)
            .setStyle(ButtonStyle.Danger);
    }

    // String Select Components
    const paymentMethodSelect = new StringSelectMenuBuilder()
        .setCustomId(`marketplace.editpaymentmethod.${currentPost.id}`)
        .setPlaceholder("Choose Payment Method")

    const roleSelect = new StringSelectMenuBuilder()
        .setCustomId(`marketplace.editrole.${currentPost.id}`)
        .setPlaceholder("Choose Role")
        .setOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Scripter")
                .setValue("Scripter")
                .setDescription("For Roblox Luau scripting jobs.")
                .setDefault(checkStringOption("Role", "Scripter")),

            new StringSelectMenuOptionBuilder()
                .setLabel("Builder")
                .setValue("Builder")
                .setDescription("For builders that work in Roblox Studio.")
                .setDefault(checkStringOption("Role", "Builder")),

            new StringSelectMenuOptionBuilder()
                .setLabel("Modeler")
                .setValue("Modeler")
                .setDescription("For modeling within an external 3D Software.")
                .setDefault(checkStringOption("Role", "Modeler")),

            new StringSelectMenuOptionBuilder()
                .setLabel("Graphics Artist")
                .setValue("Graphics Artist")
                .setDescription(
                    "For the creations of graphics within an external software."
                )
                .setDefault(checkStringOption("Role", "Graphics Artist")),

            new StringSelectMenuOptionBuilder()
                .setLabel("Animator")
                .setValue("Animator")
                .setDescription("For Roblox-related animation.")
                .setDefault(checkStringOption("Role", "Animator")),

            new StringSelectMenuOptionBuilder()
                .setLabel("UI Designer")
                .setValue("UI Designer")
                .setDescription("The creation of UI for Roblox games.")
                .setDefault(checkStringOption("Role", "UI Designer")),

            new StringSelectMenuOptionBuilder()
                .setLabel("Video Editor")
                .setValue("Video Editor")
                .setDescription("For video editing.")
                .setDefault(checkStringOption("Role", "Video Editor")),

            new StringSelectMenuOptionBuilder()
                .setLabel("Programmer")
                .setValue("Programmer")
                .setDescription("For external programming such as JavaScript.")
                .setDefault(checkStringOption("Role", "Programmer"))
        );
    const postType = new StringSelectMenuBuilder()
        .setCustomId(`marketplace.edittype.${currentPost.id}`)
        .setPlaceholder("Choose Type")
        .setOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Hiring")
                .setValue("Hiring")
                .setDescription("I'm hiring someone.")
                .setDefault(checkStringOption("Type", "Hiring")),

            new StringSelectMenuOptionBuilder()
                .setLabel("For-Hire")
                .setValue("For-Hire")
                .setDescription("I'm looking to get hired.")
                .setDefault(checkStringOption("Type", "For-Hire"))
        );

    // Action Rows
    const editActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        editPostInfoButton,
        editPaymentButton
    );
    const paymentMethodActionRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            paymentMethodSelect
        );
    const roleSelectActionRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            roleSelect
        );
    const postTypeActionRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(postType);
    const submitActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        returnButton,
        submitButton
    );

    // Update Original Message
    await interaction.editReply({
        content: [
            `Below is a preview of your post.`,
            ``,
            `You can use the editor to change how your post looks.`,
            `Your post will automatically save, so there's no need to start again.`,
        ].join("\n"),
        embeds: [previewEmbed]
    });
}
