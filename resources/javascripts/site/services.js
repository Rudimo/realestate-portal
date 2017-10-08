var app = angular.module('Realza.services', []);

app.constant('RZ', {

    OFFER_TYPE_SALE: 1,
    OFFER_TYPE_RENT: 2,

    OBJECT_STATUS_DRAFT: 1,
    OBJECT_STATUS_MODERATION_PENDING: 2,
    OBJECT_STATUS_REJECTED: 3,
    OBJECT_STATUS_PUBLISHED: 4,
    OBJECT_STATUS_ARCHIVED: 5,

    OBJECT_TYPE_FLAT: 1,
    OBJECT_TYPE_ROOM: 2,
    OBJECT_TYPE_HOUSE: 3,
    OBJECT_TYPE_LAND: 4,
    OBJECT_TYPE_GARAGE: 5,
    OBJECT_TYPE_COM: 6,

    ROOMS_TYPE_ONE: 1,
    ROOMS_TYPE_TWO: 2,
    ROOMS_TYPE_THREE: 3,
    ROOMS_TYPE_FOUR: 4,
    ROOMS_TYPE_FIVE: 5,
    ROOMS_TYPE_STUDIO: 6,
    ROOMS_TYPE_OPEN: 7,

    GARAGE_TYPE_PARKING_PLACE: 1,
    GARAGE_TYPE_GARAGE: 2,
    GARAGE_TYPE_BOX: 3,

    COMMERCIAL_TYPE_OFFICE: 1,
    COMMERCIAL_TYPE_RETAIL: 2,
    COMMERCIAL_TYPE_FREE_PURPOSE: 3,
    COMMERCIAL_TYPE_PUBLIC_CATERING: 4,
    COMMERCIAL_TYPE_AUTO_REPAIR: 5,
    COMMERCIAL_TYPE_BUSINESS: 6,
    COMMERCIAL_TYPE_LEGAL_ADDRESS: 7,
    COMMERCIAL_TYPE_LAND: 8,
    COMMERCIAL_TYPE_HOTEL: 9,
    COMMERCIAL_TYPE_WAREHOUSE: 10,
    COMMERCIAL_TYPE_MANUFACTURING: 11,

    COMMERCIAL_BUILDING_TYPE_BUSINESS_CENTER: 1,
    COMMERCIAL_BUILDING_TYPE_WAREHOUSE: 2,
    COMMERCIAL_BUILDING_TYPE_SHOPPING_CENTER: 3,
    COMMERCIAL_BUILDING_TYPE_DETACHED_BUILDING: 4,
    COMMERCIAL_BUILDING_TYPE_RESIDENTIAL_BUILDING: 5,

    /** Compound object types v2 */
    RZ_CMP_V2_OBJECT_TYPE_FLAT: 1,
    RZ_CMP_V2_OBJECT_TYPE_ROOM: 2,
    RZ_CMP_V2_OBJECT_TYPE_HOUSE: 3,
    RZ_CMP_V2_OBJECT_TYPE_COTTAGE: 4,
    RZ_CMP_V2_OBJECT_TYPE_DACHA: 5,
    RZ_CMP_V2_OBJECT_TYPE_TOWNHOUSE: 6,
    RZ_CMP_V2_OBJECT_TYPE_HALF_HOUSE: 7,
    RZ_CMP_V2_OBJECT_TYPE_LOT_IGS: 8,
    RZ_CMP_V2_OBJECT_TYPE_LOT_GARDEN: 9,
    RZ_CMP_V2_OBJECT_TYPE_LOT_FARM: 10,
    RZ_CMP_V2_OBJECT_TYPE_GARAGE: 11,
    RZ_CMP_V2_OBJECT_TYPE_GARAGE_PARKING_PLACE: 12,
    RZ_CMP_V2_OBJECT_TYPE_GARAGE_BOX: 13,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_OFFICE: 14,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_RETAIL: 15,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE: 16,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING: 17,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR: 18,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_BUSINESS: 19,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS: 20,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LAND: 21,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_HOTEL: 22,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_WAREHOUSE: 23,
    RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_MANUFACTURING: 24,

    HOUSE_TYPE_HOUSE: 1,                           // Дом
    HOUSE_TYPE_COTTAGE: 2,                         // Коттедж
    HOUSE_TYPE_DACHA: 3,                           // Дача
    HOUSE_TYPE_TOWNHOUSE: 4,                       // Таунхаус
    HOUSE_TYPE_HALF_HOUSE: 5,                      // Часть дома

    /** Lot type */
    LOT_TYPE_IGS: 1,                               // ИЖС
    LOT_TYPE_GARDEN: 2,                            // В садоводстве
    LOT_TYPE_FARM: 3,

});

