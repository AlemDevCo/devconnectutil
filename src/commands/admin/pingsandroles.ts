// Dependencies
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
                .setName("pingsandroles")
                .setDescription("Send the pings and roles message.")
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
        const channelToSend = interaction.options.getChannel("channel") as TextChannel;

        // Buttons
        const eventPingButton = new ButtonBuilder()
            .setCustomId(`role.eventsPing`)
            .setLabel("Events")
            .setEmoji("📅")
            .setStyle(ButtonStyle.Primary);
        const giveawayPingButton = new ButtonBuilder()
            .setCustomId(`role.giveawaysPing`)
            .setLabel("Giveaways")
            .setEmoji("🎉")
            .setStyle(ButtonStyle.Primary);
        const updatesPingButton = new ButtonBuilder()
            .setCustomId(`role.updatesPing`)
            .setLabel("Updates")
            .setEmoji("🆕")
            .setStyle(ButtonStyle.Primary);

        const applicationsPingButton = new ButtonBuilder()
            .setCustomId(`role.applicationsPing`)
            .setLabel("Applications")
            .setEmoji("📩")
            .setStyle(ButtonStyle.Success);
        const statusPingButton = new ButtonBuilder()
            .setCustomId(`role.statusPing`)
            .setLabel("Status")
            .setEmoji("<:online:1101673198300430356>")
            .setStyle(ButtonStyle.Success);
        const bumpPingButton = new ButtonBuilder()
            .setCustomId(`role.bumpPing`)
            .setLabel("Bump")
            .setEmoji("👊")
            .setStyle(ButtonStyle.Success);

        const qotdPingButton = new ButtonBuilder()
            .setCustomId(`role.qotdPing`)
            .setLabel("QOTD")
            .setEmoji("❓")
            .setStyle(ButtonStyle.Secondary);

        const topAR = new ActionRowBuilder<ButtonBuilder>().addComponents(
            eventPingButton,
            giveawayPingButton,
            updatesPingButton
        );
        const middleAR = new ActionRowBuilder<ButtonBuilder>().addComponents(
            applicationsPingButton,
            statusPingButton,
            bumpPingButton
        );
        const bottomAR = new ActionRowBuilder<ButtonBuilder>().addComponents(
            qotdPingButton
        );

        // Embed
        const parEmbed = new EmbedBuilder()
            .setTitle("💎 Pings and Roles")
            .setDescription(
                "Want to receive pings and other optional roles?\nSelect some by clicking the buttons below!"
            )
            .setColor("#0384fc");

        // Send Embed
        channelToSend.send({
            embeds: [parEmbed],
            components: [topAR, middleAR, bottomAR],
        });

        return await interaction.editReply({
            content: `Successfully sent the ***Pings and Roles*** embed to ${channelToSend}!`,
        });
    }
}
