import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { Research } from "../research/research";
import { FleetManager } from "./fleetManager";

export enum Sizes {
  Small = 1,
  Medium,
  Large,
  ExtraLarge
}
export const ALL_SIZES = [
  Sizes.Small,
  Sizes.Medium,
  Sizes.Large,
  Sizes.ExtraLarge
];
const sizeNames = [
  ["S", "Small"],
  ["M", "Medium"],
  ["L", "Large"],
  ["XL", "ExtraLarge"]
];
export function getSizeName(size: Sizes, short = false): string {
  return sizeNames[size - 1][short ? 0 : 1];
}
export interface IModuleData {
  id: string;
  name: string;
  sizes: Sizes[];
  alloyPrice: DecimalSource;
  energyBalance?: DecimalSource;
  damage?: DecimalSource;
  armorPercent?: number;
  shieldPercent?: number;
  shield?: DecimalSource;
  armor?: DecimalSource;
  nextToUnlock?: string[];
  researchPrice?: number;
  shape?: string;
  explosionChance?: number;
  start?: boolean;
}
export class Module extends AbstractUnlockable {
  research: Research;
  nextToUnlock: string[];
  researchPrice = 100;
  shape?: string;

  constructor(
    id: string,
    name: string,
    public sizes: Sizes[] = [Sizes.Small],
    public alloyPrice: Decimal = new Decimal(0),
    public energyBalance: Decimal = new Decimal(0),
    public damage: Decimal = new Decimal(0),
    public armorPercent = 100,
    public shieldPercent = 100,
    public shield: Decimal = new Decimal(0),
    public armor: Decimal = new Decimal(0),
    public explosionChance = 0,
    public start = false
  ) {
    super();

    this.id = id;
    this.name = name;
  }

  static fromData(data: IModuleData): Module {
    const ret = new Module(data.id, data.name, data.sizes);
    if (data.alloyPrice) ret.alloyPrice = new Decimal(data.alloyPrice);
    if (data.energyBalance) ret.energyBalance = new Decimal(data.energyBalance);
    if (data.damage) ret.damage = new Decimal(data.damage);
    if (data.shield) ret.shield = new Decimal(data.shield);
    if (data.armor) ret.armor = new Decimal(data.armor);
    if (data.armorPercent) ret.armorPercent = data.armorPercent;
    if (data.shieldPercent) ret.shieldPercent = data.shieldPercent;
    if (data.nextToUnlock) ret.nextToUnlock = data.nextToUnlock;
    if (data.researchPrice) ret.researchPrice = data.researchPrice;
    if (data.explosionChance) ret.explosionChance = data.explosionChance;
    if (data.start) ret.start = data.start;
    ret.shape = data.shape ? data.shape : "flask";
    return ret;
  }

  reload() {
    this.unlocked = this.start || (!this.research || this.research.firstDone);
  }
  unlock(): boolean {
    if (!super.unlock()) return false;
    FleetManager.getInstance().unlockedModules.push(this);
    FleetManager.getInstance().reorderModules();
  }
}
