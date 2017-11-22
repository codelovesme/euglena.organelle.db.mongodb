"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const euglena_template = require("@euglena/template");
const cessnalib_1 = require("cessnalib");
var Class = cessnalib_1.js.Class;
var organelle = euglena_template.alive.organelle;
var particles = euglena_template.alive.particle;
var constants = euglena_template.alive.constants;
let this_ = null;
class Organelle extends organelle.DbOrganelle {
    constructor() {
        super();
        this_ = this;
    }
    bindActions(addAction) {
        addAction(constants.particles.DbOrganelleSap, (particle, callback) => {
            this_.sapContent = particle.data;
            this_.getAlive();
        });
        addAction(constants.particles.ReadParticles, (particle, callback) => {
            this_.db.collection("particles").find(Class.toDotNotation(particle.data)).toArray((err, doc) => {
                let p = new particles.Particles(doc || [], this.sapContent.euglenaName);
                if (callback) {
                    callback(p);
                }
                else {
                    this_.send(p);
                }
            });
        });
        addAction(constants.particles.ReadParticle, (particle, callback) => {
            this_.db.collection("particles").find(Class.toDotNotation(particle.data)).toArray((err, doc) => {
                let p = doc && doc.length > 0 ? doc[0] : new particles.Exception(new cessnalib_1.sys.type.Exception("There is no particle for given reference."), "mongodb");
                if (callback) {
                    callback(p);
                }
                else {
                    this_.send(p);
                }
            });
        });
        addAction(constants.particles.RemoveParticle, (particle, callback) => {
            this_.db.collection("particles").findOneAndDelete(Class.toDotNotation(particle.data), (err, doc) => {
                //TODO
            });
        });
        addAction(constants.particles.RemoveParticles, (particle, callback) => {
            this_.db.collection("particles").remove(Class.toDotNotation(particle.data), (err, doc) => {
                //TODO
            });
        });
        addAction(constants.particles.SaveParticle, (particle, callback) => {
            if (particle.data.query) {
                this.db.collection("particles").findOneAndUpdate(Class.toDotNotation(particle.data.query), particle.data.particle, { upsert: true }, (err, document) => {
                    if (err) {
                        //TODO
                    }
                    else {
                        // this2_.send(new particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, constants.organelles.Db));
                    }
                });
            }
            else {
                this.db.collection("particles").insertOne(particle.data, () => {
                    //TODO
                });
            }
        });
    }
    getAlive() {
        mongodb.MongoClient.connect("mongodb://" + this.sapContent.url + ":" + this.sapContent.port + "/" + this.sapContent.databaseName, (err, db) => {
            if (!err) {
                this.db = db;
                this_.send(new particles.DbIsOnline("this"));
            }
            else {
                //TODO
            }
        });
    }
}
exports.Organelle = Organelle;

//# sourceMappingURL=index.js.map
