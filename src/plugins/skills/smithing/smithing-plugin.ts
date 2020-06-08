import { itemIds } from '@server/world/config/item-ids';
import { Item } from '@server/world/items/item';
import { itemOnObjectAction } from '@server/world/actor/player/action/item-on-object-action';
import { ActionType, RunePlugin } from '@server/plugins/plugin';
import { widgets } from '@server/world/config/widget';
import { Skill } from '@server/world/actor/skills';
import { itemAction } from "@server/world/actor/player/action/item-action";


interface Smithable {
    item: Item;
    level: number;
    experience: number;
    ingredient: Item;
}

interface SmithableOption {
    smithable: Smithable;
    count: number;
    takesInput: boolean;
}

const anvilIds: number[] = [
    2782, 2783, 4306, 6150
];

const barIds : number[] = [
    itemIds.bronzeBar,
    itemIds.bluriteBar,
    itemIds.ironBar,
    itemIds.steelBar,
    itemIds.mithrilBar,
    itemIds.adamantiteBar,
    itemIds.runiteBar
];

const smithables : Map<string, Map<string, Smithable>> = new Map<string, Map<string, Smithable>>([
    ['dagger', new Map<string, Smithable>([
        ['bronze', { level: 1, experience: 12.5, item: { itemId: itemIds.bronzeDagger, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 15, experience: 25, item: { itemId: itemIds.ironDagger, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 30, experience: 37.5, item: { itemId: itemIds.steelDagger, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 50, experience: 50, item: { itemId: itemIds.mithrilDagger, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 70, experience: 62.5, item: { itemId: itemIds.adamantiteDagger, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 85, experience: 75, item: { itemId: itemIds.runiteDagger, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['axe', new Map<string, Smithable>([
        ['bronze', { level: 1, experience: 12.5, item: { itemId: itemIds.bronzeAxe, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 16, experience: 25, item: { itemId: itemIds.ironAxe, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 31, experience: 37.5, item: { itemId: itemIds.steelAxe, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 51, experience: 50, item: { itemId: itemIds.mithrilAxe, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 71, experience: 62.5, item: { itemId: itemIds.adamantiteAxe, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 86, experience: 75, item: { itemId: itemIds.runiteAxe, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['mace', new Map<string, Smithable>([
        ['bronze', { level: 2, experience: 12.5, item: { itemId: itemIds.bronzeMace, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 17, experience: 25, item: { itemId: itemIds.ironMace, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 32, experience: 37.5, item: { itemId: itemIds.steelMace, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 52, experience: 50, item: { itemId: itemIds.mithrilMace, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 72, experience: 62.5, item: { itemId: itemIds.adamantiteMace, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 87, experience: 75, item: { itemId: itemIds.runiteMace, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['mediumHelm', new Map<string, Smithable>([
        ['bronze', { level: 3, experience: 12.5, item: { itemId: itemIds.bronzeMediumhelm, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 18, experience: 25, item: { itemId: itemIds.ironMediumhelm, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 33, experience: 37.5, item: { itemId: itemIds.steelMediumhelm, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 53, experience: 50, item: { itemId: itemIds.mithrilMediumhelm, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 73, experience: 62.5, item: { itemId: itemIds.adamantiteMediumhelm, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 88, experience: 75, item: { itemId: itemIds.runiteMediumhelm, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }]
    ])],
    ['bolts', new Map<string, Smithable>([
        ['bronze', { level: 3, experience: 12.5, item: { itemId: itemIds.bronzeBolts, amount: 15 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 18, experience: 25, item: { itemId: itemIds.ironBolts, amount: 15 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 33, experience: 37.5, item: { itemId: itemIds.steelBolts, amount: 15 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 53, experience: 50, item: { itemId: itemIds.mithrilBolts, amount: 15 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 73, experience: 62.5, item: { itemId: itemIds.adamantiteBolts, amount: 15 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 88, experience: 75, item: { itemId: itemIds.runiteBolts, amount: 15 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['sword', new Map<string, Smithable>([
        ['bronze', { level: 4, experience: 12.5, item: { itemId: itemIds.bronzeSword, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 19, experience: 25, item: { itemId: itemIds.ironSword, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 34, experience: 37.5, item: { itemId: itemIds.steelSword, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 54, experience: 50, item: { itemId: itemIds.mithrilSword, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 74, experience: 62.5, item: { itemId: itemIds.adamantiteSword, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 89, experience: 75, item: { itemId: itemIds.adamantiteSword, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
    ])],
    ['dartTips', new Map<string, Smithable>([
        ['bronze', { level: 4, experience: 12.5, item: { itemId: itemIds.bronzeDartTip, amount: 10 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 19, experience: 25, item: { itemId: itemIds.ironDartTip, amount: 10 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 34, experience: 37.5, item: { itemId: itemIds.steelDartTip, amount: 10 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 54, experience: 50, item: { itemId: itemIds.mithrilDartTip, amount: 10 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 74, experience: 62.5, item: { itemId: itemIds.adamantiteDartTip, amount: 10 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 89, experience: 75, item: { itemId: itemIds.runiteDartTip, amount: 10 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['nails', new Map<string, Smithable>([
        ['bronze', { level: 4, experience: 12.5, item: { itemId: itemIds.bronzeNails, amount: 10 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 19, experience: 25, item: { itemId: itemIds.ironNails, amount: 10 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 34, experience: 37.5, item: { itemId: itemIds.steelNails, amount: 10 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 54, experience: 50, item: { itemId: itemIds.mithrilNails, amount: 10 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 74, experience: 62.5, item: { itemId: itemIds.adamantiteNails, amount: 10 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 89, experience: 75, item: { itemId: itemIds.runiteNails, amount: 10 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['scimitar', new Map<string, Smithable>([
        ['bronze', { level: 5, experience: 25, item: { itemId: itemIds.bronzeScimitar, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 2 } }],
        ['iron', { level: 20, experience: 50, item: { itemId: itemIds.ironScimitar, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 2 } }],
        ['steel', { level: 35, experience: 75, item: { itemId: itemIds.steelScimitar, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 2 } }],
        ['mithril', { level: 55, experience: 100, item: { itemId: itemIds.mithrilScimitar, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 2 } }],
        ['adamant', { level: 75, experience: 125, item: { itemId: itemIds.adamantiteScimitar, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 2 } }],
        ['rune', { level: 90, experience: 150, item: { itemId: itemIds.runiteScimitar, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 2 } }],
    ])],
    ['spear', new Map<string, Smithable>([
        ['bronze', { level: 5, experience: 25, item: { itemId: itemIds.bronzeSpear, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 20, experience: 25, item: { itemId: itemIds.ironSpear, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 35, experience: 37.5, item: { itemId: itemIds.steelSpear, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 55, experience: 50, item: { itemId: itemIds.mithrilSpear, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 75, experience: 62.5, item: { itemId: itemIds.adamantiteSpear, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 90, experience: 75, item: { itemId: itemIds.runiteSpear, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['arrowTips', new Map<string, Smithable>([
        ['bronze', { level: 5, experience: 12.5, item: { itemId: itemIds.bronzeArrowtips, amount: 15 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 20, experience: 25, item: { itemId: itemIds.ironArrowtips, amount: 15 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 35, experience: 37.5, item: { itemId: itemIds.steelArrowtips, amount: 15 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 55, experience: 50, item: { itemId: itemIds.mithrilArrowtips, amount: 15 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 75, experience: 62.5, item: { itemId: itemIds.adamantiteArrowtips, amount: 15 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 90, experience: 75, item: { itemId: itemIds.runiteArrowtips, amount: 15 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['limbs', new Map<string, Smithable>([
        ['bronze', { level: 6, experience: 12.5, item: { itemId: itemIds.bronzeLimbs, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }],
        ['iron', { level: 23, experience: 25, item: { itemId: itemIds.ironLimbs, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 1 } }],
        ['steel', { level: 36, experience: 37.5, item: { itemId: itemIds.steelLimbs, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 56, experience: 50, item: { itemId: itemIds.mithrilLimbs, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 76, experience: 62.5, item: { itemId: itemIds.adamantiteLimbs, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 91, experience: 75, item: { itemId: itemIds.runiteLimbs, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['longsword', new Map<string, Smithable>([
        ['bronze', { level: 6, experience: 25, item: { itemId: itemIds.bronzeLongsword, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 2 } }],
        ['iron', { level: 21, experience: 50, item: { itemId: itemIds.ironLongsword, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 2 } }],
        ['steel', { level: 36, experience: 75, item: { itemId: itemIds.steelLongsword, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 2 } }],
        ['mithril', { level: 56, experience: 100, item: { itemId: itemIds.mithrilLongsword, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 2 } }],
        ['adamant', { level: 76, experience: 125, item: { itemId: itemIds.adamantiteLongsword, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 2 } }],
        ['rune', { level: 91, experience: 150, item: { itemId: itemIds.runiteLongsword, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 2 } }],
    ])],
    ['fullHelm', new Map<string, Smithable>([
        ['bronze', { level: 7, experience: 25, item: { itemId: itemIds.bronzeFullhelm, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 2 } }],
        ['iron', { level: 22, experience: 50, item: { itemId: itemIds.ironFullhelm, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 2 } }],
        ['steel', { level: 37, experience: 75, item: { itemId: itemIds.steelFullhelm, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 2 } }],
        ['mithril', { level: 57, experience: 100, item: { itemId: itemIds.mithrilFullhelm, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 2 } }],
        ['adamant', { level: 77, experience: 125, item: { itemId: itemIds.adamantiteFullhelm, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 2 } }],
        ['rune', { level: 92, experience: 150, item: { itemId: itemIds.runiteFullhelm, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 2 } }],
    ])],
    ['knife', new Map<string, Smithable>([
        ['steel', { level: 37, experience: 37.5, item: { itemId: itemIds.steelThrowingKnives, amount: 5 }, ingredient: { itemId: itemIds.steelBar, amount: 1 } }],
        ['mithril', { level: 57, experience: 50, item: { itemId: itemIds.mithrilThrowingKnives, amount: 5 }, ingredient: { itemId: itemIds.mithrilBar, amount: 1 } }],
        ['adamant', { level: 77, experience: 62.5, item: { itemId: itemIds.adamantiteThrowingKnives, amount: 5 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 1 } }],
        ['rune', { level: 92, experience: 75, item: { itemId: itemIds.runiteThrowingKnives, amount: 5 }, ingredient: { itemId: itemIds.runiteBar, amount: 1 } }],
    ])],
    ['squareShield', new Map<string, Smithable>([
        ['bronze', { level: 8, experience: 25, item: { itemId: itemIds.bronzeSquareShield, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 2 } }],
        ['iron', { level: 23, experience: 50, item: { itemId: itemIds.ironSquareShield, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 2 } }],
        ['steel', { level: 38, experience: 75, item: { itemId: itemIds.steelSquareShield, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 2 } }],
        ['mithril', { level: 58, experience: 100, item: { itemId: itemIds.mithrilSquareShield, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 2 } }],
        ['adamant', { level: 78, experience: 125, item: { itemId: itemIds.adamantiteSquareShield, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 2 } }],
        ['rune', { level: 93, experience: 150, item: { itemId: itemIds.runiteSquareShield, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 2 } }],
    ])],
    ['warhammer', new Map<string, Smithable>([
        ['bronze', { level: 9, experience: 37.5, item: { itemId: itemIds.bronzeWarhammer, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 3 } }],
        ['iron', { level: 24, experience: 75, item: { itemId: itemIds.ironWarhammer, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 3 } }],
        ['steel', { level: 39, experience: 112.5, item: { itemId: itemIds.steelWarhammer, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 3 } }],
        ['mithril', { level: 59, experience: 150, item: { itemId: itemIds.mithrilWarhammer, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 3 } }],
        ['adamant', { level: 79, experience: 187.5, item: { itemId: itemIds.adamantiteWarhammer, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 3 } }],
        ['rune', { level: 94, experience: 225, item: { itemId: itemIds.runiteWarhammer, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 3 } }],
    ])],
    ['battleaxe', new Map<string, Smithable>([
        ['bronze', { level: 9, experience: 37.5, item: { itemId: itemIds.bronzeBattleAxe, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 3 } }],
        ['iron', { level: 24, experience: 75, item: { itemId: itemIds.ironBattleAxe, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 3 } }],
        ['steel', { level: 39, experience: 112.5, item: { itemId: itemIds.steelBattleAxe, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 3 } }],
        ['mithril', { level: 59, experience: 150, item: { itemId: itemIds.mithrilBattleAxe, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 3 } }],
        ['adamant', { level: 79, experience: 187.5, item: { itemId: itemIds.adamantiteBattleAxe, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 3 } }],
        ['rune', { level: 94, experience: 225, item: { itemId: itemIds.runiteBattleAxe, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 3 } }],
    ])],
    ['chainbody', new Map<string, Smithable>([
        ['bronze', { level: 11, experience: 37.5, item: { itemId: itemIds.bronzeChainbody, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 3 } }],
        ['iron', { level: 26, experience: 75, item: { itemId: itemIds.ironChainbody, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 3 } }],
        ['steel', { level: 41, experience: 112.5, item: { itemId: itemIds.steelChainbody, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 3 } }],
        ['mithril', { level: 61, experience: 150, item: { itemId: itemIds.mithrilChainbody, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 3 } }],
        ['adamant', { level: 81, experience: 187.5, item: { itemId: itemIds.adamantiteChainbody, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 3 } }],
        ['rune', { level: 96, experience: 225, item: { itemId: itemIds.runiteChainbody, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 3 } }],
    ])],
    ['kiteshield', new Map<string, Smithable>([
        ['bronze', { level: 12, experience: 37.5, item: { itemId: itemIds.bronzeKiteshield, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 3 } }],
        ['iron', { level: 27, experience: 75, item: { itemId: itemIds.ironKiteshield, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 3 } }],
        ['steel', { level: 42, experience: 112.5, item: { itemId: itemIds.steelKiteshield, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 3 } }],
        ['mithril', { level: 62, experience: 150, item: { itemId: itemIds.mithrilKiteshield, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 3 } }],
        ['adamant', { level: 82, experience: 187.5, item: { itemId: itemIds.adamantiteKiteshield, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 3 } }],
        ['rune', { level: 97, experience: 225, item: { itemId: itemIds.runiteKiteshield, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 3 } }],
    ])],
    ['claws', new Map<string, Smithable>([
        ['bronze', { level: 13, experience: 25, item: { itemId: itemIds.bronzeClaws, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 2 } }],
        ['iron', { level: 28, experience: 50, item: { itemId: itemIds.ironClaws, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 2 } }],
        ['steel', { level: 43, experience: 75, item: { itemId: itemIds.steelClaws, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 2 } }],
        ['mithril', { level: 63, experience: 100, item: { itemId: itemIds.mithrilClaws, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 2 } }],
        ['adamant', { level: 83, experience: 125, item: { itemId: itemIds.adamantiteClaws, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 2 } }],
        ['rune', { level: 98, experience: 150, item: { itemId: itemIds.runiteClaws, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 2 } }],
    ])],
    ['twoHandedSword', new Map<string, Smithable>([
        ['bronze', { level: 14, experience: 37.5, item: { itemId: itemIds.bronzeTwoHand, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 3 } }],
        ['iron', { level: 29, experience: 75, item: { itemId: itemIds.ironTwoHand, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 3 } }],
        ['steel', { level: 44, experience: 112.5, item: { itemId: itemIds.steelTwoHand, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 3 } }],
        ['mithril', { level: 64, experience: 150, item: { itemId: itemIds.mithrilTwoHand, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 3 } }],
        ['adamant', { level: 84, experience: 187.5, item: { itemId: itemIds.adamantiteTwoHand, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 3 } }],
        ['rune', { level: 99, experience: 225, item: { itemId: itemIds.runiteTwoHand, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 3 } }],
    ])],
    ['platelegs', new Map<string, Smithable>([
        ['bronze', { level: 16, experience: 37.5, item: { itemId: itemIds.bronzePlatelegs, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 3 } }],
        ['iron', { level: 31, experience: 75, item: { itemId: itemIds.ironPlatelegs, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 3 } }],
        ['steel', { level: 46, experience: 112.5, item: { itemId: itemIds.steelPlatelegs, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 3 } }],
        ['mithril', { level: 66, experience: 150, item: { itemId: itemIds.mithrilPlatelegs, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 3 } }],
        ['adamant', { level: 86, experience: 187.5, item: { itemId: itemIds.adamantitePlatelegs, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 3 } }],
        ['rune', { level: 99, experience: 225, item: { itemId: itemIds.runitePlatelegs, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 3 } }],
    ])],
    ['plateskirt', new Map<string, Smithable>([
        ['bronze', { level: 16, experience: 37.5, item: { itemId: itemIds.bronzePlateskirt, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 3 } }],
        ['iron', { level: 31, experience: 75, item: { itemId: itemIds.ironPlateskirt, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 3 } }],
        ['steel', { level: 46, experience: 112.5, item: { itemId: itemIds.steelPlateskirt, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 3 } }],
        ['mithril', { level: 66, experience: 150, item: { itemId: itemIds.mithrilPlateskirt, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 3 } }],
        ['adamant', { level: 86, experience: 187.5, item: { itemId: itemIds.adamantitePlateskirt, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 3 } }],
        ['rune', { level: 99, experience: 225, item: { itemId: itemIds.runitePlateskirt, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 3 } }],
    ])],
    ['platebody', new Map<string, Smithable>([
        ['bronze', { level: 16, experience: 37.5, item: { itemId: itemIds.bronzePlatebody, amount: 1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 5 } }],
        ['iron', { level: 31, experience: 75, item: { itemId: itemIds.ironPlatebody, amount: 1 }, ingredient: { itemId: itemIds.ironBar, amount: 5 } }],
        ['steel', { level: 46, experience: 112.5, item: { itemId: itemIds.steelPlatebody, amount: 1 }, ingredient: { itemId: itemIds.steelBar, amount: 5 } }],
        ['mithril', { level: 66, experience: 150, item: { itemId: itemIds.mithrilPlatebody, amount: 1 }, ingredient: { itemId: itemIds.mithrilBar, amount: 5 } }],
        ['adamant', { level: 86, experience: 187.5, item: { itemId: itemIds.adamantitePlatebody, amount: 1 }, ingredient: { itemId: itemIds.adamantiteBar, amount: 5 } }],
        ['rune', { level: 99, experience: 225, item: { itemId: itemIds.runitePlatebody, amount: 1 }, ingredient: { itemId: itemIds.runiteBar, amount: 5 } }],
    ])],
    ['unknown', new Map<string, Smithable>([
        ['any', { level: 1, experience: 0, item: { itemId: -1, amount: -1 }, ingredient: { itemId: itemIds.bronzeBar, amount: 1 } }]
    ])],
]);

const widgetItems : Map<number, Map<number, Smithable[]>> = new Map<number, Map<number, Smithable[]>>([
    [itemIds.bronzeBar, new Map<number, Smithable[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            smithables.get('dagger').get('bronze'),
            smithables.get('sword').get('bronze'),
            smithables.get('scimitar').get('bronze'),
            smithables.get('longsword').get('bronze'),
            smithables.get('twoHandedSword').get('bronze'),
        ]],
        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            smithables.get('axe').get('bronze'),
            smithables.get('mace').get('bronze'),
            smithables.get('warhammer').get('bronze'),
            smithables.get('battleaxe').get('bronze'),
            smithables.get('claws').get('bronze')
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, *Lantern*
            smithables.get('chainbody').get('bronze'),
            smithables.get('platelegs').get('bronze'),
            smithables.get('plateskirt').get('bronze'),
            smithables.get('platebody').get('bronze'),
            smithables.get('unknown').get('any')
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            smithables.get('mediumHelm').get('bronze'),
            smithables.get('fullHelm').get('bronze'),
            smithables.get('squareShield').get('bronze'),
            smithables.get('kiteshield').get('bronze'),
            smithables.get('nails').get('bronze')
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            smithables.get('dartTips').get('bronze'),
            smithables.get('arrowTips').get('bronze'),
            smithables.get('unknown').get('any'),
            smithables.get('unknown').get('any'),
            smithables.get('unknown').get('any')
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            smithables.get('bolts').get('bronze'),
            smithables.get('limbs').get('bronze'),
            smithables.get('unknown').get('any'),
        ]]
    ])],
    [itemIds.ironBar, new Map<number, Smithable[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            smithables.get('dagger').get('iron'),
            smithables.get('sword').get('iron'),
            smithables.get('scimitar').get('iron'),
            smithables.get('longsword').get('iron'),
            smithables.get('twoHandedSword').get('iron'),
        ]],
        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            smithables.get('axe').get('iron'),
            smithables.get('mace').get('iron'),
            smithables.get('warhammer').get('iron'),
            smithables.get('battleaxe').get('iron'),
            smithables.get('claws').get('iron')
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, *Lantern*
            smithables.get('chainbody').get('iron'),
            smithables.get('platelegs').get('iron'),
            smithables.get('plateskirt').get('iron'),
            smithables.get('platebody').get('iron'),
            smithables.get('unknown').get('any')
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            smithables.get('mediumHelm').get('iron'),
            smithables.get('fullHelm').get('iron'),
            smithables.get('squareShield').get('iron'),
            smithables.get('kiteshield').get('iron'),
            smithables.get('nails').get('iron')
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            smithables.get('dartTips').get('iron'),
            smithables.get('arrowTips').get('iron'),
            smithables.get('unknown').get('any'),
            smithables.get('unknown').get('any'),
            smithables.get('unknown').get('any')
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            smithables.get('bolts').get('iron'),
            smithables.get('limbs').get('iron'),
            smithables.get('unknown').get('any'),
        ]]
    ])],
    [itemIds.steelBar, new Map<number, Smithable[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            smithables.get('dagger').get('steel'),
            smithables.get('sword').get('steel'),
            smithables.get('scimitar').get('steel'),
            smithables.get('longsword').get('steel'),
            smithables.get('twoHandedSword').get('steel'),
        ]],
        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            smithables.get('axe').get('steel'),
            smithables.get('mace').get('steel'),
            smithables.get('warhammer').get('steel'),
            smithables.get('battleaxe').get('steel'),
            smithables.get('claws').get('steel')
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, *Lantern*
            smithables.get('chainbody').get('steel'),
            smithables.get('platelegs').get('steel'),
            smithables.get('plateskirt').get('steel'),
            smithables.get('platebody').get('steel'),
            smithables.get('unknown').get('any')
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            smithables.get('mediumHelm').get('steel'),
            smithables.get('fullHelm').get('steel'),
            smithables.get('squareShield').get('steel'),
            smithables.get('kiteshield').get('steel'),
            smithables.get('nails').get('steel')
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            smithables.get('dartTips').get('steel'),
            smithables.get('arrowTips').get('steel'),
            smithables.get('knife').get('steel'),
            smithables.get('unknown').get('any'),
            smithables.get('unknown').get('any')
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            smithables.get('bolts').get('steel'),
            smithables.get('limbs').get('steel'),
            smithables.get('unknown').get('any'),
        ]]
    ])],
    [itemIds.mithrilBar, new Map<number, Smithable[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            smithables.get('dagger').get('mithril'),
            smithables.get('sword').get('mithril'),
            smithables.get('scimitar').get('mithril'),
            smithables.get('longsword').get('mithril'),
            smithables.get('twoHandedSword').get('mithril'),
        ]],
        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            smithables.get('axe').get('mithril'),
            smithables.get('mace').get('mithril'),
            smithables.get('warhammer').get('mithril'),
            smithables.get('battleaxe').get('mithril'),
            smithables.get('claws').get('mithril')
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, *Lantern*
            smithables.get('chainbody').get('mithril'),
            smithables.get('platelegs').get('mithril'),
            smithables.get('plateskirt').get('mithril'),
            smithables.get('platebody').get('mithril'),
            smithables.get('unknown').get('any')
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            smithables.get('mediumHelm').get('mithril'),
            smithables.get('fullHelm').get('mithril'),
            smithables.get('squareShield').get('mithril'),
            smithables.get('kiteshield').get('mithril'),
            smithables.get('nails').get('mithril')
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            smithables.get('dartTips').get('mithril'),
            smithables.get('arrowTips').get('mithril'),
            smithables.get('knife').get('mithril'),
            smithables.get('unknown').get('any'),
            smithables.get('unknown').get('any')
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            smithables.get('bolts').get('mithril'),
            smithables.get('limbs').get('mithril'),
            smithables.get('unknown').get('any'),
        ]]
    ])],
    [itemIds.adamantiteBar, new Map<number, Smithable[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            smithables.get('dagger').get('adamant'),
            smithables.get('sword').get('adamant'),
            smithables.get('scimitar').get('adamant'),
            smithables.get('longsword').get('adamant'),
            smithables.get('twoHandedSword').get('adamant'),
        ]],
        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            smithables.get('axe').get('adamant'),
            smithables.get('mace').get('adamant'),
            smithables.get('warhammer').get('adamant'),
            smithables.get('battleaxe').get('adamant'),
            smithables.get('claws').get('adamant')
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, *Lantern*
            smithables.get('chainbody').get('adamant'),
            smithables.get('platelegs').get('adamant'),
            smithables.get('plateskirt').get('adamant'),
            smithables.get('platebody').get('adamant'),
            smithables.get('unknown').get('any')
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            smithables.get('mediumHelm').get('adamant'),
            smithables.get('fullHelm').get('adamant'),
            smithables.get('squareShield').get('adamant'),
            smithables.get('kiteshield').get('adamant'),
            smithables.get('nails').get('adamant')
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            smithables.get('dartTips').get('adamant'),
            smithables.get('arrowTips').get('adamant'),
            smithables.get('knife').get('adamant'),
            smithables.get('unknown').get('any'),
            smithables.get('unknown').get('any')
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            smithables.get('bolts').get('adamant'),
            smithables.get('limbs').get('adamant'),
            smithables.get('unknown').get('any'),
        ]]
    ])],
    [itemIds.runiteBar, new Map<number, Smithable[]>([
        [146, [ // Dagger, Sword, Scimitar, Longsword, 2h sword
            smithables.get('dagger').get('rune'),
            smithables.get('sword').get('rune'),
            smithables.get('scimitar').get('rune'),
            smithables.get('longsword').get('rune'),
            smithables.get('twoHandedSword').get('rune'),
        ]],
        [147, [ // Axe, Mace, Warhammer, Battleaxe, Claws
            smithables.get('axe').get('rune'),
            smithables.get('mace').get('rune'),
            smithables.get('warhammer').get('rune'),
            smithables.get('battleaxe').get('rune'),
            smithables.get('claws').get('rune')
        ]],
        [148, [ // Chainbody, Platelegs, Plateskirt, Platebody, *Lantern*
            smithables.get('chainbody').get('rune'),
            smithables.get('platelegs').get('rune'),
            smithables.get('plateskirt').get('rune'),
            smithables.get('platebody').get('rune'),
            smithables.get('unknown').get('any')
        ]],
        [149, [ // Medium helm, Full helm, Sq shield, kite shield, Nails
            smithables.get('mediumHelm').get('rune'),
            smithables.get('fullHelm').get('rune'),
            smithables.get('squareShield').get('rune'),
            smithables.get('kiteshield').get('rune'),
            smithables.get('nails').get('rune')
        ]],
        [150, [ // Dart tip, Arrowtips, Throwing knives, *Other*, *Studs*
            smithables.get('dartTips').get('rune'),
            smithables.get('arrowTips').get('rune'),
            smithables.get('knife').get('rune'),
            smithables.get('unknown').get('any'),
            smithables.get('unknown').get('any')
        ]],
        [151, [ // Bolts, Limbs, Grapple tips
            smithables.get('bolts').get('rune'),
            smithables.get('limbs').get('rune'),
            smithables.get('unknown').get('any'),
        ]]
    ])]
]);

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
    console.log('option', option);
    console.log('slot', itemSlot);
    console.log('item', itemDetails);
};

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
        items.forEach((smithable, index) => {
            player.outgoingPackets.sendUpdateSingleWidgetItem({
                widgetId: widgets.anvil.widgetId, containerId: containerId
            }, index, smithable.item);
        });
    });

    player.modifyWidget(widgets.anvil.widgetId, { childId: 146, hidden: true });

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
