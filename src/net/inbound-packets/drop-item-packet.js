import { itemAction } from '../../world/actor/player/action/item-action';

const dropItemPacket = (player, packet) => {
    const { buffer } = packet;
    const widgetId = buffer.get('SHORT', 'UNSIGNED', 'LITTLE_ENDIAN');
    const containerId = buffer.get('SHORT', 'UNSIGNED', 'LITTLE_ENDIAN');
    const slot = buffer.get('SHORT', 'UNSIGNED');
    const itemId = buffer.get('SHORT', 'UNSIGNED', 'LITTLE_ENDIAN');

    itemAction(player, itemId, slot, widgetId, containerId, 'drop');
};

export default {
    opcode: 29,
    size: 8,
    handler: dropItemPacket
};
