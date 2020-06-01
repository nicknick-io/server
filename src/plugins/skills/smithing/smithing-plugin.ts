import { itemIds } from '@server/world/config/item-ids';
import { Item } from '@server/world/items/item';
import { itemOnObjectAction } from '@server/world/actor/player/action/item-on-object-action';
import { ActionType, RunePlugin } from '@server/plugins/plugin';
import { widgets } from '@server/world/config/widget';
import { Skill } from '@server/world/actor/skills';

interface Bar {
    id: number;
    name: string;
}

interface Smithable {
    bar: Bar;
    item: Item;
    count: number;
    ingredient: Item;
    takesInput: boolean;
}

const anvilIds: number[] = [2782, 2783, 4306, 6150];

const BRONZE : Bar = { id: itemIds.bronzeBar, name: 'Bronze' };
const BLURITE : Bar = { id: itemIds.bluriteBar, name: 'Blurite' };
const IRON : Bar = { id: itemIds.ironBar, name: 'Iron' };
const SILVER : Bar = { id: itemIds.silverBar, name: 'Silver' };
const STEEL : Bar = { id: itemIds.steelBar, name: 'Steel' };
const MITHRIL : Bar = { id: itemIds.mithrilBar, name: 'Mithril' };
const ADAMANTITE : Bar = { id: itemIds.adamantiteBar, name: 'Adamant' };
const RUNITE : Bar = { id: itemIds.runiteBar, name: 'Rune' };

const bars : Bar[] = [BRONZE, BLURITE, IRON, SILVER, STEEL, MITHRIL, ADAMANTITE, RUNITE];

