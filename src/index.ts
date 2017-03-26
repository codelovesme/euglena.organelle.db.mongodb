
/// <reference path="../typings/mongodb/mongodb.d.ts" />
"use strict";
import * as mongodb from "mongodb";
import { euglena_template } from "euglena.template";
import { euglena } from "euglena";
import Particle = euglena.being.Particle;
import EuglenaInfo = euglena_template.being.alive.particle.EuglenaInfo;

const OrganelleName = "DbOrganelleImplMongoDb";
let this_: Organelle = null;
export class Organelle extends euglena_template.being.alive.organelle.DbOrganelle {
    private db: mongodb.Db;
    private sapContent: euglena_template.being.alive.particle.DbOrganelleSapContent;
    constructor() {
        super(OrganelleName);
        this_ = this;
    }
    protected bindActions(addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void): void {
        addAction(euglena_template.being.alive.constants.particles.DbOrganelleSap, (particle, callback) => {
            this_.sapContent = particle.data;
            this_.getAlive();
        });
        addAction(euglena_template.being.alive.constants.particles.ReadParticle, (particle, callback) => {
            this_.db.collection("particles").find({ meta: particle.data.meta }).toArray((err, doc) => {
                let p = doc && doc.length > 0 ? doc[0] : new euglena_template.being.alive.particle.Exception(
                    new euglena.sys.type.Exception("There is no particle for given reference."), "mongodb");
                if (callback) {
                    callback(p);
                } else {
                    this_.send(p, this_.name);
                }
            });
        });
        addAction(euglena_template.being.alive.constants.particles.ReadParticles, (particle, callback) => {
            this_.db.collection("particles").find({ meta: particle.data.meta }).toArray((err, doc) => {
                let p = new euglena_template.being.alive.particle.Particles(doc || [], this.sapContent.euglenaName);
                if (callback) {
                    callback(p);
                } else {
                    this_.send(p, this_.name);
                }
            });
        });
        addAction(euglena_template.being.alive.constants.particles.RemoveParticle, (particle) => {
            this_.db.collection("particles").findOneAndDelete({ meta: particle.data.meta }, (err, doc) => {
                //TODO
            });
        });
        addAction(euglena_template.being.alive.constants.particles.SaveParticle, (particle) => {
            this.db.collection("particles").findOneAndUpdate({ meta: particle.data.meta }, particle.data, { upsert: true }, (err, document) => {
                if (err) {
                    //TODO
                } else {
                    // this2_.send(new euglena_template.being.alive.particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, euglena_template.being.alive.constants.organelles.Db));
                }
            });
        });
    }
    private getAlive() {
        mongodb.MongoClient.connect("mongodb://" + this.sapContent.url + ":" + this.sapContent.port + "/" + this.sapContent.databaseName, (err, db) => {
            if (!err) {
                this.db = db;
                this_.send(new euglena_template.being.alive.particle.DbIsOnline("this"), this_.name);
            } else {
                //TODO
            }
        });
    }
}