app.factory('api', ['$http', '$location', 'growl', function ($http, $location, growl) {
    'use strict';

    return {
        /**
         * Make a POST request to API
         * @param path
         * @param data
         * @param callback
         */
        post: function (path, data, callback) {

            if (typeof callback !== 'function') callback = function () {
            };

            if (path && path.indexOf('/') !== 0) {
                path = '/' + path;
            }

            $http({
                withCredentials: true,
                method: 'POST',
                url: $location.protocol() + '://' + $location.host() + ':' + $location.port() + path,
                data: data,
                headers: {'api': 'v1'}
            }).success(function (response, status) {

                //console.log(response);
                //console.log(status);

                if ([200, 302].indexOf(status) == -1) {
                    console.log(response.error || 'Произошла ошибка, попробуйте позднее, код ' + status);
                    growl.error(response.error || 'Произошла ошибка, попробуйте позднее, код ' + status);
                    return callback(new Error('Request fails'));
                }

                if (response.result === 'ERR') {

                    if (response.errors && response.errors.length > 0) {
                        response.errors.forEach(function (error) {
                            growl.error(error);
                        });
                    } else {
                        growl.error('Произошла неизвестная ошибка, попробуйте позднее');
                    }

                    return callback(new Error(response.error || 'Error occurred'));
                }


                if (response.location) {
                    console.log('redirect to ' + response.location);
                    return window.location.href = response.location;
                }

                callback(null, response);

            }).error(function (response, status) {

                if (status) {
                    growl.warning('Сервис временно недоступен, пожалуйста, попробуйте позднее. Код ' + status);
                } else {
                    growl.warning('Сервис временно недоступен, пожалуйста, попробуйте позднее.');
                }

                console.error("api call '" + path + "' failed, status = " + status);

                callback(new Error('api call ' + path + ' failed, status = ' + status));
            });
        },
        /**
         * Make a GET request to API
         * @param url
         * @param callback
         */
        get: function (url, callback) {

            if (typeof callback !== 'function') callback = function () {
            };

            $http({
                withCredentials: true,
                method: 'GET',
                headers: {'api': 'v1'},
                url: url
            }).success(function (response, status) {

                if (status != 200) {
                    growl.error(response.error || 'Произошла ошибка, попробуйте позднее, код ' + status);
                    return callback(new Error('Request fails'));
                }

                if (response.result === 'ERR') {

                    if (response.errors && response.errors.length > 0) {
                        response.errors.forEach(function (error) {
                            growl.error(error);
                        });
                    } else {
                        growl.error('Произошла неизвестная ошибка, попробуйте позднее');
                    }

                    return callback(new Error(response.error || 'Error occurred'));
                }

                if (response.location) {
                    return window.location.href = response.location;
                }

                callback(null, response);

            }).error(function (response, status) {

                if (status) {
                    growl.warning('Сервис временно недоступен, пожалуйста, попробуйте позднее. Код ' + status);
                } else {
                    growl.warning('Сервис временно недоступен, пожалуйста, попробуйте позднее.');
                }

                console.error("api call '" + url + "' failed, status = " + status);

                callback(new Error('api call ' + url + ' failed, status = ' + status));
            });
        }
    };
}]);