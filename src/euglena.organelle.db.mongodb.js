/// <reference path="../typings/mongodb/mongodb.d.ts" />
"use strict";
const mongodb = require("mongodb");
const euglena_template_1 = require("euglena.template");
const euglena_1 = require("euglena");
const OrganelleName = "DbOrganelleImplMongoDb";
class Organelle extends euglena_template_1.euglena_template.being.alive.organelle.DbOrganelle {
    constructor() {
        super(OrganelleName);
        let this_ = this;
        this.addAction(euglena_template_1.euglena_template.being.alive.constants.impacts.ReadParticle, (particle) => {
            let query = this_.generateQuery(particle);
            this_.db.collection("particles").find(query).toArray((err, doc) => {
                this_.send(doc && doc.length > 0 ? doc[0] : new euglena_template_1.euglena_template.being.alive.particle.Exception(new euglena_1.euglena.sys.type.Exception("There is no particle for given reference."), "mongodb"));
            });
        });
        this.addAction(euglena_template_1.euglena_template.being.alive.constants.impacts.ReadParticles, (particle) => {
            this_.db.collection("particles").find({ of: particle.content }).toArray((err, doc) => {
                for (var index = 0; index < doc.length; index++) {
                }
            });
        });
        this.addAction(euglena_template_1.euglena_template.being.alive.constants.impacts.RemoveParticle, (particle) => {
            let query = this_.generateQuery(particle);
            this_.db.collection("particles").findOneAndDelete(query, (err, doc) => {
                //TODO
            });
        });
        this.addAction(euglena_template_1.euglena_template.being.alive.constants.impacts.SaveParticle, (particle) => {
            let this2_ = this;
            let query = this_.generateQuery(particle);
            this.db.collection("particles").findOneAndUpdate(query, particle.content, { upsert: true }, (err, document) => {
                if (err) {
                }
                else {
                }
            });
        });
    }
    onGettingAlive() {
        let this3_ = this;
        mongodb.MongoClient.connect("mongodb://" + this.sap.url + ":" + this.sap.port + "/" + this.sap.databaseName, (err, db) => {
            if (!err) {
                this.db = db;
                this3_.send(new euglena_template_1.euglena_template.being.alive.particle.DbIsOnline("this"));
            }
            else {
            }
        });
    }
    generateQuery(particle) {
        let query = { name: particle.content.name, of: particle.content.of };
        if (particle.content.primaryKeys) {
            for (let k of particle.content.primaryKeys) {
                query["content." + k] = particle.content.content[k];
            }
        }
        return query;
    }
}
exports.Organelle = Organelle;
//# sourceMappingURL=euglena.organelle.db.mongodb.js.map