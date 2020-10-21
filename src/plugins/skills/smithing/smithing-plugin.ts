import { itemIds } from '@server/world/config/item-ids';
import { itemOnObjectAction } from '@server/world/actor/player/action/item-on-object-action';
import { ActionType, RunePlugin } from '@server/plugins/plugin';
import { widgets } from '@server/world/config/widget';
import { Skill } from '@server/world/actor/skills';
import { itemAction } from '@server/world/actor/player/action/item-action';
import { anvilIds, barIds, smithables, widgetItems } from '@server/plugins/skills/smithing/smithing-definitions';

/**
 * Flatten the widget items to a flat array.
 * @param input
 */
const mapWidgetItemsToFlatArray = (input) => {
    let result = [];
    smithables.forEach((type) => {
        type.forEach((smithable) => {
            result.push(smithable.item.itemId);
        });
    });
    return result;
};


const optionClicked : itemAction = (details) => {
    const { option, itemSlot, itemDetails } = details;
    console.log('Option: ', option);
    console.log('Slot: ', itemSlot);
    console.log('Item: ', itemDetails);
};

const anvilAction : itemOnObjectAction = (details) => {
    const {player, item} = details;
    const amountInInventory = player.inventory.findAll(item).length;

    player.outgoingPackets.updateClientConfig(210, amountInInventory);
    player.outgoingPackets.updateClientConfig(211, player.skills.getLevel(Skill.SMITHING));

    details.player.activeWidget = {
        type: 'SCREEN',
        widgetId: widgets.anvil.widgetId,
    };

    widgetItems.get(item.itemId).forEach((items, containerId) => {
        items.forEach((smithable, index) => {
            player.outgoingPackets.sendUpdateSingleWidgetItem({
                widgetId: widgets.anvil.widgetId, containerId: containerId
            }, index, smithable.item);
        });
    });

    player.modifyWidget(widgets.anvil.widgetId, { childId: 147, hidden: true });
};


export default new RunePlugin([
    {
        type: ActionType.ITEM_ON_OBJECT_ACTION,
        itemIds: barIds,
        objectIds: anvilIds,
        action: anvilAction
    },
    {
        type: ActionType.ITEM_ACTION,
        itemIds: [...mapWidgetItemsToFlatArray(widgetItems)],
        action: optionClicked
    }
])
