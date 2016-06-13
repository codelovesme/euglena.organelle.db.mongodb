
/// <reference path="../typings/mongodb/mongodb.d.ts" />

"use strict";
import * as mongodb from "mongodb";
import {cessnalib_template} from "../node_modules/cessnalib/cessnalib_template/src/cessnalib_template";
import {cessnalib} from "../node_modules/cessnalib/cessnalib/src/cessnalib";
import Particle = cessnalib.being.Particle;

const OrganelleName = "DbOrganelleImplMongoDb";

export class Organelle extends cessnalib_template.being.alive.organelles.DbOrganelle {
    private euglenaInfos: cessnalib.sys.type.Map<string, cessnalib.being.alive.EuglenaInfo>;
    private db: mongodb.Db;
    constructor() {
        super(OrganelleName);
        this.euglenaInfos = new cessnalib.sys.type.Map<string, cessnalib.being.alive.EuglenaInfo>();
        this.euglenaInfos.add("idcore", new cessnalib.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
        this.euglenaInfos.add("postman", new cessnalib.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
    }
    public receiveParticle(particle: Particle): void {
        switch (particle.name) {
            case cessnalib_template.being.ghost.euglena.db.constants.StartDatabase:
                let this3_: Organelle = this;
                let startDatabase = particle as cessnalib_template.being.ghost.euglena.db.incomingparticles.StartDatabase;
                mongodb.MongoClient.connect("mongodb://" + this.initialProperties.url + ":" + this.initialProperties.port + "/" + startDatabase.content.euglenaName, (err, db) => {
                    if (!err) {
                        this.db = db;
                        this3_.nucleus.receiveParticle(new cessnalib_template.being.ghost.euglena.db.outgoingparticles.DbIsOnline(particle.of));
                    } else {
                        //TODO
                    }
                });
                break;
            case cessnalib_template.being.alive.constants.impacts.ReadParticle:
                let this_ = this;
                this.db.collection(particle.content.name).find({ of: particle.content.of }).toArray((err, doc) => {
                    this_.nucleus.receiveParticle(doc[0]);
                });
                break;
            case cessnalib_template.being.alive.constants.impacts.ReadParticles:
                let this4_ = this;
                this.db.collection(particle.content).find({}).toArray((err, doc) => {
                    for (var index = 0; index < doc.length; index++) {
                        this4_.nucleus.receiveParticle(doc[index]);
                    }
                });
                break;
            case cessnalib_template.being.alive.constants.impacts.RemoveParticle:
                this.db.collection(particle.content.name).findOneAndDelete({ of: particle.content.of }, (err, doc) => {
                    //TODO
                });
                break;
            case cessnalib_template.being.alive.constants.impacts.SaveParticle:
                let saveParticle = particle as cessnalib_template.being.alive.particles.SaveParticle;
                let this2_ = this;
                this.db.collection(saveParticle.content.name).findOneAndUpdate({ of: saveParticle.content.of }, saveParticle.content, { upsert: true }, (err, document) => {
                    if (err) {
                        //TODO
                    } else {
                        this2_.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, cessnalib_template.being.alive.constants.organelles.DbOrganelle));
                    }
                });
                break;
        }
    }
}

