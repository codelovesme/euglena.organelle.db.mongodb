/// <reference path="../typings/mongodb/mongodb.d.ts" />
"use strict";
var mongodb = require("mongodb");
var cessnalib_template_1 = require("../node_modules/cessnalib/cessnalib_template/src/cessnalib_template");
var cessnalib_1 = require("../node_modules/cessnalib/cessnalib/src/cessnalib");
const OrganelleName = "DbOrganelleImplMongoDb";
class Organelle extends cessnalib_template_1.cessnalib_template.being.alive.organelles.DbOrganelle {
    constructor() {
        super(OrganelleName);
        this.euglenaInfos = new cessnalib_1.cessnalib.sys.type.Map();
        this.euglenaInfos.add("idcore", new cessnalib_1.cessnalib.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
        this.euglenaInfos.add("postman", new cessnalib_1.cessnalib.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
    }
    receiveParticle(particle) {
        switch (particle.name) {
            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.db.constants.StartDatabase:
                let this3_ = this;
                let startDatabase = particle;
                mongodb.MongoClient.connect("mongodb://" + this.initialProperties.url + ":" + this.initialProperties.port + "/" + startDatabase.content.euglenaName, (err, db) => {
                    if (!err) {
                        this.db = db;
                        this3_.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.db.outgoingparticles.DbIsOnline(particle.of));
                    }
                    else {
                    }
                });
                break;
            case cessnalib_template_1.cessnalib_template.being.alive.constants.impacts.ReadParticle:
                let this_ = this;
                this.db.collection(particle.content.name).find({ of: particle.content.of }).toArray((err, doc) => {
                    this_.nucleus.receiveParticle(doc[0]);
                });
                break;
            case cessnalib_template_1.cessnalib_template.being.alive.constants.impacts.ReadParticles:
                let this4_ = this;
                this.db.collection(particle.content).find({}).toArray((err, doc) => {
                    for (var index = 0; index < doc.length; index++) {
                        this4_.nucleus.receiveParticle(doc[index]);
                    }
                });
                break;
            case cessnalib_template_1.cessnalib_template.being.alive.constants.impacts.RemoveParticle:
                this.db.collection(particle.content.name).findOneAndDelete({ of: particle.content.of }, (err, doc) => {
                    //TODO
                });
                break;
            case cessnalib_template_1.cessnalib_template.being.alive.constants.impacts.SaveParticle:
                let saveParticle = particle;
                let this2_ = this;
                this.db.collection(saveParticle.content.name).findOneAndUpdate({ of: saveParticle.content.of }, saveParticle.content, { upsert: true }, (err, document) => {
                    if (err) {
                    }
                    else {
                        this2_.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.DbOrganelle));
                    }
                });
                break;
        }
    }
}
exports.Organelle = Organelle;
//# sourceMappingURL=euglena_db_mongo.js.map