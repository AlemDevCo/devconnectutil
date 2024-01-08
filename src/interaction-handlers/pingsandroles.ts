// Dependencies
import Configuration from "../util/schemas/config/string.js";

import {
    InteractionHandler,
    InteractionHandlerTypes,
} from "@sapphire/framework";
import { ButtonInteraction, EmbedBuilder } from "discord.js";

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
        const [action, role] = interaction.customId.split(".");

        if (action !== "role") return this.none();

        return this.some();
    }

    async run(interaction: ButtonInteraction) {
        // Deferred Reply
        const deferredReply = await interaction.deferReply({
            ephemeral: true,
        });

        // Variables
        const [action, role] = interaction.customId.split(".");
        const member = interaction.guild.members.cache.get(interaction.user.id);
        
        const selectedRole = await Configuration.findOne({
            key: `${role}-ROLE`,
        });
        const fetchedSelectedRole = interaction.guild.roles.cache.find(
            (r) => r.id === selectedRole?.value
        );

        // If Role not Found
        if (!selectedRole || !fetchedSelectedRole) {
            return await interaction.editReply({
                content: "The selected optional role doesn't exist.",
            });
        }

        // Check User has Role
        if (member.roles.cache.has(fetchedSelectedRole.id)) {
            await member.roles.remove(fetchedSelectedRole);

            return await interaction.editReply({
                content: `The ${fetchedSelectedRole} role has been successfully removed.`,
            });
        } else {
            await member.roles.add(fetchedSelectedRole);

            return await interaction.editReply({
                content: `The ${fetchedSelectedRole} role has been successfully added.`,
            });
        }
    }
}
