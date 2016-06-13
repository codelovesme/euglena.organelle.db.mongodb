/// <reference path="../typings/mongodb/mongodb.d.ts" />
"use strict";
var mongodb = require("mongodb");
var euglena_template_1 = require("../node_modules/euglena/euglena_template/src/euglena_template");
var euglena_1 = require("../node_modules/euglena/euglena/src/euglena");
var EuglenaInfo = euglena_template_1.euglena_template.being.alive.particles.EuglenaInfo;
const OrganelleName = "DbOrganelleImplMongoDb";
class Organelle extends euglena_template_1.euglena_template.being.alive.organelles.DbOrganelle {
    constructor() {
        super(OrganelleName);
        this.euglenaInfos = new euglena_1.euglena.sys.type.Map();
        this.euglenaInfos.add("idcore", new EuglenaInfo("idcore", "localhost", "1337"));
        this.euglenaInfos.add("postman", new EuglenaInfo("idcore", "localhost", "1337"));
    }
    receive(particle, response) {
        switch (particle.name) {
            case euglena_template_1.euglena_template.being.ghost.organelle.db.constants.StartDatabase:
                let this3_ = this;
                let startDatabase = particle;
                mongodb.MongoClient.connect("mongodb://" + this.initialProperties.url + ":" + this.initialProperties.port + "/" + this.initialProperties.databaseName, (err, db) => {
                    if (!err) {
                        this.db = db;
                        response(new euglena_template_1.euglena_template.being.ghost.organelle.db.outgoingparticles.DbIsOnline(particle.of));
                    }
                    else {
                    }
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.ReadParticle:
                let this_ = this;
                let query = this.generateQuery(particle);
                this.db.collection("particles").find(query).toArray((err, doc) => {
                    response(doc && doc.length > 0 ? doc[0] : new euglena_template_1.euglena_template.being.alive.particles.Exception(new euglena_1.euglena.sys.type.Exception("There is no particle for given reference."), "mongodb"));
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.ReadParticles:
                let this4_ = this;
                this.db.collection("particles").find({ name: particle.content }).toArray((err, doc) => {
                    for (var index = 0; index < doc.length; index++) {
                    }
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.ReadParticlesOf:
                let this5_ = this;
                this.db.collection("particles").find({ of: particle.content }).toArray((err, doc) => {
                    for (var index = 0; index < doc.length; index++) {
                    }
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.RemoveParticle:
                query = this.generateQuery(particle);
                this.db.collection("particles").findOneAndDelete(query, (err, doc) => {
                    //TODO
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.SaveParticle:
                let saveParticle = particle;
                let this2_ = this;
                query = this.generateQuery(particle);
                this.db.collection("particles").findOneAndUpdate(query, saveParticle.content, { upsert: true }, (err, document) => {
                    if (err) {
                    }
                    else {
                        response(new euglena_template_1.euglena_template.being.alive.particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, euglena_template_1.euglena_template.being.alive.constants.organelles.Db));
                    }
                });
                break;
        }
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