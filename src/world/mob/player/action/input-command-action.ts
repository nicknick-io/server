import { Player } from '../player';
import { logger } from '@runejs/logger/dist/logger';
import { world } from '@server/game-server';
import { interfaceIds } from '../game-interface';
import { closeDialogue, dialogueAction, DialogueEmote } from '@server/world/mob/player/action/dialogue/dialogue-action';

type commandHandler = (player: Player, args?: string[]) => void;

const commands: { [key: string]: commandHandler } = {

    pos: (player: Player) => {
        player.packetSender.chatboxMessage(`@[ ${player.position.x}, ${player.position.y}, ${player.position.level} ]`);
    },

    move: (player: Player, args: string[]) => {
        if(args.length < 2 || args.length > 3) {
            throw `move x y [level]`;
        }

        const x: number = parseInt(args[0], 10);
        const y: number = parseInt(args[1], 10);
        let level: number = 0;

        if(args.length === 3) {
            level = parseInt(args[2]);
        }

        if(isNaN(x) || isNaN(y) || isNaN(level)) {
            throw `move x y [level]`;
        }

        const oldChunk = world.chunkManager.getChunkForWorldPosition(player.position);

        player.position.move(x, y, level);

        const newChunk = world.chunkManager.getChunkForWorldPosition(player.position);

        if(!oldChunk.equals(newChunk)) {
            oldChunk.removePlayer(player);
            newChunk.addPlayer(player);
            player.packetSender.updateCurrentMapChunk();
        }

        player.updateFlags.mapRegionUpdateRequired = true;
    },

    give: (player: Player, args: string[]) => {
        if(args.length !== 1) {
            throw `give itemId`;
        }

        const inventorySlot = player.inventory.getFirstOpenSlot();

        if(inventorySlot === -1) {
            player.packetSender.chatboxMessage(`You don't have enough free space to do that.`);
            return;
        }

        const itemId: number = parseInt(args[0]);

        if(isNaN(itemId)) {
            throw `give itemId`;
        }

        const item = { itemId, amount: 1 };
        player.inventory.add(item);
        player.packetSender.sendUpdateSingleInterfaceItem(interfaceIds.inventory, inventorySlot, item);
        player.packetSender.chatboxMessage(`Adding 1x ${world.itemData.get(itemId).name} to inventory.`);
    },

    chat: (player: Player) => {
        dialogueAction(player, { type: 'NPC', emote: DialogueEmote.CALM_TALK_1, npc: 0, lines: [ 'Welcome to RuneScape!' ] })
            .then(() => dialogueAction(player, { type: 'NPC', emote: DialogueEmote.CALM_TALK_2, npc: 0, lines: [ 'How do you feel about Rune.JS so far?', 'Let us know what you think!' ] }))
            .then(() => closeDialogue(player));
    }

};

export const inputCommandAction = (player: Player, command: string, args: string[]): void => {
    if(commands.hasOwnProperty(command)) {
        try {
            commands[command](player, args);
        } catch(invalidSyntaxError) {
            player.packetSender.chatboxMessage(`Invalid command syntax, try ::${invalidSyntaxError}`);
        }
    } else {
        logger.info(`Unhandled command ${command} with arguments ${JSON.stringify(args)}.`);
    }
};
