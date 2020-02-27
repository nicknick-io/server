import { incomingPacket } from '../incoming-packet';
import { Player } from '../../world/actor/player/player';
import { RsBuffer } from '@server/net/rs-buffer';
import { logger } from '@runejs/logger/dist/logger';
import { widgetIds } from '../../world/config/widget';
import { dropItemAction } from '@server/world/actor/player/action/drop-item-action';

export const dropItemPacket: incomingPacket = (player: Player, packetId: number, packetSize: number, packet: RsBuffer): void => {
    const widgetId = packet.readUnsignedShortLE();
    const containerId = packet.readUnsignedShortLE();
    const slot = packet.readNegativeOffsetShortBE();
    const itemId = packet.readUnsignedShortLE();

    if(widgetId !== widgetIds.inventory.widgetId || containerId !== widgetIds.inventory.containerId) {
        logger.warn(`${player.username} attempted to drop item from incorrect widget id ${widgetId}.`);
        return;
    }

    if(slot < 0 || slot > 27) {
        logger.warn(`${player.username} attempted to drop item ${itemId} in invalid slot ${slot}.`);
        return;
    }

    const itemInSlot = player.inventory.items[slot];

    if(!itemInSlot) {
        logger.warn(`${player.username} attempted to drop item ${itemId} in slot ${slot}, but they do not have that item.`);
        return;
    }

    if(itemInSlot.itemId !== itemId) {
        logger.warn(`${player.username} attempted to drop item ${itemId} in slot ${slot}, but ${itemInSlot.itemId} was found there instead.`);
        return;
    }

    dropItemAction(player, itemInSlot, slot);
};