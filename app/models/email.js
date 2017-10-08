'use strict';

/**
 * Requiring base Model
 */
const BaseModel = require('./basemodel.js');

/**
 *  Client model class
 */
class EmailModel extends BaseModel {
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

            toEmail: {type: String, index: true},

            subject: {type: String},
            html: {type: String},
            token: {type: String},

            user: {type: Types.ObjectId, ref: 'user', index: true},

            createdAt: {type: Date, expires: '30d', default: Date.now}
        };

        // Creating DBO Schema
        let EmailSchema = this.createSchema(schemaObject);

        // Registering schema and initializing model
        this.registerSchema(EmailSchema);
    }
}

/**
 * Creating instance of the model
 */
let modelInstance = new EmailModel('email');

/**
 * Exporting Model
 *
 * @type {Function}
 */
exports = module.exports = modelInstance;