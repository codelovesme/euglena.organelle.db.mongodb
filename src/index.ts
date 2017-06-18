
"use strict";
import * as mongodb from "mongodb";
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import { sys, js } from "cessnalib";
import Particle = euglena.AnyParticle;
import Class = js.Class;
import organelle = euglena_template.alive.organelle;
import particles = euglena_template.alive.particle;
import constants = euglena_template.alive.constants;

let this_: Organelle = null;
export class Organelle extends organelle.DbOrganelle {
    private db: mongodb.Db;
    private sapContent: particles.DbOrganelleSapContent;
    constructor() {
        super();
        this_ = this;
    }
    protected bindActions(addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void): void {
        addAction(constants.particles.DbOrganelleSap, (particle: particles.DbOrganelleSap, callback) => {
            this_.sapContent = particle.data;
            this_.getAlive();
        });
        addAction(constants.particles.ReadParticles, (particle: particles.ReadParticles, callback) => {
            this_.db.collection("particles").find(Class.toDotNotation(particle.data)).toArray((err, doc) => {
                let p = new particles.Particles(doc as Particle[] || [], this.sapContent.euglenaName);
                if (callback) {
                    callback(p);
                } else {
                    this_.send(p);
                }
            });
        });
        addAction(constants.particles.ReadParticle, (particle: particles.ReadParticle, callback) => {
            this_.db.collection("particles").find(Class.toDotNotation(particle.data)).toArray((err, doc) => {
                let p = doc && doc.length > 0 ? doc[0] : new particles.Exception(
                    new sys.type.Exception("There is no particle for given reference."), "mongodb");
                if (callback) {
                    callback(p as Particle);
                } else {
                    this_.send(p as Particle);
                }
            });
        });
        addAction(constants.particles.RemoveParticle, (particle: particles.RemoveParticle, callback) => {
            this_.db.collection("particles").findOneAndDelete(particle.data, (err, doc) => {
                //TODO
            });
        });
        addAction(constants.particles.RemoveParticles, (particle: particles.RemoveParticles, callback) => {
            this_.db.collection("particles").remove(Class.toDotNotation(particle.data), (err, doc) => {
                //TODO
            });
        });
        addAction(constants.particles.SaveParticle, (particle: particles.SaveParticle, callback) => {
            if (particle.data.query) {
                this.db.collection("particles").findOneAndUpdate(Class.toDotNotation(particle.data.query), particle.data.particle, { upsert: true }, (err, document) => {
                    if (err) {
                        //TODO
                    } else {
                        // this2_.send(new particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, constants.organelles.Db));
                    }
                });
            } else {
                this.db.collection("particles").insertOne(particle.data,()=>{
                    //TODO
                });
            }

        });
    }
    private getAlive() {
        mongodb.MongoClient.connect("mongodb://" + this.sapContent.url + ":" + this.sapContent.port + "/" + this.sapContent.databaseName, (err, db) => {
            if (!err) {
                this.db = db;
                this_.send(new particles.DbIsOnline("this"));
            } else {
                //TODO
            }
        });
    }
}

