'use strict';

/**
 * Core module
 */
const Core = process.mainModule.require('nodejs-lib');

const nodeSchedule = require('node-schedule');
const moment       = require('moment');

/**
 * Realza timetable
 *
 * Each 1 hour - process RealtyPult feed
 * Each 1 hour - process generate sitemaps
 *
 **/

enqueue('5 */1 * * *', 'realtypult', 'import', 1); // process RealtyPult feed

enqueue('45 */1 * * *', 'sitemap', 'generate', 1); // sitemap generate

function enqueue(schedule, workerName, commandName, priority) {

    Core.ApplicationFacade.instance.logger.debug(`Cron: enqueue ${workerName}:${commandName}, priority: ${priority}, schedule: ${schedule}`);

    nodeSchedule.scheduleJob(schedule, () => {
        Core.ApplicationFacade.instance.logger.info(`Cron: process ${workerName}:${commandName}, priority: ${priority}`);

        Core.ApplicationFacade.instance.queue.enqueue({
            workerName: workerName,
            commandName: commandName,
            params: {},
            priority: priority
        });
    });
}