const widgetItems : Map<number, Map<number, Item[]>> = new Map<number, Map<number, Item[]>>([
    [itemIds.bronzeBar, new Map<number, Item[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            { itemId: itemIds.bronzeDagger, amount: 1 },
            { itemId: itemIds.bronzeSword, amount: 1 },
            { itemId: itemIds.bronzeScimitar, amount: 1 },
            { itemId: itemIds.bronzeLongsword, amount: 1 },
            { itemId: itemIds.bronzeTwoHand, amount: 1}
        ]],

        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            { itemId: itemIds.bronzeAxe, amount: 1 },
            { itemId: itemIds.bronzeMace, amount: 1 },
            { itemId: itemIds.bronzeWarhammer, amount: 1 },
            { itemId: itemIds.bronzeBattleAxe, amount: 1 },
            { itemId: itemIds.bronzeClaws, amount:1 }
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, *Lantern*
            { itemId: itemIds.bronzeChainbody, amount: 1 },
            { itemId: itemIds.bronzePlatelegs, amount: 1 },
            { itemId: itemIds.bronzePlateskirt, amount: 1 },
            { itemId: itemIds.bronzePlatebody, amount: 1 },
            { itemId: 0, amount: 1 },
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            { itemId: itemIds.bronzeMediumhelm, amount: 1 },
            { itemId: itemIds.bronzeFullhelm, amount: 1 },
            { itemId: itemIds.bronzeSquareShield, amount: 1 },
            { itemId: itemIds.bronzeKiteshield, amount: 1 },
            { itemId: itemIds.bronzeNails, amount: 15 }
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            { itemId: itemIds.bronzeDartTip, amount: 1 },
            { itemId: itemIds.bronzeArrowtips, amount: 15 },
            { itemId: itemIds.bronzeThrowingKnives, amount: 5 },
            { itemId: 0, amount: 1 },
            { itemId: 0, amount: 1 }
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            { itemId: itemIds.bronzeBolts, amount: 10 },
            { itemId: itemIds.bronzeLimbs, amount: 1 },
            { itemId: 0, amount: 1 },
        ]]
    ])],
    [itemIds.ironBar, new Map<number, Item[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            { itemId: itemIds.ironDagger, amount: 1 },
            { itemId: itemIds.ironSword, amount: 1 },
            { itemId: itemIds.ironScimitar, amount: 1 },
            { itemId: itemIds.ironLongsword, amount: 1 },
            { itemId: itemIds.ironTwoHand, amount: 1}
        ]],

        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            { itemId: itemIds.ironAxe, amount: 1 },
            { itemId: itemIds.ironMace, amount: 1 },
            { itemId: itemIds.ironWarhammer, amount: 1 },
            { itemId: itemIds.ironBattleAxe, amount: 1 },
            { itemId: itemIds.ironClaws, amount:1 }
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, *Lantern*
            { itemId: itemIds.ironChainbody, amount: 1 },
            { itemId: itemIds.ironPlatelegs, amount: 1 },
            { itemId: itemIds.ironPlateskirt, amount: 1 },
            { itemId: itemIds.ironPlatebody, amount: 1 },
            { itemId: 0, amount: 1 },
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            { itemId: itemIds.ironMediumhelm, amount: 1 },
            { itemId: itemIds.ironFullhelm, amount: 1 },
            { itemId: itemIds.ironSquareShield, amount: 1 },
            { itemId: itemIds.ironKiteshield, amount: 1 },
            { itemId: itemIds.ironNails, amount: 15 }
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            { itemId: itemIds.ironDartTip, amount: 1 },
            { itemId: itemIds.ironArrowtips, amount: 15 },
            { itemId: itemIds.ironThrowingKnives, amount: 5 },
            { itemId: 0, amount: 1 },
            { itemId: 0, amount: 1 }
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            { itemId: itemIds.ironBolts, amount: 10 },
            { itemId: itemIds.ironLimbs, amount: 1 },
            { itemId: 0, amount: 1 },
        ]],
    ])],
    [itemIds.steelBar, new Map<number, Item[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            { itemId: itemIds.steelDagger, amount: 1 },
            { itemId: itemIds.steelSword, amount: 1 },
            { itemId: itemIds.steelScimitar, amount: 1 },
            { itemId: itemIds.steelLongsword, amount: 1 },
            { itemId: itemIds.steelTwoHand, amount: 1}
        ]],

        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            { itemId: itemIds.steelAxe, amount: 1 },
            { itemId: itemIds.steelMace, amount: 1 },
            { itemId: itemIds.steelWarhammer, amount: 1 },
            { itemId: itemIds.steelBattleAxe, amount: 1 },
            { itemId: itemIds.steelClaws, amount:1 }
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, Lantern
            { itemId: itemIds.steelChainbody, amount: 1 },
            { itemId: itemIds.steelPlatelegs, amount: 1 },
            { itemId: itemIds.steelPlateskirt, amount: 1 },
            { itemId: itemIds.steelPlatebody, amount: 1 },
            { itemId: itemIds.steelOilLanternFrame, amount: 1 },
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            { itemId: itemIds.steelMediumhelm, amount: 1 },
            { itemId: itemIds.steelFullhelm, amount: 1 },
            { itemId: itemIds.steelSquareShield, amount: 1 },
            { itemId: itemIds.steelKiteshield, amount: 1 },
            { itemId: itemIds.steelNails, amount: 15 }
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            { itemId: itemIds.steelDartTip, amount: 1 },
            { itemId: itemIds.steelArrowtips, amount: 15 },
            { itemId: itemIds.steelThrowingKnives, amount: 5 },
            { itemId: 0, amount: 1 },
            { itemId: itemIds.steelStuds, amount: 1 }
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            { itemId: itemIds.steelBolts, amount: 10 },
            { itemId: itemIds.steelLimbs, amount: 1 },
            { itemId: 0, amount: 1 },
        ]]
    ])],
    [itemIds.mithrilBar, new Map<number, Item[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            { itemId: itemIds.mithrilDagger, amount: 1 },
            { itemId: itemIds.mithrilSword, amount: 1 },
            { itemId: itemIds.mithrilScimitar, amount: 1 },
            { itemId: itemIds.mithrilLongsword, amount: 1 },
            { itemId: itemIds.mithrilTwoHand, amount: 1}
        ]],

        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            { itemId: itemIds.mithrilAxe, amount: 1 },
            { itemId: itemIds.mithrilMace, amount: 1 },
            { itemId: itemIds.mithrilWarhammer, amount: 1 },
            { itemId: itemIds.mithrilBattleAxe, amount: 1 },
            { itemId: itemIds.mithrilClaws, amount:1 }
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, Lantern
            { itemId: itemIds.mithrilChainbody, amount: 1 },
            { itemId: itemIds.mithrilPlatelegs, amount: 1 },
            { itemId: itemIds.mithrilPlateskirt, amount: 1 },
            { itemId: itemIds.mithrilPlatebody, amount: 1 },
            { itemId: 0, amount: 1 },
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            { itemId: itemIds.mithrilMediumhelm, amount: 1 },
            { itemId: itemIds.mithrilFullhelm, amount: 1 },
            { itemId: itemIds.mithrilSquareShield, amount: 1 },
            { itemId: itemIds.mithrilKiteshield, amount: 1 },
            { itemId: itemIds.mithrilNails, amount: 15 }
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            { itemId: itemIds.mithrilDartTip, amount: 1 },
            { itemId: itemIds.mithrilArrowtips, amount: 15 },
            { itemId: itemIds.mithrilThrowingKnives, amount: 5 },
            { itemId: 0, amount: 1 },
            { itemId: 0, amount: 1 }
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            { itemId: itemIds.mithrilBolts, amount: 10 },
            { itemId: itemIds.mithrilLimbs, amount: 1 },
            { itemId: itemIds.mithrilGrappleTips, amount: 1 },
        ]]
    ])],
    [itemIds.adamantiteBar, new Map<number, Item[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            { itemId: itemIds.adamantiteDagger, amount: 1 },
            { itemId: itemIds.adamantiteSword, amount: 1 },
            { itemId: itemIds.adamantiteScimitar, amount: 1 },
            { itemId: itemIds.adamantiteLongsword, amount: 1 },
            { itemId: itemIds.adamantiteTwoHand, amount: 1}
        ]],

        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            { itemId: itemIds.adamantiteAxe, amount: 1 },
            { itemId: itemIds.adamantiteMace, amount: 1 },
            { itemId: itemIds.adamantiteWarhammer, amount: 1 },
            { itemId: itemIds.adamantiteBattleAxe, amount: 1 },
            { itemId: itemIds.adamantiteClaws, amount:1 }
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, Lantern
            { itemId: itemIds.adamantiteChainbody, amount: 1 },
            { itemId: itemIds.adamantitePlatelegs, amount: 1 },
            { itemId: itemIds.adamantitePlateskirt, amount: 1 },
            { itemId: itemIds.adamantitePlatebody, amount: 1 },
            { itemId: 0, amount: 1 },
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            { itemId: itemIds.adamantiteMediumhelm, amount: 1 },
            { itemId: itemIds.adamantiteFullhelm, amount: 1 },
            { itemId: itemIds.adamantiteSquareShield, amount: 1 },
            { itemId: itemIds.adamantiteKiteshield, amount: 1 },
            { itemId: itemIds.adamantiteNails, amount: 15 }
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            { itemId: itemIds.adamantiteDartTip, amount: 1 },
            { itemId: itemIds.adamantiteArrowtips, amount: 15 },
            { itemId: itemIds.adamantiteThrowingKnives, amount: 5 },
            { itemId: 0, amount: 1 },
            { itemId: 0, amount: 1 }
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            { itemId: itemIds.adamantiteBolts, amount: 10 },
            { itemId: itemIds.adamantiteLimbs, amount: 1 },
            { itemId: 0, amount: 1 },
        ]]
    ])],
    [itemIds.runiteBar, new Map<number, Item[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            { itemId: itemIds.runiteDagger, amount: 1 },
            { itemId: itemIds.runiteSword, amount: 1 },
            { itemId: itemIds.runiteScimitar, amount: 1 },
            { itemId: itemIds.runiteLongsword, amount: 1 },
            { itemId: itemIds.runiteTwoHand, amount: 1}
        ]],

        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            { itemId: itemIds.runiteAxe, amount: 1 },
            { itemId: itemIds.runiteMace, amount: 1 },
            { itemId: itemIds.runiteWarhammer, amount: 1 },
            { itemId: itemIds.runiteBattleAxe, amount: 1 },
            { itemId: itemIds.runiteClaws, amount:1 }
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, Lantern
            { itemId: itemIds.runiteChainbody, amount: 1 },
            { itemId: itemIds.runitePlatelegs, amount: 1 },
            { itemId: itemIds.runitePlateskirt, amount: 1 },
            { itemId: itemIds.runitePlatebody, amount: 1 },
            { itemId: 0, amount: 1 },
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            { itemId: itemIds.runiteMediumhelm, amount: 1 },
            { itemId: itemIds.runiteFullhelm, amount: 1 },
            { itemId: itemIds.runiteSquareShield, amount: 1 },
            { itemId: itemIds.runiteKiteshield, amount: 1 },
            { itemId: itemIds.runiteNails, amount: 15 }
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            { itemId: itemIds.runiteDartTip, amount: 1 },
            { itemId: itemIds.runiteArrowtips, amount: 15 },
            { itemId: itemIds.runiteThrowingKnives, amount: 5 },
            { itemId: 0, amount: 1 },
            { itemId: 0, amount: 1 }
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            { itemId: 0, amount: 1 },
            { itemId: 0, amount: 1 },
            { itemId: 0, amount: 1 },
        ]]
    ])]
]);

