import { itemIds } from '@server/world/config/item-ids';
import { itemOnObjectAction } from '@server/world/actor/player/action/item-on-object-action';
import { ActionType, RunePlugin } from '@server/plugins/plugin';
import { widgets } from '@server/world/config/widget';
import { Skill } from '@server/world/actor/skills';
import { itemAction } from '@server/world/actor/player/action/item-action';
import {
    anvilIds,
    barIds,
    Smithable,
    smithables,
    widgetItems
} from '@server/plugins/skills/smithing/smithing-definitions';
import { cache } from '@server/game-server';

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

const mapToFlatArray = (input) => {
    let results = [];
    input.forEach((values) => {
        values.forEach((value) => {
            results.push(value);
        });
    });
    return results;
};

const findSmithableByItemId = (itemId) : Smithable => {
    return mapToFlatArray(smithables).find((smithable) => {
        return smithable.item.itemId === itemId;
    });
};

const smithItem : itemAction = (details) => {
    const { player, option, itemDetails } = details;
    const smithable = findSmithableByItemId(itemDetails.id);
    console.log('Option: ', option);
    console.log('Item: ', itemDetails);
    console.log('Smithable: ', smithable);

    console.log(smithable.ingredient.amount + ` > ` + player.inventory.findAll(smithable.ingredient.itemId).length);
    if (smithable.ingredient.amount > player.inventory.findAll(smithable.ingredient.itemId).length) {
        player.activeWidget = null;
        const bar = cache.itemDefinitions.get(smithable.ingredient.itemId);
        player.sendMessage(`You don't have enough ${bar.name}s.`, true);
        return;
    }

    player.playAnimation(898);
    player.activeWidget = null;
};

const anvilAction : itemOnObjectAction = (details) => {
    const {player, item} = details;
    const amountInInventory = player.inventory.findAll(item).length;

    // The player does not have a hammer.
    if (!player.inventory.has(2347)) {
        player.sendMessage(`You need a hammer to work the metal with.`, true);
        return;
    }

    player.outgoingPackets.updateClientConfig(210, amountInInventory);
    player.outgoingPackets.updateClientConfig(211, player.skills.getLevel(Skill.SMITHING));

    player.activeWidget = {
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
    // @TODO: Figure out how to hide items in smithing widget
    // player.modifyWidget(widgets.anvil.widgetId, { childId: 147, hidden: true });
};


export default new RunePlugin([
    {
        type: ActionType.ITEM_ON_OBJECT_ACTION,
        itemIds: barIds,
        objectIds: anvilIds,
        walkTo: true,
        action: anvilAction
    },
    {
        type: ActionType.ITEM_ACTION,
        itemIds: [...mapWidgetItemsToFlatArray(widgetItems)],
        action: smithItem
    }
])
