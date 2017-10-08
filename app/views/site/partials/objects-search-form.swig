{% macro objectsSearchForm() %}

  {% set init = 'ctrl.init(' + JSON.stringify(filters) + ', ' + JSON.stringify(breadcrumbsData) + ')' %}

  <form id="realestate-search-form" data-ng-controller="ObjectsSearchFormController as ctrl"
        data-ng-init="{{ init }}" data-ng-submit="ctrl.search()" class="sky-form boxed ng-cloak">
    <div class="box-body">

      <div class="form-group">
        <span class="label">Тип сделки </span>
        <select name="offerType" class="form-control style-select action-immovable" required
                data-ng-model="ctrl.filter.offerType" data-convert-to-number>
          <option value="" disabled>Выберите тип сделки</option>
          <option value="{{ c.RZ_OFFER_TYPE_SALE }}">
            Купить
          </option>
          <option value="{{ c.RZ_OFFER_TYPE_RENT }}">
            Снять
          </option>
        </select>
      </div>

      <div class="form-group">
        <span class="label">Тип недвижимости </span>
        <select name="compoundObjectType" class="form-control style-select type-immovable" required
                data-ng-model="ctrl.filter.compoundObjectType" data-convert-to-number>
          <option value="" disabled>Выберите тип недвижимости</option>
          <optgroup label="Жилую недвижимость">
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_FLAT }}">Квартиру</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_ROOM }}">Комнату</option>
          </optgroup>

          <optgroup label="Загородную недвижимость">
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_HOUSE }}">Дом</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COTTAGE }}">Коттедж</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_DACHA }}">Дачу</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_TOWNHOUSE }}">Таунхаус</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_HALF_HOUSE }}">Часть дома</option>
          </optgroup>

          <optgroup label="Землю" data-ng-show="ctrl.filter.offerType == {{ c.RZ_OFFER_TYPE_SALE }}">
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_LOT_IGS }}">Участок ИЖС</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_LOT_GARDEN }}">Участок в садоводстве</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_LOT_FARM }}">Участок фермерский</option>
          </optgroup>

          <optgroup label="Гараж">
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_GARAGE }}">Гараж</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_GARAGE_PARKING_PLACE }}">Машиноместо</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_GARAGE_BOX }}">Бокс</option>
          </optgroup>

          <optgroup label="Коммерческую недвижимость">
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_OFFICE }}">Офис</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_RETAIL }}">Торговое помещение</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE }}">Помещение свободного назначения</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING }}">Общепит</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR }}">Автосервис</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_BUSINESS }}">Готовый бизнес</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS }}">Юридический адрес</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LAND }}">Землю коммерческого назначения</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_HOTEL }}">Гостиницу</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_WAREHOUSE }}">Склад</option>
            <option value="{{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_MANUFACTURING }}">Производственное помещение</option>
          </optgroup>
        </select>
      </div>

      <div class="form-group">

        <span class="label"
              data-ng-if="ctrl.filter.compoundObjectType === {{ c.RZ_CMP_V2_OBJECT_TYPE_FLAT }}">
          Кол-во комнат </span>
        <select name="rooms" class="form-control style-select amount-immovable" data-ng-model="ctrl.filter.rooms"
                data-ng-if="ctrl.filter.compoundObjectType === {{ c.RZ_CMP_V2_OBJECT_TYPE_FLAT }}"
                title="Количество комнат в квартире" data-convert-to-number>
          <option value="" disabled selected>
            Комнат
          </option>
          <option value="1">1 комната</option>
          <option value="2">2 комнаты</option>
          <option value="3">3 комнаты</option>
          <option value="4">4 комнаты</option>
          <option value="5">5 комнат</option>
          <option value="6">Студия</option>
          <option value="7">Свободная планировка</option>
        </select>

        <div class="immovable-house-square"
             data-ng-if="[{{ c.RZ_CMP_V2_OBJECT_TYPE_HOUSE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_ROOM }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COTTAGE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_DACHA }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_TOWNHOUSE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_HALF_HOUSE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_LOT_IGS }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_LOT_GARDEN }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_LOT_FARM }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_GARAGE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_GARAGE_PARKING_PLACE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_GARAGE_BOX }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_OFFICE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_RETAIL }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_BUSINESS }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_LAND }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_HOTEL }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_WAREHOUSE }},
                          {{ c.RZ_CMP_V2_OBJECT_TYPE_COMMERCIAL_MANUFACTURING }}].indexOf(ctrl.filter.compoundObjectType) > -1">
          <span class="label">Площадь: </span>
          <input type="text" class="form-control numeric-input" style="width: 49%; display: inline-block;" placeholder="от" data-ng-model="ctrl.filter.squareMin">
          <input type="text" class="form-control numeric-input" style="width: 49%; display: inline-block;" placeholder="до" data-ng-model="ctrl.filter.squareMax">
        </div>

      </div>

      <div class="immovable-price">
        <span class="label">Цена: </span>
        <input type="text" class="form-control numeric-input" style="width: 49%; display: inline-block;" placeholder="от ₽" data-ng-model="ctrl.filter.priceMin">
        <input type="text" class="form-control numeric-input" style="width: 49%; display: inline-block;" placeholder="до ₽" data-ng-model="ctrl.filter.priceMax">
      </div>

      <button class="btn btn-info btn-block" type="submit">Найти</button>
    </div>

  </form>

  {#<pre>{{ filters | json(2) }}</pre>#}
  {#<pre>{{ breadcrumbsData | json(2) }}</pre>#}

{% endmacro %}