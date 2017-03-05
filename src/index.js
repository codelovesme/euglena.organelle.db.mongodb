/// <reference path="../typings/mongodb/mongodb.d.ts" />
"use strict";
const mongodb = require("mongodb");
const euglena_template_1 = require("euglena.template");
const euglena_1 = require("euglena");
const OrganelleName = "DbOrganelleImplMongoDb";
let this_ = null;
class Organelle extends euglena_template_1.euglena_template.being.alive.organelle.DbOrganelle {
    constructor() {
        super(OrganelleName);
        this_ = this;
    }
    bindActions(addAction) {
        addAction(euglena_template_1.euglena_template.being.alive.constants.particles.DbOrganelleSap, (particle, callback) => {
            this_.sapContent = particle.data;
            this_.getAlive();
        });
        addAction(euglena_template_1.euglena_template.being.alive.constants.impacts.ReadParticle, (particle, callback) => {
            this_.db.collection("particles").find({ meta: particle.data.meta }).toArray((err, doc) => {
                let p = doc && doc.length > 0 ? doc[0] : new euglena_template_1.euglena_template.being.alive.particle.Exception(new euglena_1.euglena.sys.type.Exception("There is no particle for given reference."), "mongodb");
                if (callback) {
                    callback(p);
                }
                else {
                    this_.send(p, this_.name);
                }
            });
        });
        addAction(euglena_template_1.euglena_template.being.alive.constants.particles.ReadMatchedParticles, (particle, callback) => {
            this_.db.collection("particles").find(euglena_1.euglena.js.Class.toDotNotation(particle.data)).toArray((err, doc) => {
                let p = doc && doc.length > 0 ?
                    new euglena_template_1.euglena_template.being.alive.particle.MatchedParticles({ particleRef: particle, result: doc }, this.sapContent.euglenaName) : new euglena_template_1.euglena_template.being.alive.particle.Exception(new euglena_1.euglena.sys.type.Exception("There is no particle for given reference."), "mongodb");
                if (callback) {
                    callback(p);
                }
                else {
                    this_.send(p, this_.name);
                }
            });
        });
        addAction(euglena_template_1.euglena_template.being.alive.constants.impacts.RemoveParticle, (particle) => {
            this_.db.collection("particles").findOneAndDelete({ meta: particle.data.meta }, (err, doc) => {
                //TODO
            });
        });
        addAction(euglena_template_1.euglena_template.being.alive.constants.impacts.SaveParticle, (particle) => {
            this.db.collection("particles").findOneAndUpdate({ meta: particle.data.meta }, particle.data, { upsert: true }, (err, document) => {
                if (err) {
                }
                else {
                }
            });
        });
    }
    getAlive() {
        mongodb.MongoClient.connect("mongodb://" + this.sapContent.url + ":" + this.sapContent.port + "/" + this.sapContent.databaseName, (err, db) => {
            if (!err) {
                this.db = db;
                this_.send(new euglena_template_1.euglena_template.being.alive.particle.DbIsOnline("this"), this_.name);
            }
            else {
            }
        });
    }
}
exports.Organelle = Organelle;
//# sourceMappingURL=index.js.map