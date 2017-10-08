'use strict';

/**
 * Base model
 */
const BaseModel = require('./basemodel.js');

/**
 * Tasks
 */
class QueueTaskModel extends BaseModel {
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
            name: String,
            params: Types.Mixed,
            queue: String,
            attempts: Types.Mixed,
            delay: Date,
            priority: Number,
            status: String,
            enqueued: Date,
            dequeued: Date,
            ended: Date,
            result: {}
        };

        // Creating DBO Schema
        let QueueTaskDBOSchema = this.createSchema(schemaObject);

        // Registering schema and initializing model
        this.registerSchema(QueueTaskDBOSchema);
    }
}

/**
 * Creating instance of the model
 */
let modelInstance = new QueueTaskModel('queue_task');

/**
 * Exporting Model
 *
 * @type {Function}
 */
module.exports = modelInstance;