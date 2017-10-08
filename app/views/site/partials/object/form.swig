{% set init = 'init(' + JSON.stringify(item.toObject({getters:true})) + ')' %}

{% macro objectFormSelect(options) %}
  {# options.fieldName - FieldName #}
  {# options.selected  - Selected option #}
  {# options.columns   - Width element #}
  {# options.required  - Required field #}
  {# options.noRow     - Not added div.row #}
  {# options.NotCheck  - Not checked for visibility #}

  {% set fieldName = options.fieldName %}
  {% set paramInfo = paramsMap | find({fieldName: fieldName}) %}
  {% set selected = options.selected %}

  {% if not options.noRow %}
    <div class="row">
  {% endif %}
  <div class="field"
       {% if not options.NotCheck %}data-ng-if="showFormElement('{{ fieldName }}')"{% endif %}>
    <span class="col-md-4 field-name">{{ paramInfo.name }}</span>
    <div class="col-md-{{ options.columns }}">
      <select class="form-control" name="{{ fieldName }}"
              data-ng-model="object.{{ fieldName }}"
        {% if selected %} data-ng-init="object.{{ fieldName }} = {{ selected }}" {% endif %}
        {% if options.required %} data-ng-required="isRequired"{% endif %}
              data-convert-to-number>

        <option value="" disabled selected>Не выбрано</option>

        {% for option in paramInfo.allowedValues %}
          <option value={{ option.value }}>{{ option.label }}</option>
        {% endfor %}

      </select>
    </div>
  </div>
  {% if not options.noRow %}
    </div>
  {% endif %}

{% endmacro %}

{% macro objectFormBtnGroup(options) %}
  {# options.fieldName - FieldName #}
  {# options.noRow     - Not added div.row #}
  {# options.required  - Required field #}
  {# options.NotCheck  - Not checked for visibility #}

  {% set paramInfo = paramsMap | find({fieldName: options.fieldName}) %}

  {% if not options.noRow %}
    <div class="row">
  {% endif %}
  <div class="field"
       {% if not options.NotCheck %}data-ng-if="showFormElement('{{ options.fieldName }}')"{% endif %}>
    <span class="col-md-4 field-name">{{ paramInfo.name }}</span>
    <div class="col-md-8">
      <div class="btn-group">
        {% for option in paramInfo.allowedValues %}
          <label class="btn btn-sky"
                 uib-btn-radio="{{ option.value }}"
                 data-ng-model="object.{{ options.fieldName }}"
                 data-ng-click="changeFormDependingOfOfferType()"
            {% if options.required %} data-ng-required="isRequired" {% endif %}>
            {{ option.label }}
          </label>
        {% endfor %}
      </div>
    </div>
  </div>
  {% if not options.noRow %}
    </div>
  {% endif %}

{% endmacro %}

{% macro objectFormInput(options) %}
  {# options.fieldName - FieldName #}
  {# options.type      - Input type #}
  {# options.text      - Text after input #}
  {# options.columns   - Width element #}
  {# options.noRow     - Not added div.row #}
  {# options.required  - Required field #}
  {# options.NotCheck  - Not checked for visibility #}

  {% set paramInfo = paramsMap | find({fieldName: options.fieldName}) %}

  {% if not options.noRow %}
    <div class="row">
  {% endif %}
  <div class="field"
       {% if not options.NotCheck %}data-ng-if="showFormElement('{{ options.fieldName }}')"{% endif %}>
    <span class="col-md-4 field-name">{{ paramInfo.name }}</span>
    <div class="col-md-{{ options.columns }}">
      <input name="{{ options.fieldName }}"
             data-ng-model="object.{{ options.fieldName }}"
             class="form-control"
             type="{{ options.type }}"
        {% if options.required %} data-ng-required="isRequired" {% endif %}>
    </div>
    {% if options.text %}
      <span>{{ options.text }}</span>
    {% endif %}
  </div>
  {% if not options.noRow %}
    </div>
  {% endif %}

{% endmacro %}

{% macro objectFormCheckBox(options) %}
  {# options.fieldName - FieldName #}
  {# options.name      - CheckBox name #}

  <div class="field" data-ng-if="showFormElement('{{ options.fieldName }}')">
    <label class="checkbox">
      <input type="checkbox" name="{{ options.fieldName }}" data-ng-model="object.{{ options.fieldName }}">
      <i></i> {{ options.name }}
    </label>
  </div>
{% endmacro %}

{% macro floorAndFloorsMacro() %}
  <div class="row field"
       data-ng-if="[1,2,3,4,9,11].indexOf(object.commercialType) > -1 || [1,2].indexOf(object.objectType) > -1">
    <span class="col-md-4 field-name">Этаж и этажность</span>

    <div class="col-md-5">
      <div class="input-group">
        <input name="floor" class="form-control" type="number"
               data-ng-model="object.floor" data-ng-required="isRequiredFloorAndFloors()">
        <div class="input-group-btn halfwidth">
          <input name="floorsTotal" class="form-control" type="number"
                 data-ng-model="object.floorsTotal" data-ng-required="isRequiredFloorAndFloors()">
        </div>
      </div>
    </div>
  </div>
{% endmacro %}

<script type="text/ng-template" id="addressPickerTemplate.html">
  <ul class="dropdown-menu"
      data-ng-show="isOpen() && !moveInProgress"
      data-ng-style="{top: position().top+'px', left: position().left+'px'}"
      style="display: block;"
      role="listbox"
      aria-hidden="{[{ !isOpen() }]}">

    <li data-ng-repeat="match in matches track by $index" data-ng-class="{active: isActive($index) }"
        data-ng-mouseenter="selectActive($index)" data-ng-click="selectMatch($index)" role="option">
      <div data-uib-typeahead-match data-index="$index" data-match="match" data-query="query">
        {#<a href tabindex="-1" data-ng-bind-html="match.label | typeaheadHighlight:query"></a>#}
      </div>
    </li>
  </ul>
</script>

<div class="col-lg-9 col-md-9 col-sm-8 margin-bottom-80 ng-cloak"
     data-ng-controller="UserObjectFormController"
     data-ng-init="{{ init }}">
  <div class="col-md-8">
    <div class="row">

      <h3 class="alert-error" data-ng-if="validationError">Заполните все обязательные поля!</h3>

      <form class="form-horizontal object-form" name="objectForm" novalidate>


        <h5>Тип объявления</h5>

        {{ objectFormBtnGroup({fieldName: 'offerType', NotCheck: true}) }}

        <div class="row">
          <div class="field">
            <span class="col-md-4 field-name">Тип недвижимости</span>
            <div class="col-md-4">
              <select class="form-control" name="objectType"
                      data-ng-model="object.objectType"
                      data-ng-change="objectTypeChange()"
                      data-convert-to-number>
                <option value="1">Квартира</option>
                <option value="2">Комната</option>
                <option value="3">Дом</option>
                <option value="4" data-ng-disabled="object.offerType === 2">Земля</option>
                <option value="5">Гараж</option>
                <option value="6">Коммерческая</option>
              </select>
            </div>
          </div>
        </div>

        {# Адрес #}
        <div class="realza-form-group">
          <hr>

          {#<h5>Адрес</h5>#}
          <div class="row">

            <div class="col-md-9">
              <label for="geoAddress">Адрес</label>
              <input id="geoAddress"
                     name="geoAddress"
                     type="text"
                     class="form-control field-name"
                     autocomplete="off"
                     data-ng-model="geoAddress"
                     data-typeahead-wait-ms="500"
                     data-typeahead-on-select="resolveFullAddress($item)"
                     data-typeahead="geoAddress as geoAddress for geoAddress in getAutocomplete($viewValue)"
                     data-uib-typeahead="geoAddress as geoAddress for geoAddress in getAutocomplete($viewValue)"
                     data-typeahead-popup-template-url="addressPickerTemplate.html"/>
              <span class="help-block">Начинайте вводить адрес и выберите из списка</span>
            </div>
            <div class="col-md-3">
              {# TODO Ошибка при вводе поля #}
              <label for="geoHouse">Номер дома</label>
              <input type="text" id="geoHouse" name="geoHouse" class="form-control field-name" autocomplete="off"
                     data-ng-model="geoHouse"
                     data-ng-blur="houseBlur()">
              <span class="help-block" data-ng-if="view.houseNotFound">Номер дома не найден</span>
            </div>
          </div>

        </div>

        {# Параметры участка #}
        <div class="realza-form-group" data-ng-if="[3,4].indexOf(object.objectType) > -1">
          <hr>

          <h5>Параметры участка</h5>

          <div class="row">
            <span class="col-md-4 field-name">Площадь участка</span>

            <div class="col-md-5">
              <div class="input-group">
                <input class="form-control" name="lotArea" type="number"
                       data-ng-model="object.lotArea" required>
                <div class="input-group-btn">
                  <select name="lotAreaUnit" class="btn btn-sky dropdown-toggle btn-group-select"
                          data-ng-model="object.lotAreaUnit"
                          data-ng-init="object.lotAreaUnit = 1"
                          data-convert-to-number>
                    <option value="1">соток</option>
                    <option value="2">гектар</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {{ objectFormSelect({fieldName: 'lotType', columns: 4, selected: 1}) }}

        </div>

        {# Параметры дома #}
        <div class="realza-form-group" data-ng-if="[1,2,3].indexOf(object.objectType) > -1">
          <hr>

          <h5>Параметры дома</h5>

          {{ objectFormSelect({fieldName: 'houseType', columns: 4, selected: 1}) }}

          <div class="row">
            {{ objectFormSelect({fieldName: 'buildingType', columns: 4, noRow: true}) }}
            {{ objectFormCheckBox({name: 'Апартаменты', fieldName: 'apartments'}) }}
          </div>

          <div class="row">
            {{ objectFormInput({fieldName: 'yearBuild', type: 'number', columns: 3, noRow: true}) }}
            {{ objectFormCheckBox({name: 'Дом не сдан', fieldName: 'newFlat'}) }}
          </div>

          {{ objectFormSelect({fieldName: 'parkingType', columns: 4}) }}

          <div class="row">
            <div class="col-md-5 col-md-offset-4 not-inline">
              {{ objectFormCheckBox({name: 'Лифт', fieldName: 'lift'}) }}
              {{ objectFormCheckBox({name: 'Грузовой лифт', fieldName: 'serviceLift'}) }}
              {{ objectFormCheckBox({name: 'Мусоропровод', fieldName: 'rubbishChute'}) }}
              {{ objectFormCheckBox({name: 'Охрана/консьерж', fieldName: 'security'}) }}
              {{ objectFormCheckBox({name: 'Закрытая территория', fieldName: 'privateTerritory'}) }}
            </div>
          </div>

          {{ objectFormInput({fieldName: 'houseArea', type: 'number', columns: 3, text: 'м²', required: true}) }}
          {{ objectFormInput({fieldName: 'houseFloors', type: 'number', columns: 3, required: true}) }}
          {{ objectFormSelect({fieldName: 'shower', columns: 4}) }}
          {{ objectFormSelect({fieldName: 'toilet', columns: 4}) }}

          <div class="row" data-ng-if="object.objectType === 3">
            <div class="col-md-4 col-md-offset-4">
              {{ objectFormCheckBox({name: 'Возможность ПМЖ', fieldName: 'pmg'}) }}
              {{ objectFormCheckBox({name: 'Отопление', fieldName: 'heatingSupply'}) }}
              {{ objectFormCheckBox({name: 'Канализация', fieldName: 'sewerageSupply'}) }}
              {{ objectFormCheckBox({name: 'Газ', fieldName: 'gasSupply'}) }}
              {{ objectFormCheckBox({name: 'Сауна', fieldName: 'sauna'}) }}
            </div>
            <div class="col-md-4">
              {{ objectFormCheckBox({name: 'Наличие кухни', fieldName: 'kitchen'}) }}
              {{ objectFormCheckBox({name: 'Водопровод', fieldName: 'waterSupply'}) }}
              {{ objectFormCheckBox({name: 'Электроснабжение', fieldName: 'electricitySupply'}) }}
              {{ objectFormCheckBox({name: 'Бильярд', fieldName: 'billiard'}) }}
              {{ objectFormCheckBox({name: 'Бассейн', fieldName: 'pool'}) }}
            </div>
          </div>

        </div>

        {# Параметры квартиры #}
        <div class="realza-form-group" data-ng-if="[1,2].indexOf(object.objectType) > -1">
          <hr>

          <h5>Параметры Квартиры</h5>

          {{ floorAndFloorsMacro() }}

          {{ objectFormSelect({fieldName: 'rooms', columns: 4, required: true}) }}

          <div class="row" data-ng-if="showFormElement('roomsOffered')">
            <div class="field">
              <span class="col-md-4 field-name">Комнат в сделке</span>
              <div class="col-md-2">
                <select class="form-control" name="roomsOffered"
                        data-ng-model="object.roomsOffered"
                        data-ng-init="object.roomsOffered = 1"
                        data-convert-to-number>
                  {% for i in [1,2,3,4,5] %}
                    <option value={{ i }}>{{ i }}</option>
                  {% endfor %}
                </select>
              </div>
            </div>
          </div>

          {{ objectFormInput({fieldName: 'squareTotal', type: 'number', columns: 3, text: 'м²', required: true}) }}
          {{ objectFormInput({fieldName: 'squareRooms', type: 'number', columns: 3, text: 'м²', required: true}) }}
          {{ objectFormInput({fieldName: 'squareLiving', type: 'number', columns: 3, text: 'м²'}) }}
          {{ objectFormInput({fieldName: 'squareKitchen', type: 'number', columns: 3, text: 'м²'}) }}
          {{ objectFormInput({fieldName: 'ceilingHeight', type: 'number', columns: 3, text: 'м'}) }}
          {{ objectFormBtnGroup({fieldName: 'bathroom'}) }}
          {{ objectFormBtnGroup({fieldName: 'balcony'}) }}

          <div class="row" data-ng-if="showFormElement('windowViewYard')">
            <span class="col-md-4 field-name">Окна выходят</span>
            <div class="col-md-6">
              {{ objectFormCheckBox({name: 'Во двор', fieldName: 'windowViewYard'}) }}
              {{ objectFormCheckBox({name: 'На улицу', fieldName: 'windowViewStreet'}) }}
            </div>
          </div>

          {{ objectFormSelect({fieldName: 'covering', columns: 4}) }}
          {{ objectFormSelect({fieldName: 'renovation', columns: 4}) }}

          <div class="row">
            <div class="col-md-4 col-md-offset-4">
              {{ objectFormCheckBox({name: 'Телефон', fieldName: 'phone'}) }}
              {{ objectFormCheckBox({name: 'Мебель в квартире', fieldName: 'roomFurniture'}) }}
              {{ objectFormCheckBox({name: 'Стиральная машина', fieldName: 'washingMachine'}) }}
              {{ objectFormCheckBox({name: 'Посудомойка', fieldName: 'dishwasher'}) }}
              {{ objectFormCheckBox({name: 'Встроенная техника', fieldName: 'buildInTech'}) }}
              {{ objectFormCheckBox({name: 'Холодильник', fieldName: 'refrigerator'}) }}
              {{ objectFormCheckBox({name: 'Телевизор', fieldName: 'tv'}) }}
            </div>
            <div class="col-md-4">
              {{ objectFormCheckBox({name: 'Интернет', fieldName: 'internet'}) }}
              {{ objectFormCheckBox({name: 'Телевидение', fieldName: 'television'}) }}
              {{ objectFormCheckBox({name: 'Мебель на кухне', fieldName: 'kitchenFurniture'}) }}
              {{ objectFormCheckBox({name: 'Кондиционер', fieldName: 'aircondition'}) }}
              {{ objectFormCheckBox({name: 'Сигнализация', fieldName: 'flatAlarm'}) }}
              {{ objectFormCheckBox({name: 'Можно с детьми', fieldName: 'withChildren'}) }}
              {{ objectFormCheckBox({name: 'Можно с животными', fieldName: 'withPets'}) }}
            </div>
          </div>

        </div>

        {# Параметры объекта && О здании #}
        <div class="realza-form-group" data-ng-if="[5].indexOf(object.objectType) > -1">
          <hr>

          <h5>Параметры объекта</h5>

          {{ objectFormBtnGroup({fieldName: 'garageType', required: true}) }}
          {{ objectFormSelect({fieldName: 'garageGarageType', columns: 4}) }}
          {{ objectFormSelect({fieldName: 'garageBoxType', columns: 4}) }}
          {{ objectFormInput({fieldName: 'garageArea', type: 'number', columns: 3, text: 'м²', required: true}) }}
          {{ objectFormSelect({fieldName: 'garageStatus', columns: 4}) }}

          <hr>

          <h5>О здании</h5>

          {{ objectFormInput({fieldName: 'gsk', type: 'text', columns: 6}) }}
          {{ objectFormSelect({fieldName: 'garageParking', columns: 4}) }}

          <div class="row">
            <span class="col-md-4 field-name">Технические характеристики</span>
            <div class="col-md-5">
              {{ objectFormCheckBox({name: 'Свет', fieldName: 'garageHasLight'}) }}
              {{ objectFormCheckBox({name: 'Электричество', fieldName: 'garageHasElectricity'}) }}
              {{ objectFormCheckBox({name: 'Вода', fieldName: 'garageHasWater'}) }}
              {{ objectFormCheckBox({name: 'Отопление', fieldName: 'garageHasHeating'}) }}
              {{ objectFormCheckBox({name: 'Система пожаротушения', fieldName: 'garageHasExtinguishingSystem'}) }}
            </div>
          </div>

        </div>

        {# Характеристики (коммерческая) #}
        <div class="realza-form-group" data-ng-if="[6].indexOf(object.objectType) > -1">
          <hr>

          <h5>Характеристики</h5>

          <div class="row">
            <div class="field">
              <span class="col-md-4 field-name">Основное назначение</span>
              <div class="col-md-6">
                <select class="form-control" name="commercialType"
                        data-ng-model="object.commercialType"
                        data-ng-init="object.commercialType = 1"
                        data-convert-to-number>
                  <option value="1">Офисное помещение</option>
                  <option value="2">Торговое помещение</option>
                  <option value="3">Помещение свободного назначения</option>
                  <option value="4">Общепит</option>
                  <option value="5">Автосервис</option>
                  <option value="6">Готовый бизнес</option>
                  <option value="7" data-ng-disabled="object.offerType === 1">Юридический адрес</option>
                  <option value="8">Земельный участок</option>
                  <option value="9">Гостиница</option>
                  <option value="10">Складское помещение</option>
                  <option value="11">Производственное помещение</option>
                </select>
              </div>
            </div>
          </div>


          <div class="row" data-ng-if="[2,3,10].indexOf(object.commercialType) > -1">
            <span class="col-md-4 field-name">Возможное назначение</span>
            <div class="col-md-5">
              {{ objectFormCheckBox({name: 'Помещение для банка', fieldName: 'purposeBank'}) }}
              {{ objectFormCheckBox({name: 'Продуктовый магазин', fieldName: 'purposeFoodStore'}) }}
              {{ objectFormCheckBox({name: 'Салон красоты', fieldName: 'purposeBeautyShop'}) }}
              {{ objectFormCheckBox({name: 'Турагенство', fieldName: 'purposeTourAgency'}) }}
              {{ objectFormCheckBox({name: 'Медицинский центр', fieldName: 'purposeMedicalCenter'}) }}
              {{ objectFormCheckBox({name: 'Шоу-рум', fieldName: 'purposeShowRoom'}) }}
              {{ objectFormCheckBox({name: 'Алкогольный склад', fieldName: 'purposeAlcohol'}) }}
              {{ objectFormCheckBox({name: 'Овощехранилище', fieldName: 'purposeStoreHouse'}) }}
              {{ objectFormCheckBox({name: 'Фармацевтический склад', fieldName: 'purposePharmaceutical'}) }}
            </div>
          </div>

          {# Тип здания #}
          {{ objectFormSelect({fieldName: 'commercialBuildingType', columns: 6, selected: 1}) }}
          {{ objectFormSelect({fieldName: 'officeClass', columns: 2, selected: 1}) }}
          {{ objectFormInput({fieldName: 'buildingName', type: 'text', columns: 7}) }}
          {{ floorAndFloorsMacro() }}
          {{ objectFormInput({fieldName: 'commercialArea', type: 'number', columns: 3, text: 'м²', required: true}) }}

          <div class="row" data-ng-if="[8].indexOf(object.commercialType) > -1">
            <span class="col-md-4 field-name">Площадь участка</span>

            <div class="col-md-5">
              <div class="input-group">
                <input class="form-control" name="commercialLotArea" type="number"
                       data-ng-model="object.commercialLotArea" required>
                <div class="input-group-btn">
                  <select name="lotAreaUnit" class="btn btn-sky dropdown-toggle btn-group-select"
                          data-ng-model="object.lotAreaUnit"
                          data-ng-init="object.lotAreaUnit = 1"
                          data-convert-to-number>
                    <option value="1">соток</option>
                    <option value="2">гектар</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {{ objectFormInput({fieldName: 'commercialRoomsTotal', type: 'number', columns: 3}) }}
          {{ objectFormBtnGroup({fieldName: 'entranceType'}) }}
          {{ objectFormSelect({fieldName: 'renovation', columns: 4}) }}

          <div class="row">
            <div class="col-md-7 col-md-offset-4">
              {{ objectFormCheckBox({name: 'Интернет', fieldName: 'internet'}) }}
              {{ objectFormCheckBox({name: 'Кондиционер', fieldName: 'aircondition'}) }}
              {{ objectFormCheckBox({name: 'Вентиляция', fieldName: 'ventilation'}) }}
              {{ objectFormCheckBox({name: 'Пожарная сигнализация', fieldName: 'fireAlarm'}) }}
              {{ objectFormCheckBox({name: 'Доступ на объект 24/7', fieldName: 'twentyFourSeven'}) }}
              {{ objectFormCheckBox({name: 'Пропускная система', fieldName: 'accessControlSystem'}) }}
              {{ objectFormCheckBox({name: 'Охраняемая парковка', fieldName: 'parking'}) }}
              {{ objectFormCheckBox({name: 'Заведение питания в здании', fieldName: 'eatingFacilities'}) }}
              {{ objectFormCheckBox({name: 'Можно выбрать оператора интернета', fieldName: 'selfSelectionTelecom'}) }}
              {{ objectFormCheckBox({name: 'Можно добавить телефонные линии', fieldName: 'addingPhoneOnRequest'}) }}
              {{ objectFormCheckBox({name: 'Наличие офиса на складе', fieldName: 'officeWarehouse'}) }}
              {{ objectFormCheckBox({name: 'Ответственное хранение', fieldName: 'responsibleStorage'}) }}
              {{ objectFormCheckBox({name: 'Грузовой лифт', fieldName: 'freightElevator'}) }}
              {{ objectFormCheckBox({name: 'Возможность подъезда фуры', fieldName: 'truckEntrance'}) }}
              {{ objectFormCheckBox({name: 'Наличие пандуса', fieldName: 'ramp'}) }}
              {{ objectFormCheckBox({name: 'Наличие ветки железной дороги', fieldName: 'railway'}) }}
              {{ objectFormCheckBox({name: 'Наличие 3PL услуг', fieldName: 'serviceThreePl'}) }}
            </div>
          </div>

        </div>

        {# Стоимость #}
        <div class="realza-form-group">
          <hr>

          <h5>Стоимость</h5>

          <div class="row">
            <span class="col-md-4 field-name">Цена</span>

            <div data-ng-class="showFormElement('period') ? 'col-md-6' : 'col-md-4'">
              <div class="input-group">
                <input class="form-control" name="price" type="number" data-ng-model="object.price" required>

                <div class="input-group-btn" data-ng-if="showFormElement('period')">
                  <select name="period" class="btn btn-sky dropdown-toggle btn-group-select"
                          data-ng-model="object.period"
                          data-ng-init="object.period = 1"
                          data-convert-to-number>
                    <option value="1">в месяц</option>
                    <option value="2">в день</option>
                  </select>
                </div>
              </div>
            </div>

            {# TODO как лучше сделать валидацию? #}
            <div class="col-md-offset-4 col-md-8" data-ng-show="objectForm.$submitted || objectForm.price.$touched">
              <div data-ng-show="objectForm.price.$error.required">Поле стоимость обязательна для заполнения.</div>
            </div>

          </div>

          <div class="row">
            <div class="col-md-8 col-md-offset-4 not-inline">
              {{ objectFormCheckBox({name: 'Торг', fieldName: 'haggle'}) }}
              {{ objectFormCheckBox({name: 'Ипотека', fieldName: 'mortgage'}) }}
              {{ objectFormCheckBox({name: 'Залог', fieldName: 'rentPledge'}) }}
              {{ objectFormCheckBox({name: 'Клининг включен', fieldName: 'cleaningIncluded'}) }}
              {{ objectFormCheckBox({name: 'Коммунальные услуги входят в стоимость', fieldName: 'utilitiesIncluded'}) }}
              {{ objectFormCheckBox({name: 'Электроэнергия включена', fieldName: 'electricityIncluded'}) }}
            </div>
          </div>

          {{ objectFormSelect({fieldName: 'dealStatus', columns: 5, selected: 1}) }}
          {{ objectFormInput({fieldName: 'prepayment', type: 'number', columns: 3, text: '%'}) }}
          {{ objectFormInput({fieldName: 'agentFee', type: 'number', columns: 3, text: '%'}) }}
          {{ objectFormInput({fieldName: 'securityPayment', type: 'number', columns: 3, text: '%'}) }}
          {{ objectFormSelect({fieldName: 'taxationForm', columns: 3, selected: 1}) }}

        </div>

        {# Кадастровый номер #}
        <div class="realza-form-group">
          <hr>

          <h5>Кадастровый номер <span>нигде не показываются</span></h5>

          <div class="row">
            <div class="col-md-12">
            <span class="text-muted">
            Кадастровый номер гарантирует достоверность информации об объекте
              недвижимости и подтверждает его реальность. Объявления с кадастровым номером
              показываются выше других в результатах поиска.
          </span>
            </div>
          </div>

          {{ objectFormInput({fieldName: 'cadastralNumber', type: 'number', columns: 6}) }}

        </div>

        {# Описание #}
        <div class="realza-form-group">
          <hr>

          <h5>Описание</h5>

          <div class="row">
            <div class="col-md-12">
              <textarea name="description" data-ng-model="object.description" rows="4"
                        class="form-control required"></textarea>
            </div>
          </div>

        </div>

        {# Фотографии #}
        <div class="realza-form-group">
          <hr>

          <h5>Фотографии</h5>

          <div class="row">
            <div class="col-md-12">

              <div flow-init="{target: '/image', testChunks: false, chunkSize: 50000000}"
                   data-flow-files-submitted="$flow.upload()"
                   data-flow-file-added="imagesAdded($file, $event, $flow)"
                   data-flow-file-success="imageUploaded($file, $message, $flow)">

                <ul data-ng-show="object.images.length > 0"
                    data-dnd-list="object.images"
                    data-dnd-disable-if="object.images.length === 1">
                  <li
                    data-ng-repeat="image in object.images"
                    data-dnd-draggable="image"
                    data-dnd-moved="imageMoved($index)"
                    data-dnd-effect-allowed="move">

                    <dnd-nodrag>
                      <div class="panel">
                        <div class="panel-body">
                          <div class="row">

                            <div class="col-xs-1 move" data-ng-if="object.images.length > 1 && !image.uploading">
                              <i class="fa fa-arrows" dnd-handle aria-hidden="true"></i>
                            </div>

                            <div class="col-xs-1" data-ng-if="image.uploading">
                              <i class="fa fa-refresh fa-spin fa-fw"></i>
                            </div>

                            <div class="col-xs-2">
                              <img class="img img-responsive"
                                   data-ng-src="{[{ image.thumbnailCdnUrl }]}"
                                   data-ng-if="!image.uploading"
                                   alt="Фото">
                            </div>

                            <div class="col-xs-9">
                          <textarea class="form-control" rows="2" data-ng-model="image.title"
                                    placeholder="Введите описание для фото"></textarea>
                              <br>

                              <button type="button" class="btn btn-danger btn-xs"
                                      data-ng-click="deleteImage(image)"
                                      data-ng-if="!image.uploading">
                                Удалить
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    </dnd-nodrag>

                  </li>

                  <li class="dndPlaceholder">
                    Перетащите сюда
                  </li>
                </ul>

                <br>
                <button class="btn btn-primary" type="button" flow-btn>
                  <i class="fa fa-plus" aria-hidden="true"></i>
                  Добавить фото
                </button>
              </div>
            </div>
          </div>

        </div>

        {# Контактная информация #}
        <div class="realza-form-group">
          <hr>

          <h5>Контактная информация</h5>

          <div class="row">
            <div class="col-md-12">
              Контактная информация будет показана на всех ваших объявлениях.
            </div>
          </div>

          <div class="row">
            <span class="col-md-4 field-name">Тип аккаунта</span>
            <div class="col-md-6">
              {# TODO в зависимости от параметра #}
              <span>Собственник</span>
            </div>
          </div>

          <div class="row">
            <span class="col-md-4 field-name">Имя</span>
            <div class="col-md-6">
              {# TODO fullName #}
              <span>Дмитрий</span>
            </div>
          </div>

          <div class="row">
            <span class="col-md-4 field-name">Телефон</span>
            <div class="col-md-6">
              <span>{{ loggedUser.phone }}</span>
            </div>
          </div>

        </div>

        {# Публикация #}
        <div class="realza-form-group">
          <hr>

          <div class="row">
            <input type="submit" disabled class="btn btn-default" value="Сохранить как черновик"
                   data-ng-click="saveDraft(objectForm)">
            <input type="submit" class="btn btn-primary pull-right" value="Опубликовать"
                   data-ng-click="savePublic(objectForm)">
          </div>

        </div>

      </form>

      {#<pre>{{ paramsMap | json(2) }}</pre>#}
    </div>
  </div>
  <div class="col-md-4">
    <div style="border: solid #ececec 1px; height: 800px">
      {#<pre>{[{ object | json }]}</pre>#}
    </div>
  </div>
</div>