/// <reference path="../typings/mongodb/mongodb.d.ts" />
import { euglena_template } from "euglena.template";
export declare class Organelle extends euglena_template.being.alive.organelles.DbOrganelle {
    private db;
    constructor();
    protected onGettingAlive(): void;
    private generateQuery(particle);
}
