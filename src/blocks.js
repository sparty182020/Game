// @ts-nocheck
import { SolidBlock, LiquidBlock, GasBlock, AmbientBlock } from "./gameobj";

class Lava extends LiquidBlock {}

class Water extends LiquidBlock {}

class Air extends GasBlock {}

class Spikes extends AmbientBlock {}

class Wall extends SolidBlock {}

class Brick extends Wall {}

class Smoke extends GasBlock {}

class Acid extends LiquidBlock {}