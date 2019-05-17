import { Vector2 } from "three";

import { Constructor } from "./constructor";
import { Cell, Transport } from "./tile";

export interface ActionStill {
    type: "still";
}

export interface ActionMove {
    type: "move";
    dir: Vector2;
}

export interface ActionBuild {
    type: "build";
    cellType: Constructor<Cell>;
    position: Vector2;
}

export interface ActionDeconstruct {
    type: "deconstruct";
    position: Vector2;
}

export interface ActionBuildTransport {
    type: "build-transport";
    cellType: Constructor<Transport>;
    position: Vector2;
    dir: Vector2;
}

export interface ActionDrop {
    type: "drop";
    water: number;
    sugar: number;
}

export interface ActionNone {
    type: "none";
}

export type Action = ActionStill | ActionMove | ActionBuild | ActionDeconstruct | ActionBuildTransport | ActionDrop | ActionNone;
