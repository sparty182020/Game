// @ts-nocheck
//! Main Object
class GameObKOject {
    constructor(objType,id) {
        const validTypes = ["effect","invObj","block","entity"];
        if (!validTypes.includes(objType)) throw new TypeError("Invalid GameObj Type")
        this.id = id
        this.objType = objType
    }
}

//! Effects
class Effect extends GameObject {
    constructor (type,id) {
        super("effect",id)
        const validTypes = ["passive","potion","instant"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Potion Type")
        this.effectType = type
    }
}

class PassiveEffect extends Effect {
    mod = {
        health: {
            ammount: 1,
            type: 1
        },
        strength: {
            ammount: 1,
            type: 1
        },
        defense: {
            ammount: 1,
            type: 1
        },
        stamina: {
            ammount: 1,
            type: 1
        }
    }
    constructor(id) {
        super("passive",id)
    }
    changeHealthMod(ammount,type) {
        this.mod.health = {ammount: ammount, type: type}   
    }
    changeStrengthMod(ammount,type) {
        this.mod.strength = {ammount: ammount, type: type} 
    }
    changeDefenseMod(ammount,type) {
        this.mod.defense = {ammount: ammount, type: type} 
    }
    changeStaminaMod(ammount,type) {
        this.mod.stamina = {ammount: ammount, type: type} 
    }
}

class PotionEffect extends Effect {
    effect
    #length
    constructor(id) {
        super("potion",id)
        this.effect = {
            id: id,
            mod: []
        }
    }
    setType(type) {
        const validTypes = ["positive","negitive","neutral"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Potion Type")
    }
    addMod(data) {
        this.effect.mod.push(data)
    }
    grabMods() {
        return this.effect.mod
    }
}

class PermEffect extends PotionEffect {
    constructor(id) {
        super(id)
    }
}

class InstantEffect extends Effect {
    effect = {
        type,
        ammount,
        duration,
    }
    constructor(id) {
        super("instant",id)
    }
    setType(type) {
        this.effect.type = type
    }
    setAmmount(ammount) {
        this.effect.ammount = ammount
    }
    setDuration(duration) {
        this.effect.duration = duration
    }
}

//! Items
class Item extends GameObject{
    constructor(type, id) {
        super("invObj",id)
        const validTypes = ["food","weapon","tool","armor","other"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Item Type");
        this.type = type
    }
    #getdata() {

    }
}

class Food extends Item {
    stats
    id
    constructor(id) {
        super('food',id)
        this.id = id
        this.stats = {
            sat: 0,
            /**
             * @type {InstantEffect[]}
             */
            effects: []
        }
    }
    setSaturation(sat) {
        this.stats.sat = sat
    }
    addEffects(effect) {
        this.stats.effects.push(effect)
    }
    /**
     * @param {LivingEntity} entity
     */
    eat(entity) {
        const { sat, effects } = this.stats
        effects.forEach((data) => {
            switch (data.effect.type) {
                case 'health':
                    entity.addHealth(data.effect.ammount)
                    delete this
                    break;
            }
        })
    }
}

class Weapon extends Item {
    damage = 1
    /**
     * @type {PotionEffect[] | never[]}
     */
    effects = []
    constructor(id,type) {
        super('weapon',id)
        const validTypes = ["sword","axe","arrow"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Weapon Type")
        this.weaponType = type
    }
    setDamage(damage) {
        this.damage = damage
    }
    addDamage(damage) {
        this.damage += damage
    }
    removeDamage(damage) {
        this.damage -= damage
        if (this.damage < 0) this.setDamage(0)
    }
    addEffect(effect) {
        this.effects.push(effect)
    }
}

class Sword extends Weapon {}

class Axe extends Weapon {}

class Arrow extends Weapon {}

class Tool extends Item {
    constructor(id) {
        super('tool',id)
    }
}

class Armor extends Item {
    constructor(id) {
        super('armor',id)
    }
}

class Helmet extends Armor {}

class Chestplate extends Armor {}

class Pants extends Armor {}

class Boots extends Armor {}

class Shield extends Armor {}

class OtherItem extends Item {
    constructor(id) {
        super('other',id)
    }
}

//! Blocks
class Block extends GameObject {
    constructor (type,id) {
        super("block",id)
        const validTypes = ["solid","liquid","gas","ambient"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Block Type")
        this.type = type
    }
}

class SolidBlock extends Block {
    constructor(id) {
        super("solid",id)
    }
}

class LiquidBlock extends Block {
    constructor(id) {
        super("liquid",id)
    }
}

class GasBlock extends Block {
    constructor(id) {
        super("gas",id)
    }
}

class AmbientBlock extends Block {
    constructor(id) {
        super("ambient",id)
    }
}

//! Entities
class Entity extends GameObject {
    constructor(type,id) {
        super("entity",id)
        const validTypes = ["living","inanimate"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Entity");
    }
}

class LivingEntity extends Entity {
    health = 10
    strength = 1
    defense = 0
    stamina = [10,10] //current,max
    inventory = []
    effectTracker = []
    constructor(type, id) {
        super("living",id)
        const validTypes = ["passive","neutral","agressive","player"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Living Entity");
        this.type = type
    }
    setHealth(health) {
        this.health = health
    }
    addHealth(health) {
        this.health += health
    }
    removeHealth(health) {
        this.health -= health
        if (this.health < 0) this.setHealth(0);
    }
    setStrength(strength) {
        this.strength = strength
    }
    addStrength(strength) {
        this.strength += strength
    }
    removeStrength(strength) {
        this.strength -= strength
        if (this.strength < 0) this.setStrength(0);
    }
    setDefense(defense) {
        this.defense = defense
    }
    addDefense(defense) {
        this.defense += defense
    }
    removeDefense(defense) {
        this.defense -= defense
        if (this.defense < 0) this.setDefense(0);
    }
    setMaxStamina(stamina) {
        this.stamina[1] = stamina
    }
    setCurrentStamina(stamina) {
        this.stamina[0] = stamina
        if (this.stamina[0] > this.stamina[1]) this.setCurrentStamina(this.stamina[1])
    }
    addMaxStamina(stamina) {
        this.stamina[1] += stamina
    }
    addCurrentStamina(stamina) {
        this.stamina[0] += stamina
        if (this.stamina[0] > this.stamina[1]) this.setCurrentStamina(this.stamina[1])
    }
    removeMaxStamina(stamina) {
        this.stamina[1] -= stamina
        if (this.stamina[1] < 0) this.setMaxStamina(0)
        if (this.stamina[0] > this.stamina[1]) this.setCurrentStamina(this.stamina[1])
    }
    removeCurrentStamina(stamina) {
        this.stamina[0] = stamina
        if (this.stamina[0] < 0) this.setCurrentStamina(0)
    }
    setInventory(inventory) {
        this.inventory = inventory
    }
    putToSlot(slot, item) {
        this.inventory[slot] = item
    }
    clearSlot(slot) {
        this.inventory[slot] = undefined
    }
    addEffects(type,perm,ammount,duration) {
        const validTypes = ["health","strength","defense","stamina"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Player Effect Type")
        switch (type) {
            case 'health':
                this.addHealth(ammount)
                break;
            case 'strength':
                const entity = this
                const currentStrength = this.strength
                const timeout = (perm) ? setTimeout(function() {
                    entity.setStrength(currentStrength)
                },duration) : undefined
                this.addStrength(ammount)
                const tmd = {
                    id: timeout,
                    type: 'strength'
                }
                if (!isNaN(timeout)) this.effectTracker.push(tmd);
                break;
            case 'defense':
                const entity = this
                const currentDefense = this.defense
                const timeout = (perm) ? setTimeout(function() {
                    entity.setDefense(currentDefense)
                },duration) : undefined
                this.addDefense(ammount)
                const tmd = {
                    id: timeout,
                    type: 'defense'
                }
                if (!isNaN(timeout)) this.effectTracker.push(tmd);
                break;
            case 'stamina':
                (perm) ? this.addMaxStamina(ammount) : this.addCurrentStamina(ammount)
                break;
            default:
                throw new TypeError("Invalid Player Effect Type")
        }
    }
    /**
     * @param {Entity} target
     * @param {Weapon} weapon
     */
    getDamage(target, weapon, strength) {
        const def = target.defense
        const rawDamage = weapon.damage + strength
        const approxDamage = Math.round(rawDamage - def)
        return approxDamage
    }
    dealDamage(ammount) {
        this.removeHealth(ammount)
    }
}

class PassiveEntity extends LivingEntity {
    constructor (id) {
        super("passive",id)
    }
}

class NeutralEntity extends LivingEntity {
    constructor(id) {
        super("neutral",id)
    }
}

class HostileEntity extends LivingEntity {
    constructor(id) {
        super("hostile",id)
    }
}

class Player extends LivingEntity {
    constructor(id) {
        super("player",id)
    }
}

class InanimateEntity extends Entity {
    constructor(type,id) {
        super("inanimate",id)
        const validTypes = ["holder","other"]
        if (!validTypes.includes(type)) throw new TypeError("Invalid Inanimate Entity");
    }
}

class Container extends InanimateEntity {
    constructor(id) {
        super("holder",id)
    }
}

class OtherEntity extends InanimateEntity {
    constructor(id) {
        super("other",id)
    }
}

export {
    GameObject,
    // Splitter
    Item,
    Food,
    Weapon,
    Sword,
    Axe,
    Arrow,
    Tool,
    Armor,
    OtherItem,
    // Spliier
    Effect,
    PassiveEffect,
    PotionEffect,
    PermEffect,
    InstantEffect,
    // Splitter
    Block,
    SolidBlock,
    LiquidBlock,
    GasBlock,
    AmbientBlock,
    // Splitter
    Entity,
    LivingEntity,
    PassiveEntity,
    NeutralEntity,
    HostileEntity,
    Player,
    InanimateEntity,
    Container,
    OtherEntity
}