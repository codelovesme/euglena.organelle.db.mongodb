/// <reference path="../typings/mongodb/mongodb.d.ts" />
import { euglena_template } from "euglena.template";
import { euglena } from "euglena";
import Particle = euglena.being.Particle;
export declare class Organelle extends euglena_template.being.alive.organelle.DbOrganelle {
    private db;
    private sapContent;
    constructor();
    protected bindActions(addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void): void;
    private getAlive();
}
