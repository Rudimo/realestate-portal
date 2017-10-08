angular
    .module('Realza')
    .controller('ObjectsSearchFormController', ['RZ', ObjectsSearchFormController]);

function ObjectsSearchFormController(RZ) {

    var $this = this;

    $this.filter = {};

    $this.init = function (filters, breadcrumbsData) {

        if (breadcrumbsData.offerType && breadcrumbsData.objectType) {

            $this.filter.compoundObjectType = obtainCompoundObjectType(filters.inField || []);
        }

        if (breadcrumbsData.offerType) {
            $this.filter.offerType = breadcrumbsData.offerType.number;
        } else {
            $this.filter.offerType = RZ.OFFER_TYPE_SALE;
        }

        if (breadcrumbsData.objectType) {
            $this.filter.objectType = breadcrumbsData.objectType.number;
        } else {
            $this.filter.objectType = RZ.OBJECT_TYPE_FLAT;
            $this.filter.compoundObjectType = RZ.RZ_CMP_V2_OBJECT_TYPE_FLAT;
        }

        if (breadcrumbsData.roomsNumber) {

            $this.filter.rooms = breadcrumbsData.roomsNumber.number;
        }

        if (breadcrumbsData.raion) {

            $this.filter.raion = breadcrumbsData.raion.nameUrl;
        }

        /*if (filters.sorting && filters.sorting.field && filters.sorting.order) {

            if (filters.sorting.field === 'price' && filters.sorting.order === 'asc') {

                $this.filter.sorting = 'price-asc';

            } else if (filters.sorting.field === 'price' && filters.sorting.order === 'desc') {

                $this.filter.sorting = 'price-desc';

            } else {

                $this.filter.sorting = filters.sorting.field;
            }

        } else {
            $this.filter.sorting = 'rating';
        }*/

        angular.forEach(filters.customFilters, function (filterItem) {
            if (filterItem.filterName === 'withImagesOnly') {
                $this.filter[filterItem.filterName] = !!filterItem.filterValue;
            } else if (filterItem.filterName === 'squareTotalMin') {
                $this.filter['squareMin'] = filterItem.filterValue;
            } else if (filterItem.filterName === 'squareTotalMax') {
                $this.filter['squareMax'] = filterItem.filterValue;
            } else if (filterItem.filterName === 'squareLandMin') {
                $this.filter['squareMin'] = filterItem.filterValue;
            } else if (filterItem.filterName === 'squareLandMax') {
                $this.filter['squareMax'] = filterItem.filterValue;
            } else {
                $this.filter[filterItem.filterName] = filterItem.filterValue;
            }
        });

    };

    $this.search = function () {

        var url = window.location.origin;

        if ($this.filter.raion) {

            url += '/' + $this.filter.raion;
        }

        if (+$this.filter.offerType === RZ.OFFER_TYPE_SALE) {
            url += '/kupit';
        } else {
            url = '/snyat';
        }

        switch (+$this.filter.compoundObjectType) {
            case RZ.RZ_CMP_V2_OBJECT_TYPE_FLAT:
                url += '/kvartira';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_ROOM:
                url += '/komnata';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_HOUSE:
                url += '/dom';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COTTAGE:
                url += '/dom/kottedzh';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_DACHA:
                url += '/dom/dacha';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_TOWNHOUSE:
                url += '/dom/taunhaus';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_HALF_HOUSE:
                url += '/dom/chast-doma';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_IGS:
                url += '/uchastok/individualnoe-stroitelstvo';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_GARDEN:
                url += '/uchastok/v-sadovodstve';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_FARM:
                url += '/uchastok/fermerskiy';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_GARAGE:
                url += '/garazh/garazh';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_GARAGE_PARKING_PLACE:
                url += '/garazh/mashinomesto';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_GARAGE_BOX:
                url += '/garazh/boks';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_OFFICE:
                url += '/kommercheskaya-nedvizhimost/ofis';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_RETAIL:
                url += '/kommercheskaya-nedvizhimost/torgovoe-pomeshenie';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE:
                url += '/kommercheskaya-nedvizhimost/pomeshenie-svobodnogo-naznacheniya';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING:
                url += '/kommercheskaya-nedvizhimost/obshepit';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR:
                url += '/kommercheskaya-nedvizhimost/avtoservis';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_BUSINESS:
                url += '/kommercheskaya-nedvizhimost/gotovyi-biznes';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS:
                url += '/kommercheskaya-nedvizhimost/yuridicheskiy-adres';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LAND:
                url += '/kommercheskaya-nedvizhimost/zemelnyi-uchastok';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_HOTEL:
                url += '/kommercheskaya-nedvizhimost/gostinica';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_WAREHOUSE:
                url += '/kommercheskaya-nedvizhimost/sklad';
                break;
            case RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_MANUFACTURING:
                url += '/kommercheskaya-nedvizhimost/proizvodstvennoe-pomeshenie';
                break;
        }

        if ($this.filter.rooms) {

            switch ($this.filter.rooms) {
                case 1:
                    url += '/odnokomnatnaya';
                    break;
                case 2:
                    url += '/dvuhkomnatnaya';
                    break;
                case 3:
                    url += '/trekhkomnatnaya';
                    break;
                case 4:
                    url += '/chetyrekhkomnatnaya';
                    break;
                case 5:
                    url += '/pyatikomnatnaya';
                    break;
                case 6:
                    url += '/studiya';
                    break;
                case 7:
                    url += '/svobodnaya-planirovka';
                    break;

            }
        }

        var queryParams = {};

        if ($this.filter.priceMin) {
            queryParams.priceMin = $this.filter.priceMin.replace(/\s/g, '');
        }

        if ($this.filter.priceMax) {
            queryParams.priceMax = $this.filter.priceMax.replace(/\s/g, '');
        }

        if ($this.filter.squareMin) {
            if ([RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_IGS, RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_GARDEN,
                    RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_FARM].indexOf($this.filter) > -1) {

                queryParams.squareLandMin = $this.filter.squareMin.replace(/\s/g, '');

            } else {

                queryParams.squareTotalMin = $this.filter.squareMin.replace(/\s/g, '');
            }
        }

        if ($this.filter.squareMax) {
            if ([RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_IGS, RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_GARDEN,
                    RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_FARM].indexOf($this.filter) > -1) {

                queryParams.squareLandMax = $this.filter.squareMax.replace(/\s/g, '');

            } else {

                queryParams.squareTotalMax = $this.filter.squareMax.replace(/\s/g, '');
            }
        }

        /*if ($this.filter.sorting) {

            if ($this.filter.sorting === 'price-asc') {

                queryParams.sortingField = 'price';
                queryParams.sortingOrder = 'asc';

            } else if ($this.filter.sorting === 'price-desc') {

                queryParams.sortingField = 'price';
                queryParams.sortingOrder = 'desc';

            } else {

                queryParams.sortingField = $this.filter.sorting;
                queryParams.sortingOrder = 'desc';
            }
        }*/

        // if ($this.filter.withImagesOnly) {
        //     filter.withImagesOnly = true;
        // }

        /*if ($this.filter.sorting) {

            url += '?' + decodeURIComponent($.param({filter: queryParams}));
        }*/

        window.location.href = url;//'/objects?' + decodeURIComponent($.param({filter: queryParams}));
    };

    function obtainCompoundObjectType(inFieldFilter) {

        var objectTypeArr = inFieldFilter.filter(function (item) {
            return item.fieldName == 'objectType'
        });

        if (objectTypeArr.length == 0) return ''; // Not specified, composite object type can't be recognised

        var objectType = +objectTypeArr[0].fieldValue;

        switch (objectType) {
            case RZ.OBJECT_TYPE_FLAT:
                return RZ.RZ_CMP_V2_OBJECT_TYPE_FLAT;
            case RZ.OBJECT_TYPE_ROOM:
                return RZ.RZ_CMP_V2_OBJECT_TYPE_ROOM;
            case RZ.OBJECT_TYPE_HOUSE:

                var buildingTypeArr = inFieldFilter.filter(function (item) {
                    return item.fieldName == 'buildingType'
                });

                if (buildingTypeArr.length == 0) return RZ.RZ_CMP_V2_OBJECT_TYPE_HOUSE;

                var buildingType = +buildingTypeArr[0].fieldValue;

                switch (buildingType) {
                    case RZ.HOUSE_TYPE_HOUSE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_HOUSE;
                    case RZ.HOUSE_TYPE_COTTAGE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COTTAGE;
                    case RZ.HOUSE_TYPE_DACHA:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_DACHA;
                    case RZ.HOUSE_TYPE_TOWNHOUSE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_TOWNHOUSE;
                    case RZ.HOUSE_TYPE_HALF_HOUSE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_HALF_HOUSE;
                }
                break;

            case RZ.OBJECT_TYPE_LAND:

                var landTypeArr = inFieldFilter.filter(function (item) {
                    return item.fieldName == 'lotType'
                });

                if (landTypeArr.length == 0) return ''; // Not specified, composite object type can't be recognised

                var landType = +landTypeArr[0].fieldValue;

                switch (landType) {
                    case RZ.LOT_TYPE_IGS:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_IGS;
                    case RZ.LOT_TYPE_GARDEN:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_GARDEN;
                    case RZ.LOT_TYPE_FARM:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_LOT_FARM;
                }
                break;

            case RZ.OBJECT_TYPE_GARAGE:

                var garageTypeArr = inFieldFilter.filter(function (item) {
                    return item.fieldName == 'garageType'
                });

                if (garageTypeArr.length == 0) return ''; // Not specified, composite object type can't be recognised

                var garageType = +garageTypeArr[0].fieldValue;

                switch (garageType) {
                    case RZ.GARAGE_TYPE_PARKING_PLACE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_GARAGE_PARKING_PLACE;
                    case RZ.GARAGE_TYPE_GARAGE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_GARAGE;
                    case RZ.GARAGE_TYPE_BOX:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_GARAGE_BOX;
                }
                break;

            case RZ.OBJECT_TYPE_COM:

                var commercialTypeArr = inFieldFilter.filter(function (item) {
                    return item.fieldName == 'commercialType'
                });

                if (commercialTypeArr.length == 0) return ''; // Not specified, composite object type can't be recognised

                var commercialType = +commercialTypeArr[0].fieldValue;

                switch (commercialType) {
                    case RZ.COMMERCIAL_TYPE_OFFICE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_OFFICE;
                    case RZ.COMMERCIAL_TYPE_RETAIL:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_RETAIL;
                    case RZ.COMMERCIAL_TYPE_FREE_PURPOSE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE;
                    case RZ.COMMERCIAL_TYPE_PUBLIC_CATERING:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING;
                    case RZ.COMMERCIAL_TYPE_AUTO_REPAIR:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR;
                    case RZ.COMMERCIAL_TYPE_BUSINESS:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_BUSINESS;
                    case RZ.COMMERCIAL_TYPE_LEGAL_ADDRESS:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS;
                    case RZ.COMMERCIAL_TYPE_LAND:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LAND;
                    case RZ.COMMERCIAL_TYPE_HOTEL:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_HOTEL;
                    case RZ.COMMERCIAL_TYPE_WAREHOUSE:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_WAREHOUSE;
                    case RZ.COMMERCIAL_TYPE_MANUFACTURING:
                        return RZ.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_MANUFACTURING;

                }
                break;
        }

        console.error('obtainCompoundObjectType: Can\'t get compoundObjectType from infield filter');
    }

}