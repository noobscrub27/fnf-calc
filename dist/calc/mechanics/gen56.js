"use strict";
exports.__esModule = true;

var util_1 = require("../util");
var items_1 = require("../items");
var result_1 = require("../result");
var util_2 = require("./util");
function calculateBWXY(gen, attacker, defender, move, field) {
    (0, util_2.checkAirLock)(attacker, field);
    (0, util_2.checkAirLock)(defender, field);
    (0, util_2.checkForecast)(attacker, field.weather);
    (0, util_2.checkForecast)(defender, field.weather);
    (0, util_2.checkItem)(attacker, field.isMagicRoom);
    (0, util_2.checkItem)(defender, field.isMagicRoom);
    (0, util_2.checkWonderRoom)(attacker, field.isWonderRoom);
    (0, util_2.checkWonderRoom)(defender, field.isWonderRoom);
    (0, util_2.checkSeedBoost)(attacker, field);
    (0, util_2.checkSeedBoost)(defender, field);
    (0, util_2.checkSearchEngine)(defender, attacker);
    (0, util_2.checkSearchEngine)(attacker, defender);
    (0, util_2.checkInflate)(attacker);
    (0, util_2.checkInflate)(defender);
    (0, util_2.computeFinalStats)(gen, attacker, defender, field, 'def', 'spd', 'spe');
    (0, util_2.checkIntimidate)(gen, attacker, defender);
    (0, util_2.checkIntimidate)(gen, defender, attacker);
    (0, util_2.checkDownload)(attacker, defender, field.isWonderRoom);
    (0, util_2.checkDownload)(defender, attacker, field.isWonderRoom);
    (0, util_2.checkSillySoda)(attacker, gen);
    (0, util_2.checkSillySoda)(defender, gen);
    (0, util_2.computeFinalStats)(gen, attacker, defender, field, 'atk', 'spa');
    (0, util_2.checkInfiltrator)(attacker, field.defenderSide);
    (0, util_2.checkInfiltrator)(defender, field.attackerSide);
    var desc = {
        attackerName: attacker.name,
        moveName: move.name,
        defenderName: defender.name,
        isWonderRoom: field.isWonderRoom
    };
    var result = new result_1.Result(gen, attacker, defender, move, field, 0, desc);
    if (move.category === 'Status' && !move.named('Nature Power')) {
        return result;
    }
    if (attacker.hasAbility('Cunning Blade') && move.flags.blade) {
        move.category = 'Special';
    }
    if (field.defenderSide.isProtected && !move.breaksProtect) {
        desc.isProtected = true;
        return result;
    }
    if (field.isMysteryRoom) {
        defender.ability = '';
        attacker.ability = '';
    }
    if (attacker.hasAbility('Mold Breaker', 'Teravolt', 'Turboblaze')) {
        defender.ability = '';
        desc.attackerAbility = attacker.ability;
    }
    var isCritical = (move.isCrit || (attacker.named('Chansey') && attacker.hasItem('Lucky Punch') && gen.num >= 6))
        && !defender.hasAbility('Battle Armor', 'Shell Armor') && !(defender.hasAbility('Pure Heart', 'Shadow Armor') && move.hasType('Shadow'))
        && move.timesUsed === 1;
    if (move.named('Weather Ball')) {
        move.type =
            field.hasWeather('Sun', 'Harsh Sunshine') ? 'Fire'
                : field.hasWeather('Rain', 'Heavy Rain') ? 'Water'
                    : field.hasWeather('Sand') ? 'Rock'
                        : field.hasWeather('Hail') ? 'Ice'
                            : field.hasWeather('Miasma') ? 'Poison'
                                : 'Normal';
        desc.weather = field.weather;
        desc.moveType = move.type;
    }
    else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
        move.type = (0, items_1.getItemBoostType)(attacker.item);
    }
    else if (move.named('Primal Burst') && attacker.item && attacker.item.includes('Orb')) {
        move.type = (0, items_1.getOrbType)(attacker.item);
    }
    else if (move.named('Techno Blast') && attacker.item && attacker.item.includes('Drive')) {
        move.type = (0, items_1.getTechnoBlast)(attacker.item);
    }
    else if (move.named('Natural Gift') && attacker.item && attacker.item.endsWith('Berry')) {
        var gift = (0, items_1.getNaturalGift)(gen, attacker.item);
        move.type = gift.t;
        move.bp = gift.p;
        desc.attackerItem = attacker.item;
        desc.moveBP = move.bp;
        desc.moveType = move.type;
    }
    else if (move.named('Nature Power')) {
        if (gen.num === 5) {
            move.type = 'Ground';
        }
        else {
            move.type =
                field.hasTerrain('Electric') ? 'Electric'
                    : field.hasTerrain('Grassy') ? 'Grass'
                        : field.hasTerrain('Misty') ? 'Fairy'
                            : 'Normal';
        }
    }
    else if (move.named('Seasonal Spirit')) {
        if (attacker.named('Sawsbuck-Spring')) {
            move.type = 'Fairy';
        }
        else if (attacker.named('Sawsbuck-Summer')) {
            move.type = 'Fire';
        }
        else if (attacker.named('Sawsbuck-Autumn')) {
            move.type = 'Ground';
        }
        else if (attacker.named('Sawsbuck-Winter')) {
            move.type = 'Ice';
        }
    }
    if (attacker.hasAbility('Cunning Blade') && move.category === 'Physical' && move.flags.blade) {
        move.category = 'Special';
        move.flags.contact = 0;
    }
    var hasAteAbilityTypeChange = false;
    var isAerilate = false;
    var isPixilate = false;
    var isRefrigerate = false;
    var isNormalize = false;
    var noTypeChange = move.named('Judgment', 'Nature Power', 'Techo Blast', 'Natural Gift', 'Weather Ball', 'Struggle');
    if (!move.isZ && !noTypeChange) {
        var normal = move.hasType('Normal');
        if ((isAerilate = attacker.hasAbility('Aerilate') && normal)) {
            move.type = 'Flying';
        }
        else if ((isPixilate = attacker.hasAbility('Pixilate') && normal)) {
            move.type = 'Fairy';
        }
        else if ((isRefrigerate = attacker.hasAbility('Refrigerate') && normal)) {
            move.type = 'Ice';
        }
        else if ((isNormalize = attacker.hasAbility('Normalize'))) {
            move.type = 'Normal';
        }
        if (isPixilate || isRefrigerate || isAerilate || isNormalize) {
            desc.attackerAbility = attacker.ability;
            hasAteAbilityTypeChange = true;
        }
    }
    if (attacker.hasAbility('Gale Wings') && move.hasType('Flying') ||
        (attacker.hasAbility('Melody Allegretto') && move.flags.sound)) {
        move.priority = 1;
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Stall')) {
        move.priority = -1;
        desc.attackerAbility = attacker.ability;
    }
    var isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;
    var isDarkRevealed = field.defenderSide.isMiracleEye || attacker.hasAbility('Psyche Control');
    var isBoneMaster = attacker.hasAbility('Bone Master') && !!move.flags.bone;
    var type1Effectiveness = (0, util_2.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, isDarkRevealed, field.isGravity, false, isBoneMaster);
    var type2Effectiveness = defender.types[1]
        ? (0, util_2.getMoveEffectiveness)(gen, move, defender.types[1], isGhostRevealed, isDarkRevealed, field.isGravity, false, isBoneMaster)
        : 1;
    var typeEffectiveness = type1Effectiveness * type2Effectiveness;
    if (typeEffectiveness === 0 && move.named('Thousand Arrows')) {
        typeEffectiveness = 1;
    }
    else if (typeEffectiveness === 0 && move.hasType('Ground') &&
        defender.hasItem('Iron Ball') && !defender.hasAbility('Klutz')) {
        typeEffectiveness = 1;
    }
    else if (typeEffectiveness === 0 && defender.hasItem('Ring Target')) {
        var effectiveness = gen.types.get((0, util_1.toID)(move.type)).effectiveness;
        if (effectiveness[defender.types[0]] === 0) {
            typeEffectiveness = type2Effectiveness;
        }
        else if (defender.types[1] && effectiveness[defender.types[1]] === 0) {
            typeEffectiveness = type1Effectiveness;
        }
    }
    if (typeEffectiveness === 0) {
        return result;
    }
    if ((move.named('Sky Drop') &&
        (defender.hasType('Flying') || defender.weightkg >= 200 || field.isGravity)) ||
        (move.named('Dream Eater') && !defender.hasStatus('slp'))) {
        return result;
    }
    if ((field.hasWeather('Harsh Sunshine') && move.hasType('Water')) ||
        (field.hasWeather('Heavy Rain') && move.hasType('Fire'))) {
        desc.weather = field.weather;
        return result;
    }
    if ((field.hasWeather('Strong Winds') || defender.hasAbility('Cloud Guard')) && defender.hasType('Flying') &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness['Flying'] > 1) {
        typeEffectiveness /= 2;
        if (field.hasWeather('Strong Winds')) {
            desc.weather = field.weather;
        }
        else {
            desc.defenderAbility = defender.ability;
        }
    }
    if ((defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
        (move.hasType('Grass') && defender.hasAbility('Sap Sipper')) ||
        (move.hasType('Fire') && defender.hasAbility('Flash Fire', 'Flame Absorb', 'Shadow Convection')) ||
        (move.hasType('Ice') && defender.hasAbility('Tropical Current')) ||
        (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Storm Drain', 'Water Absorb', 'Shadow Hydraulics')) ||
        (move.hasType('Bug') && defender.hasAbility('Bugcatcher')) ||
        (move.hasType('Ground') && defender.hasAbility('Clay Construction')) ||
        (move.hasType('Electric') &&
            defender.hasAbility('Lightning Rod', 'Motor Drive', 'Volt Absorb', 'Shadow Conduction')) ||
        (move.hasType('Ground') && !field.isGravity && !move.named('Thousand Arrows') && !defender.hasItem('Iron Ball') &&
            ((!(attacker.hasAbility('Bone Master') && move.flags.bone) &&
                (defender.hasAbility('Levitate') || (defender.hasAbility('Inflate') && defender.abilityOn))) ||
                (defender.named('Probopass') && defender.hasItem('Magnetic Stone')))) ||
        (move.flags.bullet && defender.hasAbility('Bulletproof')) ||
        (move.flags.sound && defender.hasAbility('Soundproof')) ||
        (move.flags.blade && defender.hasAbility('Bladeproof')) ||
        (move.hasType('Ghost', 'Dark') && defender.hasAbility('Baku Shield')) ||
        (move.hasType('Poison') && defender.hasAbility('Acid Absorb')) ||
        (move.hasType('Dark') && defender.hasAbility('Karma')) ||
        (defender.named('Kiwuit') && defender.hasAbility('Ambrosia') && defender.item && gen.items.get((0, util_1.toID)(defender.item)).isBerry &&
            (0, items_1.getNaturalGift)(gen, defender.item).t === move.type)) {
        desc.defenderAbility = defender.ability;
        return result;
    }
    if (move.hasType('Ground') && !move.named('Thousand Arrows') &&
        !field.isGravity && defender.hasItem('Air Balloon')) {
        desc.defenderItem = defender.item;
        return result;
    }
    if (move.priority > 0 && field.hasTerrain('Psychic') && (0, util_2.isGrounded)(defender, field)) {
        desc.terrain = field.terrain;
        return result;
    }
    desc.HPEVs = "".concat(defender.evs.hp, " HP");
    var fixedDamage = (0, util_2.handleFixedDamageMoves)(attacker, move);
    if (fixedDamage) {
        if (attacker.hasAbility('Parental Bond')) {
            result.damage = [fixedDamage, fixedDamage];
            desc.attackerAbility = attacker.ability;
        }
        else {
            result.damage = fixedDamage;
        }
        return result;
    }
    if (move.named('Final Gambit')) {
        result.damage = attacker.curHP();
        return result;
    }
    if (move.named('Cat Burglary')) {
        var stat = void 0;
        for (stat in defender.boosts) {
            if (defender.boosts[stat] > 0) {
                attacker.boosts[stat] +=
                    attacker.hasAbility('Contrary') ? -defender.boosts[stat] : defender.boosts[stat];
                if (attacker.boosts[stat] > 6)
                    attacker.boosts[stat] = 6;
                if (attacker.boosts[stat] < -6)
                    attacker.boosts[stat] = -6;
                attacker.stats[stat] = (0, util_2.getModifiedStat)(attacker.rawStats[stat], attacker.boosts[stat]);
                defender.boosts[stat] = 0;
                defender.stats[stat] = defender.rawStats[stat];
            }
        }
    }
    if (move.hits > 1) {
        desc.hits = move.hits;
    }
    var basePower = calculateBasePowerBWXY(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc);
    if (basePower === 0) {
        return result;
    }
    var attack = calculateAttackBWXY(gen, attacker, defender, move, field, desc, isCritical);
    var attackStat = move.category === 'Special' ? 'spa' : 'atk';
    var defense = calculateDefenseBWXY(gen, attacker, defender, move, field, desc, isCritical);
    var baseDamage = calculateBaseDamageBWXY(gen, attacker, basePower, attack, defense, move, field, desc, isCritical);
    var stabMod = (0, util_2.getStabMod)(attacker, move, desc);
    var applyBurn = attacker.hasStatus('brn') &&
        move.category === 'Physical' &&
        !attacker.hasAbility('Guts') &&
        !(move.named('Facade') && gen.num === 6);
    desc.isBurned = applyBurn;
    var applyFreeze = attacker.hasStatus('frz') && move.category === 'Special';
    desc.isFrozen = applyFreeze;
    var statusReducesDamage = applyBurn || applyFreeze;
    var finalMods = calculateFinalModsBWXY(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness);
    var finalMod = (0, util_2.chainMods)(finalMods, 41, 131072);
    var isSpread = field.gameType !== 'Singles' &&
        ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
    var childDamage;
    if (attacker.hasAbility('Parental Bond') && move.hits === 1 && !isSpread) {
        var child = attacker.clone();
        child.ability = 'Parental Bond (Child)';
        (0, util_2.checkMultihitBoost)(gen, child, defender, move, field, desc);
        childDamage = calculateBWXY(gen, child, defender, move, field).damage;
        desc.attackerAbility = attacker.ability;
    }
    var damage = [];
    for (var i = 0; i < 16; i++) {
        damage[i] =
            (0, util_2.getFinalDamage)(baseDamage, i, typeEffectiveness, statusReducesDamage, stabMod, finalMod);
    }
    desc.attackBoost =
        move.named('Foul Play') ? defender.boosts[attackStat] : attacker.boosts[attackStat];
    if ((move.dropsStats && move.timesUsed > 1) || move.hits > 1) {
        var origDefBoost = desc.defenseBoost;
        var origAtkBoost = desc.attackBoost;
        var numAttacks = 1;
        if (move.dropsStats && move.timesUsed > 1) {
            desc.moveTurns = "over ".concat(move.timesUsed, " turns");
            numAttacks = move.timesUsed;
        }
        else {
            numAttacks = move.hits;
        }
        var usedItems = [false, false];
        var _loop_1 = function (times) {
            usedItems = (0, util_2.checkMultihitBoost)(gen, attacker, defender, move, field, desc, usedItems[0], usedItems[1]);
            var newAtk = calculateAttackBWXY(gen, attacker, defender, move, field, desc, isCritical);
            var newDef = calculateDefenseBWXY(gen, attacker, defender, move, field, desc, isCritical);
            hasAteAbilityTypeChange = hasAteAbilityTypeChange &&
                attacker.hasAbility('Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate', 'Normalize');
            if ((move.dropsStats && move.timesUsed > 1)) {
                stabMod = (0, util_2.getStabMod)(attacker, move, desc);
            }
            var newBasePower = calculateBasePowerBWXY(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc);
            var newBaseDamage = (0, util_2.getBaseDamage)(attacker.level, newBasePower, newAtk, newDef);
            var newFinalMods = calculateFinalModsBWXY(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness, times);
            var newFinalMod = (0, util_2.chainMods)(newFinalMods, 41, 131072);
            var damageMultiplier = 0;
            damage = damage.map(function (affectedAmount) {
                var newFinalDamage = (0, util_2.getFinalDamage)(newBaseDamage, damageMultiplier, typeEffectiveness, applyBurn, stabMod, newFinalMod);
                damageMultiplier++;
                return affectedAmount + newFinalDamage;
            });
        };
        for (var times = 1; times < numAttacks; times++) {
            _loop_1(times);
        }
        desc.defenseBoost = origDefBoost;
        desc.attackBoost = origAtkBoost;
    }
    result.damage = childDamage ? [damage, childDamage] : damage;
    return result;
}
exports.calculateBWXY = calculateBWXY;
function calculateBasePowerBWXY(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc, hit) {
    if (hit === void 0) { hit = 1; }
    var basePower;
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    switch (move.name) {
        case 'Payback':
            basePower = move.bp * (turnOrder === 'last' ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Synchronoise':
            basePower = move.bp * ((defender.hasType(attacker.types[0]) || (attacker.types[1] && defender.hasType(attacker.types[1]))) ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Pursuit':
            var switching = field.defenderSide.isSwitching === 'out';
            basePower = move.bp * (switching ? 2 : 1);
            if (switching)
                desc.isSwitching = 'out';
            desc.moveBP = basePower;
            break;
        case 'Electro Ball':
            if (defender.stats.spe === 0)
                defender.stats.spe = 1;
            var r = Math.floor(attacker.stats.spe / defender.stats.spe);
            basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
            desc.moveBP = basePower;
            break;
        case 'Gyro Ball':
            if (attacker.stats.spe === 0)
                attacker.stats.spe = 1;
            basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe) + 1);
            desc.moveBP = basePower;
            break;
        case 'Punishment':
            basePower = Math.min(200, 60 + 20 * (0, util_2.countBoosts)(gen, defender.boosts));
            desc.moveBP = basePower;
            break;
        case 'Low Kick':
        case 'Grass Knot':
            var w = (0, util_2.getWeight)(defender, desc, 'defender');
            basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Hex':
        case 'Infernal Parade':
        case 'Shadow Sorcery':
            basePower = move.bp * (defender.status ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Heavy Slam':
        case 'Heat Crash':
            var wr = (0, util_2.getWeight)(attacker, desc, 'attacker') /
                (0, util_2.getWeight)(defender, desc, 'defender');
            basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
            desc.moveBP = basePower;
            break;
        case 'Stored Power':
        case 'Power Trip':
        case 'Snuggle Bug':
            basePower = 20 + 20 * (0, util_2.countBoosts)(gen, attacker.boosts);
            desc.moveBP = basePower;
            break;
        case 'Shadow Punish':
            basePower = 55 + 30 * (0, util_2.countBoosts)(gen, defender.boosts);
            desc.moveBP = basePower;
            break;
        case 'Acrobatics':
            basePower = move.bp * (attacker.hasItem('Flying Gem') || !attacker.item ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Assurance':
            basePower = move.bp * (defender.hasAbility('Parental Bond (Child)') ? 2 : 1);
            break;
        case 'Wake-Up Slap':
            basePower = move.bp * (defender.hasStatus('slp') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Smelling Salts':
            basePower = move.bp * (defender.hasStatus('par') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Weather Ball':
            basePower = move.bp * (field.weather && !field.hasWeather('Strong Winds') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Fling':
            basePower = (0, items_1.getFlingPower)(attacker.item);
            desc.moveBP = basePower;
            desc.attackerItem = attacker.item;
            break;
        case 'Eruption':
        case 'Icefall':
        case 'Water Spout':
            basePower = Math.max(1, Math.floor((150 * attacker.curHP()) / attacker.maxHP()));
            desc.moveBP = basePower;
            break;
        case 'Flail':
        case 'Reversal':
        case 'Shadow Vengeance':
            var p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
            basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Nature Power':
            if (gen.num === 5) {
                move.category = 'Physical';
                move.target = 'allAdjacent';
                basePower = 100;
                desc.moveName = 'Earthquake';
            }
            else {
                move.category = 'Special';
                move.secondaries = true;
                switch (field.terrain) {
                    case 'Electric':
                        basePower = 90;
                        desc.moveName = 'Thunderbolt';
                        break;
                    case 'Grassy':
                        basePower = 90;
                        desc.moveName = 'Energy Ball';
                        break;
                    case 'Misty':
                        basePower = 95;
                        desc.moveName = 'Moonblast';
                        break;
                    default:
                        basePower = 80;
                        desc.moveName = 'Tri Attack';
                }
            }
            break;
        case 'Triple Kick':
            basePower = hit * 20;
            desc.moveBP = move.hits === 2 ? 60 : move.hits === 3 ? 120 : 10;
            break;
        case 'Crush Grip':
        case 'Wring Out':
            basePower = 100 * Math.floor((defender.curHP() * 4096) / defender.maxHP());
            basePower = Math.floor(Math.floor((120 * basePower + 2048 - 1) / 4096) / 100) || 1;
            desc.moveBP = basePower;
            break;
        default:
            basePower = move.bp;
    }
    if (basePower === 0) {
        return 0;
    }
    var bpMods = calculateBPModsBWXY(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder);
    basePower = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((basePower * (0, util_2.chainMods)(bpMods, 41, 2097152)) / 4096)));
    return basePower;
}
exports.calculateBasePowerBWXY = calculateBasePowerBWXY;
function calculateBPModsBWXY(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder) {
    var bpMods = [];
    var resistedKnockOffDamage = !defender.item ||
        (defender.named('Giratina-Origin') && defender.hasItem('Griseous Orb')) ||
        (defender.name.includes('Arceus') && defender.item.includes('Plate')) ||
        (defender.name.includes('Genesect') && defender.item.includes('Drive')) ||
        (defender.named('Groudon', 'Groudon-Primal') && defender.hasItem('Red Orb')) ||
        (defender.named('Kyogre', 'Kyogre-Primal') && defender.hasItem('Blue Orb')) ||
        (defender.named('Kiwuit') && defender.hasAbility('Ambrosia') && defender.item && gen.items.get((0, util_1.toID)(defender.item)).isBerry) ||
        (defender.named('Meganium') && defender.hasItem('Fragrent Herb')) ||
        (defender.named('Tropius') && defender.hasItem('Banana Bunch')) ||
        (defender.named('Shedinja') && defender.hasItem('Cursed Crown')) ||
        (defender.named('Happiny') && defender.hasItem('Oval Stone')) ||
        (defender.named('Probopass') && defender.hasItem('Magnetic Stone')) ||
        (defender.named('Osteokhan') && defender.hasItem('Bone Baton')) ||
        (defender.named('Darmanitan', 'Darmanizen') && defender.hasItem('Calm Candy Bar')) ||
        (defender.named('Chansey') && defender.hasItem('Lucky Punch')) ||
        (defender.named('Gallade') && defender.hasItem('Knight\'s Edge')) ||
        (defender.named('Absol') && defender.hasItem('Night\'s Edge')) ||
        (defender.name.includes('Vespiquen') && defender.hasItem('Royal Jelly')) ||
        (defender.name.includes('Meowth') && defender.hasItem('Amulet Coin')) ||
        (defender.named('Magmortar') && defender.hasItem('Magmarizer')) ||
        (defender.named('Electivire') && defender.hasItem('Electirizer')) ||
        (defender.name.includes('Cherrim') && defender.hasItem('Cerise Orb')) ||
        (defender.name.includes('Phione') && defender.hasItem('Teal Orb'));
    if (!resistedKnockOffDamage && defender.item) {
        var item = gen.items.get((0, util_1.toID)(defender.item));
        resistedKnockOffDamage = !!(item.megaEvolves && defender.name.includes(item.megaEvolves)) ||
            (defender.named('Gyarados-Alarix', 'Gyarados-Mega-Alarix') && defender.hasItem('Alarixite'));
    }
    if ((attacker.hasAbility('Technician') && basePower <= 60) ||
        (attacker.hasAbility('Flare Boost') &&
            attacker.hasStatus('brn') && move.category === 'Special') ||
        (attacker.hasAbility('Toxic Boost') &&
            attacker.hasStatus('psn', 'tox') && move.category === 'Physical')) {
        bpMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Analytic') && turnOrder !== 'first') {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Sand Force') && field.hasWeather('Sand') && move.hasType('Rock', 'Ground', 'Steel')) ||
        (attacker.hasAbility('Squall') && move.hasType('Flying', 'Water', 'Electric') && field.hasWeather('Rain', 'Heavy Rain'))) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
        desc.weather = field.weather;
    }
    else if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
        (attacker.hasAbility('Iron Fist') && move.flags.punch) ||
        (attacker.hasAbility('Cunning Blade') && move.flags.blade)) {
        bpMods.push(4915);
        desc.attackerAbility = attacker.ability;
    }
    if ((defender.hasAbility('Heatproof') && move.hasType('Fire')) ||
        (defender.hasAbility('Pure Heart', 'Shadow Armor') && move.hasType('Shadow'))) {
        bpMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
        bpMods.push(5120);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasAbility('High Caliber') && move.flags.bullet) {
        bpMods.push(5325);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasAbility('Sheer Force') && move.secondaries) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasAbility('Rivalry') && ((defender.hasType(attacker.types[0]) || (attacker.types[1] && defender.hasType(attacker.types[1]))))) {
        if (attacker.gender === defender.gender) {
            bpMods.push(4915);
        }
        desc.attackerAbility = attacker.ability;
    }
    if ((attacker.item && (0, items_1.getItemBoostType)(attacker.item) === move.type) ||
        (attacker.named('Darmanitan', 'Darmanizen') && attacker.hasItem('Calm Candy Bar') && move.category === 'Special')) {
        bpMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    else if ((attacker.hasItem('Muscle Band') && move.category === 'Physical') ||
        (attacker.hasItem('Wise Glasses') && move.category === 'Special')) {
        bpMods.push(4505);
        desc.attackerItem = attacker.item;
    }
    else if ((attacker.hasItem('Adamant Orb') &&
        attacker.named('Dialga') &&
        move.hasType('Steel', 'Dragon')) ||
        (attacker.hasItem('Lustrous Orb') &&
            attacker.named('Palkia') &&
            move.hasType('Water', 'Dragon')) ||
        (attacker.hasItem('Griseous Orb') &&
            attacker.named('Giratina-Origin') &&
            move.hasType('Ghost', 'Dragon'))) {
        bpMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    else if (attacker.hasItem("".concat(move.type, " Gem"))) {
        bpMods.push(gen.num > 5 ? 5325 : 6144);
        desc.attackerItem = attacker.item;
    }
    else if ((attacker.hasItem('Electirizer') && attacker.named('Electivire') && move.hasType('Electric')) ||
        (attacker.hasItem('Magmarizer') && attacker.named('Magmortar') && move.hasType('Fire'))) {
        bpMods.push(6144);
        desc.attackerItem = attacker.item;
    }
    if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox')) ||
        (move.named('Brine') && defender.curHP() <= defender.maxHP() / 2) ||
        (move.named('Venoshock') && defender.hasStatus('psn', 'tox'))) {
        bpMods.push(8192);
        desc.moveBP = basePower * 2;
    }
    else if (gen.num > 5 && move.named('Knock Off') && !resistedKnockOffDamage) {
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if (move.named('Solar Beam') && field.hasWeather('Rain', 'Heavy Rain', 'Sand', 'Hail', 'Miasma')) {
        bpMods.push(2048);
        desc.moveBP = basePower / 2;
        desc.weather = field.weather;
    }
    if (field.attackerSide.isHelpingHand) {
        bpMods.push(6144);
        desc.isHelpingHand = true;
    }
    if (hasAteAbilityTypeChange) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
        (attacker.hasAbility('Strong Jaw') && move.flags.bite) ||
        (attacker.hasAbility('Escape Artist') && move.named('Flip Turn', 'U-turn', 'Volt Switch', 'Shadow Pivot', 'Propulsion Shot'))) {
        bpMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Tough Claws') && move.flags.contact) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Unsheathed') && move.flags.blade) ||
        (attacker.hasAbility('Striker') && move.flags.kick)) {
        bpMods.push(4915);
        desc.attackerAbility = attacker.ability;
    }
    var aura = "".concat(move.type, " Aura");
    var isAttackerAura = attacker.hasAbility(aura);
    var isDefenderAura = defender.hasAbility(aura);
    var isUserAuraBreak = attacker.hasAbility('Aura Break') || defender.hasAbility('Aura Break');
    var isFieldAuraBreak = field.isAuraBreak;
    var isFieldFairyAura = field.isFairyAura && move.type === 'Fairy';
    var isFieldDarkAura = field.isDarkAura && move.type === 'Dark';
    var auraActive = isAttackerAura || isDefenderAura || isFieldFairyAura || isFieldDarkAura;
    var auraBreak = isFieldAuraBreak || isUserAuraBreak;
    if (auraActive) {
        if (auraBreak) {
            bpMods.push(3072);
            desc.attackerAbility = attacker.ability;
            desc.defenderAbility = defender.ability;
        }
        else {
            bpMods.push(5448);
            if (isAttackerAura)
                desc.attackerAbility = attacker.ability;
            if (isDefenderAura)
                desc.defenderAbility = defender.ability;
        }
    }
    if ((0, util_2.isGrounded)(attacker, field)) {
        if ((field.hasTerrain('Electric') && move.hasType('Electric')) ||
            (field.hasTerrain('Grassy') && move.hasType('Grass'))) {
            bpMods.push(6144);
            desc.terrain = field.terrain;
        }
    }
    if ((0, util_2.isGrounded)(defender, field)) {
        if ((field.hasTerrain('Misty') && move.hasType('Dragon')) ||
            (field.hasTerrain('Grassy') && move.named('Bulldoze', 'Earthquake'))) {
            bpMods.push(2048);
            desc.terrain = field.terrain;
        }
    }
    return bpMods;
}
exports.calculateBPModsBWXY = calculateBPModsBWXY;
function calculateAttackBWXY(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var attack;
    var attackSource = move.named('Foul Play') ? defender : attacker;
    var attackStat = move.category === 'Special' ? 'spa' : 'atk';
    desc.attackEVs =
        move.named('Foul Play')
            ? (0, util_2.getEVDescriptionText)(gen, defender, attackStat, defender.nature)
            : (0, util_2.getEVDescriptionText)(gen, attacker, attackStat, attacker.nature);
    if (attackSource.boosts[attackStat] === 0 ||
        (isCritical && attackSource.boosts[attackStat] < 0)) {
        attack = attackSource.rawStats[attackStat];
    }
    else if ((defender.hasAbility('Unaware')) || (defender.named('Meganium') && defender.hasItem('Fragrent Herb'))) {
        attack = attackSource.rawStats[attackStat];
        desc.defenderAbility = defender.ability;
    }
    else {
        attack = (0, util_2.getModifiedStat)(attackSource.rawStats[attackStat], attackSource.boosts[attackStat]);
        desc.attackBoost = attackSource.boosts[attackStat];
    }
    if (attacker.hasAbility('Hustle') && move.category === 'Physical') {
        attack = (0, util_2.pokeRound)((attack * 3) / 2);
        desc.attackerAbility = attacker.ability;
    }
    var atMods = calculateAtModsBWXY(gen, attacker, defender, move, field, desc);
    attack = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((attack * (0, util_2.chainMods)(atMods, 410, 131072)) / 4096)));
    return attack;
}
exports.calculateAttackBWXY = calculateAttackBWXY;
function calculateAtModsBWXY(gen, attacker, defender, move, field, desc) {
    var _a;
    var atMods = [];
    if ((defender.hasAbility('Thick Fat') && move.hasType('Fire', 'Ice')) ||
        (defender.hasAbility('Primal Warmth') && move.hasType('Fire', 'Water'))) {
        atMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if ((attacker.hasAbility('Guts') && attacker.status && move.category === 'Physical') ||
        ((attacker.curHP() <= attacker.maxHP() / 4) && (attacker.hasAbility('Adrenalize'))) ||
        (attacker.curHP() <= attacker.maxHP() / 3 &&
            ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
                (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
                (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
                (attacker.hasAbility('Swarm') && move.hasType('Bug')))) ||
        (move.category === 'Special' && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus'))) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
        atMods.push(6144);
        desc.attackerAbility = 'Flash Fire';
    }
    else if (attacker.hasAbility('Syzygy') && ((move.category == 'Special' && move.hasType('Fire')) ||
        (move.category == 'Physical' && move.hasType('Ice')))) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Corona') && move.hasType('Fire')) ||
        (attacker.hasAbility('Royal Guard') && attacker.curHP() <= attacker.maxHP() / 2)) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Shadow Birch') && move.category === 'Physical' && field.hasTerrain('Grassy')) ||
        (attacker.hasAbility('Shadow Ribbons') && move.category === 'Special' && field.hasTerrain('Misty')) ||
        (attacker.hasAbility('Shadow Sparks') && move.category === 'Special' && field.hasTerrain('Electric'))) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if ((field.hasWeather('Sun', 'Harsh Sunshine') && ((attacker.hasAbility('Solar Power') && move.category === 'Special') ||
        (attacker.hasAbility('Solar Boost') && move.category === 'Physical') ||
        ((attacker.named('Cherrim') && attacker.hasAbility('Flower Gift')) && move.category === 'Physical'))) ||
        (field.hasWeather('Hail') && attacker.hasAbility('Ice Breaker') && move.category === 'Physical')) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
        desc.weather = field.weather;
    }
    else if (attacker.hasAbility('Shadow Adaptation') && move.hasType('Shadow')) {
        atMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Galaxian') && field.isGravity && move.category === 'Special') {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (field.attackerSide.isFlowerGift &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        move.category === 'Physical') {
        atMods.push(6144);
        desc.weather = field.weather;
        desc.isFlowerGiftAttacker = true;
    }
    else if ((attacker.hasAbility('Defeatist') && attacker.curHP() <= attacker.maxHP() / 2) ||
        (attacker.hasAbility('Slow Start') && attacker.abilityOn && move.category === 'Physical')) {
        atMods.push(2048);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Huge Power', 'Pure Power') && move.category === 'Physical') ||
        (attacker.hasAbility('Mystic Power') && move.category === 'Special')) {
        atMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Seismography') && move.hasType('Ground')) ||
        (attacker.hasAbility('Stench') && move.hasType('Poison'))) {
        atMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    if ((attacker.hasItem('Thick Club') &&
        attacker.named('Cubone', 'Marowak', 'Marowak-Alola') &&
        move.category === 'Physical') ||
        (attacker.hasItem('Deep Sea Tooth') &&
            attacker.named('Clamperl') &&
            move.category === 'Special') ||
        (attacker.hasItem('Light Ball') && attacker.name.startsWith('Pikachu')) ||
        (attacker.hasItem('Oval Stone') && attacker.name.startsWith('Happiny')) ||
        (move.category == 'Physical' && attacker.hasItem('Lucky Punch') && attacker.named('Chansey')) ||
        (attacker.hasItem('Amulet Coin') && attacker.name.includes('Meowth'))) {
        atMods.push(8192);
        desc.attackerItem = attacker.item;
    }
    else if ((attacker.hasItem('Soul Dew') &&
        attacker.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega') &&
        move.category === 'Special') ||
        (attacker.hasItem('Choice Band') && move.category === 'Physical') ||
        (attacker.hasItem('Choice Specs') && move.category === 'Special') ||
        (move.category === 'Physical' && attacker.hasItem('Bone Baton') && attacker.named('Osteokhan')) ||
        (defender.hasItem('Eviomight') && ((_a = gen.species.get((0, util_1.toID)(defender.name))) === null || _a === void 0 ? void 0 : _a.nfe))) {
        atMods.push(6144);
        desc.attackerItem = attacker.item;
    }
    return atMods;
}
exports.calculateAtModsBWXY = calculateAtModsBWXY;
function calculateDefenseBWXY(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    if (move.named('Combardment') && (defender.stats.def > defender.stats.spd)) {
        move.overrideDefensiveStat = 'spd';
    }
    var defense;
    var defenseStat = move.overrideDefensiveStat || move.category === 'Physical' ? 'def' : 'spd';
    var hitsPhysical = defenseStat === 'def';
    desc.defenseEVs = (0, util_2.getEVDescriptionText)(gen, defender, defenseStat, defender.nature);
    if (defender.boosts[defenseStat] === 0 ||
        ((isCritical || (attacker.hasAbility('Big Pecks') && hitsPhysical)) && defender.boosts[defenseStat] > 0) ||
        move.ignoreDefensive) {
        defense = defender.rawStats[defenseStat];
    }
    else if ((attacker.hasAbility('Unaware')) || (attacker.named('Meganium') && attacker.hasItem('Fragrent Herb'))) {
        defense = defender.rawStats[defenseStat];
        desc.attackerAbility = attacker.ability;
    }
    else {
        defense = (0, util_2.getModifiedStat)(defender.rawStats[defenseStat], defender.boosts[defenseStat]);
        desc.defenseBoost = defender.boosts[defenseStat];
    }
    if (field.hasWeather('Sand') && defender.hasType('Rock') && !hitsPhysical) {
        defense = (0, util_2.pokeRound)((defense * 3) / 2);
        desc.weather = field.weather;
    }
    if (field.hasWeather('Hail') && defender.hasType('Ice') && hitsPhysical) {
        defense = (0, util_2.pokeRound)((defense * 3) / 2);
        desc.weather = field.weather;
    }
    var dfMods = calculateDfModsBWXY(gen, defender, field, desc, hitsPhysical);
    defense = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((defense * (0, util_2.chainMods)(dfMods, 410, 131072)) / 4096)));
    return defense;
}
exports.calculateDefenseBWXY = calculateDefenseBWXY;
function calculateDfModsBWXY(gen, defender, field, desc, hitsPhysical) {
    var _a;
    if (hitsPhysical === void 0) { hitsPhysical = false; }
    var dfMods = [];
    if (defender.hasAbility('Marvel Scale') && defender.status && hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.named('Cherrim') &&
        defender.hasAbility('Flower Gift') &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        !hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
        desc.weather = field.weather;
    }
    else if (field.defenderSide.isFlowerGift &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        !hitsPhysical) {
        dfMods.push(6144);
        desc.weather = field.weather;
        desc.isFlowerGiftDefender = true;
    }
    if (field.hasTerrain('Grassy') && defender.hasAbility('Grass Pelt') && hitsPhysical) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
    }
    if ((!hitsPhysical && defender.hasItem('Soul Dew') &&
        defender.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega')) ||
        (defender.hasItem('Eviolite') && ((_a = gen.species.get((0, util_1.toID)(defender.name))) === null || _a === void 0 ? void 0 : _a.nfe)) ||
        (!hitsPhysical && defender.hasItem('Assault Vest'))) {
        dfMods.push(6144);
        desc.defenderItem = defender.item;
    }
    if ((defender.hasItem('Metal Powder') && defender.named('Ditto') && hitsPhysical) ||
        (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !hitsPhysical)) {
        dfMods.push(8192);
        desc.defenderItem = defender.item;
    }
    if (defender.hasAbility('Fur Coat') && hitsPhysical) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Stall')) {
        dfMods.push(5325);
        desc.defenderAbility = defender.ability;
    }
    return dfMods;
}
exports.calculateDfModsBWXY = calculateDfModsBWXY;
function calculateBaseDamageBWXY(gen, attacker, basePower, attack, defense, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var baseDamage = (0, util_2.getBaseDamage)(attacker.level, basePower, attack, defense);
    var isSpread = field.gameType !== 'Singles' &&
        ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
    if (isSpread) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 3072) / 4096);
    }
    if (attacker.hasAbility('Parental Bond (Child)')) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 2048) / 4096);
    }
    if ((field.hasWeather('Sun', 'Harsh Sunshine') && move.hasType('Fire')) ||
        (field.hasWeather('Rain', 'Heavy Rain') && move.hasType('Water')) ||
        (field.hasWeather('Miasma') && move.hasType('Poison'))) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 6144) / 4096);
        desc.weather = field.weather;
    }
    else if ((field.hasWeather('Sun') && move.hasType('Water')) ||
        (field.hasWeather('Rain') && move.hasType('Fire'))) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 2048) / 4096);
        desc.weather = field.weather;
    }
    if (isCritical) {
        baseDamage = Math.floor((0, util_2.OF32)(baseDamage * (gen.num > 5 ? 1.5 : 2)));
        desc.isCritical = isCritical;
    }
    return baseDamage;
}
function calculateFinalModsBWXY(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness, hitCount) {
    if (isCritical === void 0) { isCritical = false; }
    if (hitCount === void 0) { hitCount = 0; }
    var finalMods = [];
    if (field.defenderSide.isReflect && move.category === 'Physical' && !isCritical) {
        finalMods.push(field.gameType !== 'Singles' ? (gen.num > 5 ? 2732 : 2703) : 2048);
        desc.isReflect = true;
    }
    else if (field.defenderSide.isLightScreen && move.category === 'Special' && !isCritical) {
        finalMods.push(field.gameType !== 'Singles' ? (gen.num > 5 ? 2732 : 2703) : 2048);
        desc.isLightScreen = true;
    }
    if (defender.hasAbility('Multiscale', 'Shadow Shield') && defender.curHP() === defender.maxHP() &&
        hitCount === 0 &&
        !field.defenderSide.isSR && (!field.defenderSide.spikes || !(0, util_2.isGrounded)(defender, field)) &&
        !attacker.hasAbility('Parental Bond (Child)')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
        finalMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    if (defender.hasAbility('Royal Guard') && defender.curHP() <= defender.maxHP() / 2) {
        finalMods.push(3072);
        desc.defenderAbility = defender.ability;
    }
    if (field.defenderSide.isFriendGuard) {
        finalMods.push(3072);
        desc.isFriendGuard = true;
    }
    if (attacker.hasAbility('Sniper') && isCritical) {
        finalMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    if (defender.hasAbility('Solid Rock', 'Filter') && typeEffectiveness > 1) {
        finalMods.push(3072);
        desc.defenderAbility = defender.ability;
    }
    if (defender.hasAbility('Bagwormicade') && typeEffectiveness > 1) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (defender.hasAbility('Enfeebling Venom') && attacker.hasStatus('psn', 'tox')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasItem('Metronome') && move.timesUsedWithMetronome >= 1) {
        var timesUsedWithMetronome = Math.floor(move.timesUsedWithMetronome);
        if (timesUsedWithMetronome <= 4) {
            finalMods.push(4096 + timesUsedWithMetronome * 819);
        }
        else {
            finalMods.push(8192);
        }
        desc.attackerItem = attacker.item;
    }
    if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1 && !move.isZ) {
        finalMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    else if (attacker.hasItem('Life Orb')) {
        finalMods.push(5324);
        desc.attackerItem = attacker.item;
    }
    if (move.hasType((0, items_1.getBerryResistType)(defender.item)) &&
        (typeEffectiveness > 1 || move.hasType('Normal')) &&
        hitCount === 0 &&
        !attacker.hasAbility('Unnerve')) {
        finalMods.push(2048);
        desc.defenderItem = defender.item;
    }
    return finalMods;
}
//# sourceMappingURL=gen56.js.map