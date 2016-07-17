/// <reference path="../typings/mongodb/mongodb.d.ts" />
import { euglena_template } from "euglena.template";
import { euglena } from "euglena";
import Particle = euglena.being.Particle;
export declare class Organelle extends euglena_template.being.alive.organelles.DbOrganelle {
    private euglenaInfos;
    private db;
    constructor();
    receive(particle: Particle): void;
    private generateQuery(particle);
}
