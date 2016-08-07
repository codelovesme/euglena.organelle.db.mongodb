
/// <reference path="../typings/mongodb/mongodb.d.ts" />
"use strict";
import * as mongodb from "mongodb";
import {euglena_template} from "euglena.template";
import {euglena} from "euglena";
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
    protected bindActions(addAction: (particleName: string, action: (particle: Particle) => void) => void): void {
        addAction(euglena_template.being.alive.constants.particles.DbOrganelleSap,(particle)=>{
            this_.sapContent = particle.content;
            this_.getAlive();
        });
        addAction(euglena_template.being.alive.constants.impacts.ReadParticle, (particle) => {
            let query = this_.generateQuery(particle);
            this_.db.collection("particles").find(query).toArray((err, doc) => {
                this_.send(doc && doc.length > 0 ? doc[0] : new euglena_template.being.alive.particle.Exception(
                    new euglena.sys.type.Exception("There is no particle for given reference."), "mongodb"
                ));
            });
        });
        addAction(euglena_template.being.alive.constants.impacts.ReadParticles, (particle) => {
            this_.db.collection("particles").find({ of: particle.content }).toArray((err, doc) => {
                for (var index = 0; index < doc.length; index++) {
                    //response(doc[index]);
                }
            });
        });
        addAction(euglena_template.being.alive.constants.impacts.RemoveParticle, (particle) => {
            let query = this_.generateQuery(particle);
            this_.db.collection("particles").findOneAndDelete(query, (err, doc) => {
                //TODO
            });
        });
        addAction(euglena_template.being.alive.constants.impacts.SaveParticle, (particle) => {
            let query = this_.generateQuery(particle);
            this.db.collection("particles").findOneAndUpdate(query, particle.content, { upsert: true }, (err, document) => {
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
                this_.send(new euglena_template.being.alive.particle.DbIsOnline("this"));
            } else {
                //TODO
            }
        });
    }
    private generateQuery(particle: Particle): any {
        let query: any = { name: particle.content.name, of: particle.content.of };
        if (particle.content.primaryKeys) {
            for (let k of particle.content.primaryKeys) {
                query["content." + k] = particle.content.content[k];
            }
        }
        return query;
    }
}

