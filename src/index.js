"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const euglena_template = require("@euglena/template");
const cessnalib_1 = require("cessnalib");
var Class = cessnalib_1.js.Class;
let this_ = null;
class Organelle extends euglena_template.alive.organelle.DbOrganelle {
    constructor() {
        super();
        this_ = this;
    }
    bindActions(addAction) {
        addAction(euglena_template.alive.constants.particles.DbOrganelleSap, (particle, callback) => {
            this_.sapContent = particle.data;
            this_.getAlive();
        });
        addAction(euglena_template.alive.constants.particles.ReadParticles, (particle, callback) => {
            this_.db.collection("particles").find(Class.toDotNotation({ meta: particle.data.meta })).toArray((err, doc) => {
                let p = new euglena_template.alive.particle.Particles(doc || [], this.sapContent.euglenaName);
                if (callback) {
                    callback(p);
                }
                else {
                    this_.send(p, this_.name);
                }
            });
        });
        addAction(euglena_template.alive.constants.particles.ReadParticle, (particle, callback) => {
            this_.db.collection("particles").find(Class.toDotNotation({ meta: particle.data.meta })).toArray((err, doc) => {
                let p = doc && doc.length > 0 ? doc[0] : new euglena_template.alive.particle.Exception(new cessnalib_1.sys.type.Exception("There is no particle for given reference."), "mongodb");
                if (callback) {
                    callback(p);
                }
                else {
                    this_.send(p, this_.name);
                }
            });
        });
        addAction(euglena_template.alive.constants.particles.RemoveParticle, (particle) => {
            this_.db.collection("particles").findOneAndDelete({ meta: particle.data.meta }, (err, doc) => {
                //TODO
            });
        });
        addAction(euglena_template.alive.constants.particles.RemoveParticles, (particle) => {
            this_.db.collection("particles").remove(Class.toDotNotation({ meta: particle.data.meta }), (err, doc) => {
                //TODO
            });
        });
        addAction(euglena_template.alive.constants.particles.SaveParticle, (particle) => {
            this.db.collection("particles").findOneAndUpdate({ meta: particle.data.meta }, particle.data, { upsert: true }, (err, document) => {
                if (err) {
                    //TODO
                }
                else {
                    // this2_.send(new euglena_template.alive.particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, euglena_template.alive.constants.organelles.Db));
                }
            });
        });
        addAction(euglena_template.alive.constants.particles.SaveMatchedParticle, (particle) => {
            this.db.collection("particles").findOneAndUpdate(Class.toDotNotation({ meta: particle.data.meta }), particle.data, { upsert: true }, (err, document) => {
                if (err) {
                    //TODO
                }
                else {
                    // this2_.send(new euglena_template.alive.particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, euglena_template.alive.constants.organelles.Db));
                }
            });
        });
    }
    getAlive() {
        mongodb.MongoClient.connect("mongodb://" + this.sapContent.url + ":" + this.sapContent.port + "/" + this.sapContent.databaseName, (err, db) => {
            if (!err) {
                this.db = db;
                this_.send(new euglena_template.alive.particle.DbIsOnline("this"), this_.name);
            }
            else {
                //TODO
            }
        });
    }
}
exports.Organelle = Organelle;
//# sourceMappingURL=index.js.map