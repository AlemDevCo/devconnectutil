// Dependencies
import dedent from "dedent";
import { Command } from "@sapphire/framework";
import {
    PermissionFlagsBits,
    ChannelType,
    TextChannel,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} from "discord.js";

// Command
export default class extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("rulesandinfo")
                .setDescription("Send the server rules and info message.")
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to send the message.")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        );
    }

    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        // Deferred Reply
        const deferredReply = await interaction.deferReply({
            ephemeral: true,
        });

        // Variables
        const channelToSend = interaction.options.getChannel(
            "channel"
        ) as TextChannel;
        const embedColour = "#0384fc"; // Normal: #0384fc // Halloween: #ff5a00

        // Embeds
        const embedStart = new EmbedBuilder()
            .setTitle("📖 Server Rules and Information")
            .setColor(embedColour)
            .setDescription(
                dedent`
                    Welcome to DevConnect! We're a community focused on Roblox development.

                    In order to keep the community in good standing, we have rules that you're required to follow. Please ensure that you review these rules to avoid receiving any punishments.
                `
            );
        const embedOne = new EmbedBuilder()
            .setTitle("💬 Section 1 - Chatting")
            .setColor(embedColour)
            .setDescription(
                dedent`
                    <:online:1101673198300430356> Respect everyone in the server.
                    <:online:1101673198300430356> Only speak English.
                `
            )
            .addFields(
                {
                    name: "🚫 INAPPROPRIATE CONVERSATIONS",
                    value: dedent`
                        <:online:1101673198300430356> No swearing.
                        <:online:1101673198300430356> No bullying.
                        <:online:1101673198300430356> No racism, transphobia, homophobia, or harassment.
                        <:online:1101673198300430356> No talking about illegal activities or items. (Drugs, Crime, Etc.)
                        <:online:1101673198300430356> No NSFW. (Sex, Pornography, Etc.)
                        <:online:1101673198300430356> No provoking.
                        <:online:1101673198300430356> No encouraging suicide.
                    `,
                },
                {
                    name: "🕵️ IMPERSONATION",
                    value: dedent`
                        <:online:1101673198300430356> Pretending to be another Roblox user.
                        <:online:1101673198300430356> Claiming to be a certain role in a company, or other server to get a role.
                        <:online:1101673198300430356> Claiming ownership of work that is not yours.
                    `,
                },
                {
                    name: "💸 ADVERTISING",
                    value: "*Advertising is strictly forbidden here. This is due to us having another server dedicated to it. You can join it by clicking [here](https://discord.gg/Bm9sD9f9bm).*",
                },
                {
                    name: "🛠️ MINI MODDING",
                    value: dedent`
                        We don't want mini-mods in our server. We have moderators for that. 
                        We'd be glad to have you on our team but you'll have to wait for the next time moderator applications open!
                    `,
                }
            );
        const embedTwo = new EmbedBuilder()
            .setTitle("💰 Section 2 - Marketplace + Deals")
            .setColor(embedColour)
            .setDescription(
                dedent`
                    **You're scamming if you;**
                    <:online:1101673198300430356> Don't complete your side of the original deal.
                    <:online:1101673198300430356> Sell stolen/plagarised assets without permission from the original owner.
                    <:online:1101673198300430356> Change the deal without consent from the other user.

                    ***If you were scammed, open a support ticket by clicking the button below and we'll do our best to assist you.***
                `
            );
        const embedThree = new EmbedBuilder()
            .setTitle("📙 Section 3 - Forum Channels")
            .setColor(embedColour)
            .setDescription(
                dedent`
                    We have forum channels for developers to hire, get hired, sell, and get development help.
                    Although, we have some guidelines you must follow.

                    **Global Rules**
                    <:online:1101673198300430356> [Don't ask to ask.](https://dontasktoask.com/)
                    <:online:1101673198300430356> Use of AI work is strictly forbidden.
                    <:online:1101673198300430356> Your post must primarily be related to Roblox.
                    <:online:1101673198300430356> Your post must be in English (same as \`Section 1 Point 2\`).

                    **Development Help**
                    <:online:1101673198300430356> No spoon-feeding.
                    <:online:1101673198300430356> Keep your post title descriptive.
                    <:online:1101673198300430356> Any criticism must be constructive.
                    <:online:1101673198300430356> You post must include your issue, and possible causes (if you have any).

                    **Hiring/For Hire**
                    <:online:1101673198300430356> Your post must be formatted, and easily readable.
                    <:online:1101673198300430356> Additional messages must be related to the job post.

                    **Selling**
                    <:online:1101673198300430356> You must have created what you're selling. This includes no reselling.
                    <:online:1101673198300430356> No criticism in these channels.
                `
            );
        const embedFour = new EmbedBuilder()
            .setTitle("⭐ Section 4 - Creations")
            .setColor(embedColour)
            .setDescription(
                dedent`
                    <:online:1101673198300430356> Your creations must be SFW (Safe for Work).
                    <:online:1101673198300430356> Your creations must be created by you.
                    <:online:1101673198300430356> AI creations are strictly prohibited.
                    <:online:1101673198300430356> Your creation must be primarily related to Roblox, and an image.

                    ***These rules are incredibly strict, and will result in a "harsh" punishment if any of these are broken. We take creations seriously.***
                `
            );
        const embedFive = new EmbedBuilder()
            .setTitle("🗣️ Section 5 - Voice Chatting")
            .setColor(embedColour)
            .setDescription(
                dedent`
                    <:online:1101673198300430356> Don't ear-rape.
                    <:online:1101673198300430356> The same rules above apply to Voice Channels as-well.
                    <:online:1101673198300430356> Voice changers are allowed unless used to be loud/annoying.

                    ***Please contact staff immediately if you witness a user committing one of these events.***
                `
            );
        const embedSix = new EmbedBuilder()
            .setTitle("👤 Section 6 - Profiles")
            .setColor(embedColour)
            .setDescription(
                dedent`
                    <:online:1101673198300430356> No inappropriate usernames.
                    <:online:1101673198300430356> No inappropriate profile pictures.
                    <:online:1101673198300430356> No flashing profile pictures that could trigger epilepsy.

                    We take this incredibly seriously. If you're found breaking any of these rules you'll be punished swiftly, and harshly.
                `
            );
        const embedSeven = new EmbedBuilder()
            .setTitle("❓ Section 7 - Support")
            .setColor(embedColour)
            .setDescription(
                dedent`
                    **Appeals:**
                    Create a ticket in the support channel if you want to appeal for a warning, mute, timeout, or other moderation.

                    **Reporting Staff Member:**
                    Create a ticket in the support channel if you want to report a staff member for anything against the rules or other reasons.

                    **Scamming:**
                    Please view our "Marketplace + Deals" section above.
                `
            );
        const embedEnd = new EmbedBuilder().setColor(embedColour).setImage(
            "https://media.discordapp.net/attachments/1058261253933514762/1068296063267655780/New_Project_55.png" // Original: https://media.discordapp.net/attachments/1058261253933514762/1068296063267655780/New_Project_55.png // Halloween: https://media.discordapp.net/attachments/1162960103079682058/1164431570833256478/DevConnect_Halloween_Large_Banner.png
        );

        channelToSend.send({
            embeds: [
                embedStart,
                embedOne,
                embedTwo,
                embedThree,
                embedFour,
                embedFive,
                embedSix,
            ],
        });

        return await interaction.editReply({
            content: `Successfully sent the ***Rules and Information*** embeds to ${channelToSend}!`,
        });
    }
}
