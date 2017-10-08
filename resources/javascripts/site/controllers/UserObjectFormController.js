app.controller('UserObjectFormController', ['$scope', 'api', 'RZ', '$q', '$window', 'growl', '$cookies',
    function ($scope, api, RZ, $q, $window, growl, $cookies) {

        var object;

        var clearField = ['rooms', 'buildingType', 'apartments', 'yearBuild', 'newFlat', 'parkingType', 'lift', 'serviceLift',
            'rubbishChute', 'security', 'privateTerritory', 'floor', 'floorsTotal', 'squareTotal', 'squareLiving',
            'squareKitchen', 'ceilingHeight', 'bathroom', 'balcony', 'windowViewYard', 'windowViewStreet', 'covering',
            'phone', 'roomFurniture', 'buildInTech', 'refrigerator', 'television', 'kitchenFurniture', 'haggle', 'mortgage',
            'cadastralNumber', /*'period',*/ 'washingMachine', 'dishwasher', 'tv', 'withChildren', 'flatAlarm', 'withPets',
            'prepayment', 'agentFee', 'roomsOffered', 'squareRooms', 'rentPledge', /*'lotAreaUnit',*/'houseType', /*'lotType',*/
            'lotArea', 'houseArea', 'houseFloors', 'shower', 'toilet', 'pmg', 'heatingSupply', 'sewerageSupply', 'gasSupply',
            'sauna', 'pool', 'billiard', 'electricitySupply', 'waterSupply', 'kitchen', 'price', 'garageType', 'garageArea',
            'garageStatus', 'gsk', 'garageParking', 'garageHasLight', 'garageHasElectricity', 'garageHasWater',
            'garageHasHeating', 'garageHasExtinguishingSystem', 'commercialType', 'commercialBuildingType', 'officeClass',
            'buildingName', 'commercialArea', 'commercialRoomsTotal', 'entranceType', 'renovation', 'internet',
            'aircondition', 'ventilation', 'fireAlarm', 'twentyFourSeven', 'accessControlSystem', 'parking',
            'eatingFacilities', 'selfSelectionTelecom', 'addingPhoneOnRequest', 'purposeBank', 'purposeFoodStore',
            'purposeBeautyShop', 'purposeTourAgency', 'purposeMedicalCenter', 'purposeShowRoom', 'commercialLotArea',
            'purposeAlcohol', 'purposeStoreHouse', 'purposePharmaceutical', 'officeWarehouse', 'responsibleStorage',
            'freightElevator', 'truckEntrance', 'ramp', 'railway', 'serviceThreePl', 'dealStatus', 'taxationForm',
            'cleaningIncluded', 'utilitiesIncluded', 'electricityIncluded', 'securityPayment'];

        $scope.RZ = RZ;

        // View
        $scope.view = {isHouseNotFound: false};

        $scope.init = function (obj) {

            if (obj) {

                object = $scope.object = obj;

            } else {

                $scope.object = {
                    images: []
                };

                if ($cookies.get('objectType')) {

                    $scope.object.objectType = +$cookies.get('objectType');

                } else {

                    $scope.object.objectType = RZ.OBJECT_TYPE_FLAT;
                }

                if ($cookies.get('offerType')) {

                    $scope.object.offerType = +$cookies.get('offerType');

                } else {

                    $scope.object.offerType = RZ.OFFER_TYPE_SALE;
                }

                object = $scope.object;
            }

            $scope.geoAddress = object.geoAddress;
            $scope.geoHouse = object.geoHouse;

            // TODO: Init images
        };

        /**
         * Image Uploader
         */
        $scope.imagesAdded = function ($file, $event, $flow) {

            $scope.object.images.push({
                uploading: true,
                uniqueIdentifier: $file.uniqueIdentifier
            });
        };

        $scope.imageUploaded = function ($file, $image, $flow) {
            var image = object.images.find(function (image) {
                return image.uniqueIdentifier == $file.uniqueIdentifier
            });
            image.uploading = false;
            $image = JSON.parse($image);
            for (var property in $image) {
                if ($image.hasOwnProperty(property)) {
                    image[property] = $image[property];
                }
            }
        };

        $scope.imageMoved = function ($index) {
            object.images.splice($index, 1);
        };

        $scope.deleteImage = function (img) {

            console.log(img);

            object.images = object.images.filter(function (image) {

                console.log(image);

                if (image.uniqueIdentifier && img.uniqueIdentifier) {
                    return image.uniqueIdentifier != img.uniqueIdentifier;
                }

                if (image._id && img._id) {
                    return image._id != img._id;
                }

                if (image.id && img.id) {
                    return image.id != img.id;
                }

                return true;
            });
        };

        /**
         * Geo coder
         * @returns {boolean}
         */
        $scope.getAutocomplete = function (query) {
            return $q(function (resolve, reject) {
                api.get('/geocoder?q=' + query, function (err, data) {
                    if (!err) {
                        resolve(data.map(function (item) {
                            return item.geoAddress;
                        }));
                    } else {
                        console.error(err);
                        reject(err);
                    }
                });
            });
        };

        $scope.resolveFullAddress = function (geoAddress) {

            console.log('resolveFullAddress', geoAddress);

            api.get('/geocoder?q=' + geoAddress + '&full=1', function (err, address) {
                if (err) {
                    console.error(err);
                    return;
                }

                $scope.addressSet(address);
            });
        };

        $scope.addressSet = function (address) {
            object.geoAddress = $scope.geoAddress = address.geoAddress;
            object.geoLatitude = address.geoLatitude;
            object.geoLongitude = address.geoLongitude;
            object.geoObl = address.geoObl;
            object.geoRaion = address.geoRaion;
            object.geoPlace = address.geoPlace;
            object.geoCityRaion = address.geoCityRaion;
            object.geoMetro = address.geoMetro;
            object.geoDistance = address.geoDistance;
            object.geoStreet = address.geoStreet;
            object.geoHouse = $scope.geoHouse = address.geoHouse;
        };

        $scope.houseBlur = function () {

            $scope.view.houseNotFound = false;

            if (object.geoAddress && $scope.geoHouse) {

                var qArr = [object.geoObl];

                if (object.geoRaion) {
                    qArr.push(object.geoRaion);
                }

                if (object.geoPlace) {
                    qArr.push(object.geoPlace);
                }

                if (object.geoStreet) {
                    qArr.push(object.geoStreet);
                }

                if ($scope.geoHouse) {
                    qArr.push($scope.geoHouse);
                }

                var query = qArr.join(', ');

                api.get('/geocoder?q=' + encodeURIComponent(query) + '&kind=house&results=1', function (err, data) {
                    if (err) return console.error(err);

                    if (data.length > 0 && data[0].geoHouse) {
                        $scope.resolveFullAddress(data[0].geoAddress);
                    } else {
                        $scope.view.houseNotFound = true;
                    }
                });
            }
        };

        $scope.savePublic = function (objectForm) {

            $scope.objectForm = objectForm;

            if (!$scope.formValidatePublic()) {
                $('body,html').animate({scrollTop: 0}, 500);

                $scope.validationError = true;

                return false;
            }

            object.status = RZ.OBJECT_STATUS_MODERATION_PENDING;

            $scope.submit(function (err, response) {
                if (err) {
                    $scope.submitFreezed = false;
                    return console.log(err);
                }
                console.log(response);
                $window.location.href = '/user/objects/' + response.id;
            });
        };

        $scope.submit = function (callback) {
            // TODO: Refactor
            if ($scope.submitFreezed) return false;
            $scope.submitFreezed = true;

            //console.log(object);

            api.post(object.id ? '/user/objects/' + object.id + '/edit' : '/user/objects/create', object, function (err, response) {

                if (callback) return callback(err, response);

                if (!err) {
                    console.log('Change location');
                    $window.location.href = '/user/objects';
                } else {
                    console.log(err);
                    $scope.submitFreezed = false;
                }
            });
        };

        $scope.isRequired = true;

        $scope.objectTypeChange = function () {
            $scope.isRequiredFloorAndFloors();

            clearField.forEach(function (e) {
                if (object[e]) {
                    delete object[e];
                }
            })
        };

        $scope.isRequiredFloorAndFloors = function () {
            return [RZ.OBJECT_TYPE_FLAT, RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1
        };

        $scope.formValidatePublic = function () {

            var result = true;

            switch (object.objectType) {
                case RZ.OBJECT_TYPE_FLAT:
                    if (!object.squareTotal || !object.floor || !object.floorsTotal) {
                        result = false;
                    }
                    break;
                case RZ.OBJECT_TYPE_ROOM:
                    if (!object.squareTotal || !object.squareRooms || !object.floor || !object.floorsTotal) {
                        result = false;
                    }
                    break;
                case RZ.OBJECT_TYPE_HOUSE:
                    if (!object.lotArea || !object.houseArea) {
                        result = false;
                    }
                    break;
                case RZ.OBJECT_TYPE_LAND:
                    if (!object.lotArea) {
                        result = false;
                    }
                    break;
                case RZ.OBJECT_TYPE_GARAGE:
                    if (!object.garageArea || !object.garageType) {
                        result = false;
                    }
                    break;
                case RZ.OBJECT_TYPE_COM:
                    if (object.commercialType != RZ.COMMERCIAL_TYPE_LAND) {
                        if (!object.commercialArea) {
                            result = false;
                        }
                    } else {
                        if (!object.commercialLotArea) {
                            result = false;
                        }
                    }
                    break;
            }

            if (!object.price) {
                result = false;
            }

            return result;
        };

        $scope.changeFormDependingOfOfferType = function () {

            if (object.objectType === RZ.OBJECT_TYPE_LAND && object.offerType === RZ.OFFER_TYPE_RENT) {
                object.objectType = RZ.OBJECT_TYPE_FLAT
            }

        };

        $scope.showFormElement = function (name) {

            switch (name) {
                case 'squareLiving':
                    return [RZ.OBJECT_TYPE_FLAT].indexOf(object.objectType) > -1
                        && [RZ.ROOMS_TYPE_ONE, RZ.ROOMS_TYPE_TWO,
                            RZ.ROOMS_TYPE_THREE, RZ.ROOMS_TYPE_FOUR,
                            RZ.ROOMS_TYPE_FIVE].indexOf(object.rooms) > -1;
                case 'rooms':
                    return [RZ.OBJECT_TYPE_FLAT].indexOf(object.objectType) > -1;
                case 'roomsOffered':
                    return [RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'squareRooms':
                    return [RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'buildingType':
                    return [RZ.OFFER_TYPE_SALE].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'apartments':
                    return [RZ.OFFER_TYPE_SALE].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'yearBuild':
                    return [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'newFlat':
                    return [RZ.OFFER_TYPE_SALE].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_FLAT].indexOf(object.objectType) > -1;
                case 'parkingType':
                    return [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'lift':
                    return [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'serviceLift':
                    return [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'rubbishChute':
                    return [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'security':
                    return [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'privateTerritory':
                    return [RZ.OBJECT_TYPE_FLAT,
                            RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1;
                case 'houseType':
                    return [RZ.OBJECT_TYPE_HOUSE].indexOf(object.objectType) > -1;
                case 'houseArea':
                    return [RZ.OBJECT_TYPE_HOUSE].indexOf(object.objectType) > -1;
                case 'houseFloors':
                    return [RZ.OBJECT_TYPE_HOUSE].indexOf(object.objectType) > -1;
                case 'shower':
                    return [RZ.OBJECT_TYPE_HOUSE].indexOf(object.objectType) > -1;
                case 'toilet':
                    return [RZ.OBJECT_TYPE_HOUSE].indexOf(object.objectType) > -1;
                case 'washingMachine':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'dishwasher':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'refrigerator':
                    return [RZ.OBJECT_TYPE_FLAT].indexOf(object.objectType) > -1
                        || [RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1
                        && [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'television':
                    return [RZ.OBJECT_TYPE_FLAT].indexOf(object.objectType) > -1
                        || [RZ.OBJECT_TYPE_ROOM].indexOf(object.objectType) > -1
                        && [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'tv':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'flatAlarm':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'withChildren':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'withPets':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'period':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'dealStatus':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_COM].indexOf(object.objectType) > -1;
                case 'prepayment':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'agentFee':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'securityPayment':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_COM].indexOf(object.objectType) > -1;
                case 'taxationForm':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_COM].indexOf(object.objectType) > -1;
                case 'mortgage':
                    return [RZ.OFFER_TYPE_SALE].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_FLAT, RZ.OBJECT_TYPE_ROOM,
                            RZ.OBJECT_TYPE_HOUSE, RZ.OBJECT_TYPE_LAND].indexOf(object.objectType) > -1;
                case 'haggle':
                    return [RZ.OBJECT_TYPE_FLAT, RZ.OBJECT_TYPE_ROOM,
                            RZ.OBJECT_TYPE_HOUSE, RZ.OBJECT_TYPE_LAND,
                            RZ.OBJECT_TYPE_GARAGE].indexOf(object.objectType) > -1;
                case 'rentPledge':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1;
                case 'utilitiesIncluded':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_FLAT, RZ.OBJECT_TYPE_ROOM,
                            RZ.OBJECT_TYPE_HOUSE, RZ.OBJECT_TYPE_LAND,
                            RZ.OBJECT_TYPE_GARAGE, RZ.OBJECT_TYPE_COM].indexOf(object.objectType) > -1
                        && [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_BUSINESS,
                            RZ.COMMERCIAL_TYPE_HOTEL, RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'cleaningIncluded':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_COM].indexOf(object.objectType) > -1
                        && [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_BUSINESS,
                            RZ.COMMERCIAL_TYPE_HOTEL, RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'electricityIncluded':
                    return [RZ.OFFER_TYPE_RENT].indexOf(object.offerType) > -1
                        && [RZ.OBJECT_TYPE_COM].indexOf(object.objectType) > -1
                        && [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_BUSINESS,
                            RZ.COMMERCIAL_TYPE_HOTEL, RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'garageGarageType':
                    return [RZ.GARAGE_TYPE_GARAGE].indexOf(object.garageType) > -1;
                case 'garageBoxType':
                    return [RZ.GARAGE_TYPE_BOX].indexOf(object.garageType) > -1;

                case 'purposeBank':
                    return [RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE].indexOf(object.commercialType) > -1;
                case 'purposeFoodStore':
                    return [RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE].indexOf(object.commercialType) > -1;
                case 'purposeBeautyShop':
                    return [RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE].indexOf(object.commercialType) > -1;
                case 'purposeTourAgency':
                    return [RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE].indexOf(object.commercialType) > -1;
                case 'purposeMedicalCenter':
                    return [RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE].indexOf(object.commercialType) > -1;
                case 'purposeShowRoom':
                    return [RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE].indexOf(object.commercialType) > -1;
                case 'purposeAlcohol':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE].indexOf(object.commercialType) > -1;
                case 'purposeStoreHouse':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE].indexOf(object.commercialType) > -1;
                case 'purposePharmaceutical':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE].indexOf(object.commercialType) > -1;

                case 'commercialBuildingType':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_BUSINESS,
                            RZ.COMMERCIAL_TYPE_HOTEL, RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;

                case 'officeClass':
                    return [RZ.COMMERCIAL_BUILDING_TYPE_BUSINESS_CENTER].indexOf(object.commercialBuildingType) > -1
                        && [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_BUSINESS,
                            RZ.COMMERCIAL_TYPE_HOTEL, RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'buildingName':
                    return [RZ.COMMERCIAL_BUILDING_TYPE_BUSINESS_CENTER].indexOf(object.commercialBuildingType) > -1
                        && [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_BUSINESS,
                            RZ.COMMERCIAL_TYPE_HOTEL, RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'entranceType':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_BUSINESS,
                            RZ.COMMERCIAL_TYPE_HOTEL, RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'commercialArea':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_BUSINESS,
                            RZ.COMMERCIAL_TYPE_HOTEL, RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING,
                            RZ.COMMERCIAL_TYPE_LEGAL_ADDRESS].indexOf(object.commercialType) > -1;
                case 'commercialRoomsTotal':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'renovation':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;

                case 'internet':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL].indexOf(object.commercialType) > -1;
                case 'aircondition':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_HOTEL,
                            RZ.COMMERCIAL_TYPE_WAREHOUSE, RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'ventilation':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_HOTEL,
                            RZ.COMMERCIAL_TYPE_WAREHOUSE, RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'fireAlarm':
                    return [RZ.COMMERCIAL_TYPE_OFFICE, RZ.COMMERCIAL_TYPE_RETAIL,
                            RZ.COMMERCIAL_TYPE_FREE_PURPOSE, RZ.COMMERCIAL_TYPE_PUBLIC_CATERING,
                            RZ.COMMERCIAL_TYPE_AUTO_REPAIR, RZ.COMMERCIAL_TYPE_HOTEL,
                            RZ.COMMERCIAL_TYPE_WAREHOUSE, RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'twentyFourSeven':
                    return [RZ.COMMERCIAL_TYPE_OFFICE].indexOf(object.commercialType) > -1;
                case 'accessControlSystem':
                    return [RZ.COMMERCIAL_TYPE_OFFICE].indexOf(object.commercialType) > -1;
                case 'parking':
                    return [RZ.COMMERCIAL_TYPE_OFFICE].indexOf(object.commercialType) > -1;
                case 'eatingFacilities':
                    return [RZ.COMMERCIAL_TYPE_OFFICE].indexOf(object.commercialType) > -1;
                case 'selfSelectionTelecom':
                    return [RZ.COMMERCIAL_TYPE_OFFICE].indexOf(object.commercialType) > -1;
                case 'addingPhoneOnRequest':
                    return [RZ.COMMERCIAL_TYPE_OFFICE].indexOf(object.commercialType) > -1;
                case 'officeWarehouse':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE].indexOf(object.commercialType) > -1;
                case 'responsibleStorage':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE].indexOf(object.commercialType) > -1;
                case 'freightElevator':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'truckEntrance':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'ramp':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'railway':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE,
                            RZ.COMMERCIAL_TYPE_MANUFACTURING].indexOf(object.commercialType) > -1;
                case 'serviceThreePl':
                    return [RZ.COMMERCIAL_TYPE_WAREHOUSE].indexOf(object.commercialType) > -1;


                default:
                    return true;
            }
        }

    }]);