const widgetButtonIds : Map<number, Smithable> = new Map<number, Smithable>([
]);

const anvilAction : itemOnObjectAction = (details) => {
    const {player, item} = details;
    const amountInInventory = player.inventory.findAll(item).length;

    player.outgoingPackets.updateClientConfig(210, amountInInventory);
    player.outgoingPackets.updateClientConfig(211, player.skills.getSkillLevel(Skill.SMITHING));

    details.player.activeWidget = {
        type: 'SCREEN',
        widgetId: widgets.anvil.widgetId,
    };

    widgetItems.get(item.itemId).forEach((items, containerId) => {
        items.forEach((item, index) => {
            player.outgoingPackets.sendUpdateSingleWidgetItem({
                widgetId: widgets.anvil.widgetId, containerId: containerId
            }, index, item);
        });
    });
    /*
    widgetItems.forEach((columns, itemId) => {
        if (itemId === item.itemId) {
            columns.forEach((items, containerId) => {
                items.forEach((item, index) => {
                    player.outgoingPackets.sendUpdateSingleWidgetItem({
                        widgetId: widgets.anvil.widgetId, containerId: containerId
                    }, index, item);
                });
            });
        }

    });*/
};


export default new RunePlugin([
    {
        type: ActionType.ITEM_ON_OBJECT_ACTION,
        itemIds: Array.from(bars.map((bar) => bar.id)),
        objectIds: anvilIds,
        action: anvilAction
    }
])
