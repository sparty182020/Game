// @ts-nocheck
import { PassiveEntity, NeutralEntity, HostileEntity, Player, Container, OtherEntity } from "./gameobj";

class User extends Player {
    constructor(id) {
        super(id)
    }
}

export { User }