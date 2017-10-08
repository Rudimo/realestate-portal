'use strict';

/**
 * Requiring base Model
 */
const BaseModel = require('./basemodel.js');

/**
 *  Client model class
 */
class ImportFeedModel extends BaseModel {
    /**
     * Model constructor
     */
    constructor(listName) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(listName);

    }

    /**
     * Define Schema
     *
     * @override
     */
    defineSchema() {

        let Types = this.mongoose.Schema.Types;

        let schemaObject = {

            portalName: {type: String},
            url: {type: String},
            checksum: {type: String}


        };

        // Creating DBO Schema
        let ImportFeedSchema = this.createSchema(schemaObject);

        // Registering schema and initializing model
        this.registerSchema(ImportFeedSchema);
    }
}

/**
 * Creating instance of the model
 */
let modelInstance = new ImportFeedModel('import_feed');

/**
 * Exporting Model
 *
 * @type {Function}
 */
exports = module.exports = modelInstance;