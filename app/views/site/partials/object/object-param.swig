{% macro objectParam(name, title) %}
  {% if name %}
    <li>
      <span>{{ title }}:</span>
      <span>{{ name }}</span>
    </li>
  {% endif %}
{% endmacro %}

{% macro objectLabel(title, cssClass) %}
  <span class="label {{ cssClass }}">{{ title }}</span>
{% endmacro %}

{% macro objectFlatAndRoomsLabels() %}

  {% if item.apartments %}
    {{ objectLabel('Апартаменты', 'label-blue') }}
  {% endif %}

  {% if item.objectType == c.RZ_OBJECT_TYPE_FLAT %}
    {% if item.apartments %}
      {{ objectLabel('Дом не сдан', 'label-warning') }}
    {% endif %}
  {% endif %}

{% endmacro %}

{% macro objectPriceParamLabel() %}

  {% if item.haggle %}
    {{ objectLabel('Торг', 'label-info') }}
  {% endif %}

  {% if item.offerType == c.RZ_OFFER_TYPE_SALE %}
    {% if item.mortgage %}
      {{ objectLabel('Ипотека', 'label-info') }}
    {% endif %}
  {% endif %}

  {% if item.offerType == c.RZ_OFFER_TYPE_RENT %}
    {% if item.rentPledge %}
      {{ objectLabel('Залог', 'label-info') }}
    {% endif %}
    {% if item.prepayment %}
      {{ objectLabel('Предоплата ' + item.prepayment + '%', 'label-blue') }}
    {% endif %}
    {% if item.agentFee %}
      {{ objectLabel('Комиссия агента ' + item.agentFee + '%', 'label-blue') }}
    {% endif %}
    {% if item.securityPayment %}
      {{ objectLabel('Обеспечительный платеж ' + item.securityPayment + '%', 'label-blue') }}
    {% endif %}
    {% if item.taxationForm %}
      {% if item.taxationForm == c.RZ_TAXATION_FORM_TYPE_NDS %}
        {% set taxationForm = 'НДС' %}
      {% elseif item.taxationForm == c.RZ_TAXATION_FORM_TYPE_USN %}
        {% set taxationForm = 'УСН' %}
      {% endif %}
      {{ objectLabel('Форма налогобложения ' + taxationForm, 'label-blue') }}
    {% endif %}
    {% if item.dealStatus %}
      {% if item.dealStatus == c.RZ_DEAL_STATUS_DIRECT_RENT %}
        {% set dealStatus = 'Прямая аренда' %}
      {% elseif item.dealStatus == c.RZ_DEAL_STATUS_SUB_RENT %}
        {% set dealStatus = 'Субаренда' %}
      {% elseif item.dealStatus == c.RZ_DEAL_STATUS_SALE_OF_LEASE_RIGHTS %}
        {% set dealStatus = 'Продажа права аренды' %}
      {% endif %}
      {{ objectLabel('Тип сделки ' + dealStatus, 'label-blue') }}
    {% endif %}
    {% if item.cleaningIncluded %}
      {{ objectLabel('Клининг включен', 'label-blue') }}
    {% endif %}
    {% if item.utilitiesIncluded %}
      {{ objectLabel('Коммунальные услуги входят в стоимость', 'label-blue') }}
    {% endif %}
    {% if item.electricityIncluded %}
      {{ objectLabel('Электроэнергия включена', 'label-blue') }}
    {% endif %}
  {% endif %}

{% endmacro %}

{% macro objectCheckBox(param, title) %}
  {% if param %}
    <li>
      <i class="fa fa-check-circle-o"></i>
      <span>{{ title }}</span>
    </li>
  {% endif %}
{% endmacro %}

{% macro objectParamView() %}

  <div class="row object-info">
    <div class="col-md-12 description">
      <h4>Описание</h4>
      <p>{{ item.description }}</p>
    </div>
    <div class="col-md-12">
      <h4>Характеристики объекта</h4>
      <div class="flat-rooms-labels">
        {{ objectFlatAndRoomsLabels() }}
      </div>
      <div class="object-param">

        {% if item.objectType == c.RZ_OBJECT_TYPE_FLAT or item.objectType == c.RZ_OBJECT_TYPE_ROOM %}

          <div class="col-md-6">
            <ul class="value-params">
              {% if item.offerType == c.RZ_OFFER_TYPE_SALE %}
                {% if item.buildingType %}
                  <li>
                    <span>Тип дома:</span>
                    <span>
                  {% if item.buildingType == c.RZ_BUILDING_TYPE_PANEL %}
                    Панельный
                  {% elseif item.buildingType == c.RZ_BUILDING_TYPE_BRICK %}
                    Кирпичный
                  {% elseif item.buildingType == c.RZ_BUILDING_TYPE_MONOLITHIC %}
                    Монолитный
                  {% endif %}
                </span>
                  </li>
                {% endif %}
              {% endif %}

              {{ objectParam(item.yearBuild, 'Год постройки') }}

              {% if item.parkingType %}
                <li>
                  <span>Парковка:</span>
                  <span>
                  {% if item.parkingType == c.RZ_PARKING_TYPE_SPONTANEOUS %}
                    Стихийная
                  {% elseif item.parkingType == c.RZ_PARKING_TYPE_SECURE %}
                    Охраняемая
                  {% elseif item.parkingType == c.RZ_PARKING_TYPE_UNSECURE %}
                    Неохраняемая
                  {% elseif item.parkingType == c.RZ_PARKING_TYPE_UNDERGROUND %}
                    Подземная
                  {% endif %}
                 </span>
                </li>
              {% endif %}

              {{ objectParam(item.floor, 'Этаж') }}
              {{ objectParam(item.floorsTotal, 'Этажность') }}

              {% if item.objectType == c.RZ_OBJECT_TYPE_FLAT %}
                {% if item.rooms %}
                  <li>
                    <span>Количество комнат:</span>
                    <span>
                      {% if item.rooms == c.RZ_ROOMS_TYPE_ONE %}
                        1
                      {% elseif item.rooms == c.RZ_ROOMS_TYPE_TWO %}
                        2
                      {% elseif item.rooms == c.RZ_ROOMS_TYPE_THREE %}
                        3
                      {% elseif item.rooms == c.RZ_ROOMS_TYPE_FOUR %}
                        4
                      {% elseif item.rooms == c.RZ_ROOMS_TYPE_FIVE %}
                        5
                      {% elseif item.rooms == c.RZ_ROOMS_TYPE_STUDIO %}
                        Студия
                      {% elseif item.rooms == c.RZ_ROOMS_TYPE_OPEN %}
                        Свободная планировка
                      {% endif %}
                    </span>
                  </li>
                {% endif %}
              {% endif %}

              {% if item.objectType == c.RZ_OBJECT_TYPE_ROOM %}
                {% if item.roomsOffered %}
                  <li>
                    <span>Комнат в сделке:</span>
                    <span>
                      {% if item.roomsOffered == 1 %}
                        1
                      {% elseif item.roomsOffered == 2 %}
                        2
                      {% elseif item.roomsOffered == 3 %}
                        3
                      {% elseif item.roomsOffered == 4 %}
                        4
                      {% elseif item.roomsOffered == 5 %}
                        5
                      {% endif %}
                    </span>
                  </li>
                {% endif %}
              {% endif %}

              {{ objectParam(item.squareTotal, 'Общая площадь') }}
              {% if item.objectType == c.RZ_OBJECT_TYPE_FLAT %}
                {{ objectParam(item.squareLiving, 'Жилая площадь') }}
              {% endif %}
              {% if item.objectType == c.RZ_OBJECT_TYPE_ROOM %}
                {% if item.offerType == c.RZ_OFFER_TYPE_RENT %}
                  {{ objectParam(item.squareRooms, 'Площадь комнат') }}
                {% endif %}
              {% endif %}
              {{ objectParam(item.squareKitchen, 'Площадь кухни') }}
              {{ objectParam(item.ceilingHeight, 'Высота потолков') }}

              {% if item.bathroom %}
                <li>
                  <span>Санузел:</span>
                  <span>
                  {% if item.bathroom == c.RZ_BATHROOM_TYPE_MATCHED %}
                    Совмещенный
                  {% elseif item.bathroom == c.RZ_BATHROOM_TYPE_SEPARATED %}
                    Раздельный
                  {% elseif item.bathroom == c.RZ_BATHROOM_TYPE_TWO %}
                    2 санузла
                  {% elseif item.bathroom == c.RZ_BATHROOM_TYPE_THREE %}
                    3 санузла
                  {% elseif item.bathroom == c.RZ_BATHROOM_TYPE_FOUR_OR_MORE %}
                    4 санузла и больше
                  {% endif %}
                </span>
                </li>
              {% endif %}

              {% if item.balcony %}
                <li>
                  <span>Балкон:</span>
                  <span>
                  {% if item.balcony == c.RZ_BALCONY_TYPE_NONE %}
                    Нет
                  {% elseif item.balcony == c.RZ_BALCONY_TYPE_BALCONY %}
                    Балкон
                  {% elseif item.balcony == c.RZ_BALCONY_TYPE_LOGGIA %}
                    Лоджия
                  {% endif %}
                </span>
                </li>
              {% endif %}

              {% if item.windowViewYard or item.windowViewStreet %}
                <li>
                  <span>Окна выходят:</span>
                  <span>
                  {% if item.windowViewYard and item.windowViewStreet %}
                    во двор и на улицу
                  {% elseif item.windowViewYard and not item.windowViewStreet %}
                    во двор
                  {% else %}
                    на улицу
                  {% endif %}
                </span>
                </li>
              {% endif %}

              {% if item.covering %}
                <li>
                  <span>Покрытие пола:</span>
                  <span>
                  {% if item.covering == c.RZ_FLOOR_COVERING_TYPE_CARPETING %}
                    Ковролин
                  {% elseif item.covering == c.RZ_FLOOR_COVERING_TYPE_LAMINATE %}
                    Ламинат
                  {% elseif item.covering == c.RZ_FLOOR_COVERING_TYPE_LINOLEUM %}
                    Линолеум
                  {% elseif item.covering == c.RZ_FLOOR_COVERING_TYPE_PARQUET %}
                    Паркет
                  {% endif %}
                </span>
                </li>
              {% endif %}
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="value-check">
              {{ objectCheckBox(item.lift, 'Лифт') }}
              {{ objectCheckBox(item.serviceLift, 'Грузовой лифт') }}
              {{ objectCheckBox(item.rubbishChute, 'Мусоропровод') }}
              {{ objectCheckBox(item.security, 'Охрана/консьерж') }}
              {{ objectCheckBox(item.privateTerritory, 'Закрытая территория') }}

              {{ objectCheckBox(item.phone, 'Телефон') }}
              {{ objectCheckBox(item.roomFurniture, 'Мебель в квартире') }}
              {{ objectCheckBox(item.buildInTech, 'Встроенная техника') }}
              {{ objectCheckBox(item.kitchenFurniture, 'Мебель на кухне') }}

              {% if item.objectType == c.RZ_OBJECT_TYPE_FLAT or
              item.objectType == c.RZ_OBJECT_TYPE_ROOM and
              item.offerType == c.RZ_OFFER_TYPE_RENT %}
                {{ objectCheckBox(item.refrigerator, 'Холодильник') }}
                {{ objectCheckBox(item.television, 'Телевидение') }}
              {% endif %}

              {% if item.offerType == c.RZ_OFFER_TYPE_RENT %}
                {{ objectCheckBox(item.washingMachine, 'Стиральная машина') }}
                {{ objectCheckBox(item.dishwasher, 'Посудомойка') }}
                {{ objectCheckBox(item.tv, 'Телевизор') }}
                {{ objectCheckBox(item.flatAlarm, 'Сигнализация') }}
                {{ objectCheckBox(item.withChildren, 'Можно с детьми') }}
                {{ objectCheckBox(item.withPets, 'Можно с животными') }}
              {% endif %}
            </ul>
          </div>

        {% elseif item.objectType == c.RZ_OBJECT_TYPE_HOUSE %}

          <div class="col-md-6">
            <ul class="value-params">
              {% if item.lotArea %}
                <li>
                  <span>Площадь участа:</span>
                  <span>
                  {{ item.lotArea }}
                    {% if item.lotAreaUnit == c.RZ_LOT_AREA_UNIT_AR %}
                      соток
                    {% elseif item.lotAreaUnit == c.RZ_LOT_AREA_UNIT_GA %}
                      гектар
                    {% endif %}
                </span>
                </li>
              {% endif %}

              {% if item.lotType %}
                <li>
                  <span>Тип участка:</span>
                  <span>
                  {% if item.lotType == c.RZ_LOT_TYPE_IGS %}
                    ИЖС
                  {% elseif item.lotType == c.RZ_LOT_TYPE_GARDEN %}
                    В садоводстве
                  {% elseif item.lotType == c.RZ_LOT_TYPE_FARM %}
                    Фермерский
                  {% endif %}
                </span>
                </li>
              {% endif %}

              {% if item.houseType %}
                <li>
                  <span>Тип Дома:</span>
                  <span>
                  {% if item.houseType == c.RZ_HOUSE_TYPE_HOUSE %}
                    Дом
                  {% elseif item.houseType == c.RZ_HOUSE_TYPE_COTTAGE %}
                    Коттедж
                  {% elseif item.houseType == c.RZ_HOUSE_TYPE_DACHA %}
                    Дача
                  {% elseif item.houseType == c.RZ_HOUSE_TYPE_TOWNHOUSE %}
                    Таунхаус
                  {% elseif item.houseType == c.RZ_HOUSE_TYPE_HALF_HOUSE %}
                    Часть дома
                  {% endif %}
                </span>
                </li>
              {% endif %}

              {{ objectParam(item.houseArea, 'Площадь дома') }}
              {{ objectParam(item.houseFloors, 'Количество этажей') }}

              {% if item.shower %}
                <li>
                  <span>Душ:</span>
                  <span>
                  {% if item.shower == c.RZ_SHOWER_TYPE_INSIDE %}
                    В доме
                  {% elseif item.shower == c.RZ_SHOWER_TYPE_OUTSIDE %}
                    На улице
                  {% elseif item.shower == c.RZ_SHOWER_TYPE_NONE %}
                    Отсутствует
                  {% endif %}
                </span>
                </li>
              {% endif %}

              {% if item.toilet %}
                <li>
                  <span>Туалет:</span>
                  <span>
                  {% if item.toilet == c.RZ_TOILET_TYPE_INSIDE %}
                    В доме
                  {% elseif item.toilet == c.RZ_TOILET_TYPE_OUTSIDE %}
                    На улице
                  {% elseif item.toilet == c.RZ_TOILET_TYPE_NONE %}
                    Отсутствует
                  {% endif %}
                </span>
                </li>
              {% endif %}
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="value-check">
              {{ objectCheckBox(item.pmg, 'Возможность ПМЖ') }}
              {{ objectCheckBox(item.heatingSupply, 'Отопление') }}
              {{ objectCheckBox(item.sewerageSupply, 'Канализация') }}
              {{ objectCheckBox(item.gasSupply, 'Газ') }}
              {{ objectCheckBox(item.sauna, 'Сауна') }}
              {{ objectCheckBox(item.kitchen, 'Наличие кухни') }}
              {{ objectCheckBox(item.waterSupply, 'Водопровод') }}
              {{ objectCheckBox(item.electricitySupply, 'Электроснабжение') }}
              {{ objectCheckBox(item.billiard, 'Бильярд') }}
              {{ objectCheckBox(item.pool, 'Бассейн') }}
            </ul>
          </div>

        {% elseif item.objectType == c.RZ_OBJECT_TYPE_LAND %}

          <div class="col-md-6">
            <ul class="value-params">
              {% if item.lotArea %}
                <li>
                  <span>Площадь участа:</span>
                  <span>
                  {{ item.lotArea }}
                    {% if item.lotAreaUnit == c.RZ_LOT_AREA_UNIT_AR %}
                      соток
                    {% elseif item.lotAreaUnit == c.RZ_LOT_AREA_UNIT_GA %}
                      гектар
                    {% endif %}
                </span>
                </li>
              {% endif %}

              {% if item.lotType %}
                <li>
                  <span>Тип участка:</span>
                  <span>
                  {% if item.lotType == c.RZ_LOT_TYPE_IGS %}
                    ИЖС
                  {% elseif item.lotType == c.RZ_LOT_TYPE_GARDEN %}
                    В садоводстве
                  {% elseif item.lotType == c.RZ_LOT_TYPE_FARM %}
                    Фермерский
                  {% endif %}
                </span>
                </li>
              {% endif %}
            </ul>
          </div>

        {% elseif item.objectType == c.RZ_OBJECT_TYPE_GARAGE %}

          <div class="col-md-6">
            <ul class="value-params">
              {% if item.garageType %}
                <li>
                  <span>Тип:</span>
                  <span>
                    {% if item.garageType == c.RZ_GARAGE_TYPE_PARKING_PLACE %}
                      Машиноместо
                    {% elseif item.garageType == c.RZ_GARAGE_TYPE_GARAGE %}
                      Гараж
                    {% elseif item.garageType == c.RZ_GARAGE_TYPE_BOX %}
                      Бокс
                    {% endif %}
                </span>
                </li>
                {% if item.garageType == c.RZ_GARAGE_TYPE_GARAGE %}
                  <li>
                    <span>Тип гаража:</span>
                    <span>
                      {% if item.garageGarageType == c.RZ_GARAGE_GARAGE_TYPE_BUILTIN %}
                        Встроенный
                      {% elseif item.garageGarageType == c.RZ_GARAGE_GARAGE_TYPE_CAPITAL %}
                        Капитальный
                      {% elseif item.garageGarageType == c.RZ_GARAGE_GARAGE_TYPE_SHELL %}
                        Ракушка
                      {% elseif item.garageGarageType == c.RZ_GARAGE_GARAGE_TYPE_SAMOSTROY %}
                        Самострой
                      {% endif %}
                    </span>
                  </li>
                {% endif %}
                {% if item.garageType == c.RZ_GARAGE_TYPE_BOX %}
                  <li>
                    <span>Тип бокса:</span>
                    <span>
                      {% if item.garageBoxType == c.RZ_GARAGE_BOX_TYPE_BRICK %}
                        Кирпичный
                      {% elseif item.garageBoxType == c.RZ_GARAGE_BOX_TYPE_METAL %}
                        Металличесикй
                      {% endif %}
                    </span>
                  </li>
                {% endif %}
              {% endif %}

              {{ objectParam(item.garageArea, 'Площадь') }}

              {% if item.garageStatus %}
                <li>
                  <span>Статус:</span>
                  <span>
                  {% if item.garageStatus == c.RZ_GARAGE_STATUS_TYPE_COOPERATIVE %}
                    Кооператив
                  {% elseif item.garageStatus == c.RZ_GARAGE_STATUS_TYPE_OWNERSHIP %}
                    Собственность
                  {% elseif item.garageStatus == c.RZ_GARAGE_STATUS_TYPE_BY_PROXY %}
                    По доверенности
                  {% endif %}
                  </span>
                </li>
              {% endif %}

              {{ objectParam(item.gsk, 'ГСК') }}

              {% if item.garageParking %}
                <li>
                  <span>Тип парковки:</span>
                  <span>
                  {% if item.garageParking == c.RZ_GARAGE_PARKING_TYPE_ROOF %}
                    На крыше
                  {% elseif item.garageParking == c.RZ_GARAGE_PARKING_TYPE_UNDERGROUND %}
                    Подземная
                  {% elseif item.garageParking == c.RZ_GARAGE_PARKING_TYPE_GROUND %}
                    Наземная
                  {% elseif item.garageParking == c.RZ_GARAGE_PARKING_TYPE_MULTILEVEL %}
                    Многоуровневая
                  {% elseif item.garageParking == c.RZ_GARAGE_PARKING_TYPE_OPEN %}
                    Открытая
                  {% endif %}
                  </span>
                </li>
              {% endif %}
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="value-check">
              {{ objectCheckBox(item.garageHasLight, 'Свет') }}
              {{ objectCheckBox(item.garageHasElectricity, 'Электричество') }}
              {{ objectCheckBox(item.garageHasWater, 'Вода') }}
              {{ objectCheckBox(item.garageHasHeating, 'Отопление') }}
              {{ objectCheckBox(item.garageHasExtinguishingSystem, 'Система пожаротушения') }}
            </ul>
          </div>

        {% elseif item.objectType == c.RZ_OBJECT_TYPE_COMMERCIAL %}

          <div class="col-md-6">
            <ul class="value-params">
              {% if item.commercialType %}
                <li>
                  <span>Назначение:</span>
                  <span>
                    {% if item.commercialType == c.RZ_COMMERCIAL_TYPE_OFFICE %}
                      Офисное помещение
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_RETAIL %}
                      Торговое помещение
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE %}
                      Помещение свободного назначения
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING %}
                      Общепит
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR %}
                      Автосервис
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_BUSINESS %}
                      Готовый бизнес
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_LEGAL_ADDRESS %}
                      Юридический адрес
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_LAND %}
                      Земельный участок
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_HOTEL %}
                      Гостиница
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_WAREHOUSE %}
                      Складское помещение
                    {% elseif item.commercialType == c.RZ_COMMERCIAL_TYPE_MANUFACTURING %}
                      Производственное помещение
                    {% endif %}
                  </span>
                </li>
              {% endif %}

              {% if item.commercialType !== c.RZ_COMMERCIAL_TYPE_LAND %}
                {% if item.commercialBuildingType %}
                  <li>
                    <span>Назначение:</span>
                    <span>
                    {% if item.commercialBuildingType == c.RZ_COMMERCIAL_BUILDING_TYPE_BUSINESS_CENTER %}
                      Бизнес-центр
                    {% elseif item.commercialBuildingType == c.RZ_COMMERCIAL_BUILDING_TYPE_WAREHOUSE %}
                      Складской комплекс
                    {% elseif item.commercialBuildingType == c.RZ_COMMERCIAL_BUILDING_TYPE_SHOPPING_CENTER %}
                      Торговый центр
                    {% elseif item.commercialBuildingType == c.RZ_COMMERCIAL_BUILDING_TYPE_DETACHED_BUILDING %}
                      Отдельно стоящее здание
                    {% elseif item.commercialBuildingType == c.RZ_COMMERCIAL_BUILDING_TYPE_RESIDENTIAL_BUILDING %}
                      Встроенное помещение, жилой дом
                    {% endif %}
                  </span>
                  </li>
                {% endif %}

                {% if item.commercialBuildingType == c.RZ_COMMERCIAL_BUILDING_TYPE_BUSINESS_CENTER %}
                  {% if item.officeClass %}
                    <li>
                      <span>Класс БЦ:</span>
                      <span>
                    {% if item.officeClass == c.RZ_COMMERCIAL_OFFICE_CLASS_A %}
                      A
                    {% elseif item.officeClass == c.RZ_COMMERCIAL_OFFICE_CLASS_A_PLUS %}
                      A+
                    {% elseif item.officeClass == c.RZ_COMMERCIAL_OFFICE_CLASS_B %}
                      B
                    {% elseif item.officeClass == c.RZ_COMMERCIAL_OFFICE_CLASS_B_PLUS %}
                      B+
                    {% elseif item.officeClass == c.RZ_COMMERCIAL_OFFICE_CLASS_C %}
                      C
                    {% elseif item.officeClass == c.RZ_COMMERCIAL_OFFICE_CLASS_C_PLUS %}
                      C+
                    {% endif %}
                  </span>
                    </li>
                  {% endif %}

                  {{ objectParam(item.buildingName, 'Название БЦ') }}
                {% endif %}

                {% if item.commercialType !== c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR
                or item.commercialType !== c.RZ_COMMERCIAL_TYPE_BUSINESS %}
                  {{ objectParam(item.floor, 'Этаж') }}
                  {{ objectParam(item.floorsTotal, 'Этажность') }}
                  {{ objectParam(item.commercialRoomsTotal, 'Комнат в помещении') }}
                {% endif %}

                {{ objectParam(item.commercialArea, 'Площадь') }}

                {% if item.entranceType %}
                  <li>
                    <span>Вход в помещение:</span>
                    <span>
                    {% if item.entranceType == c.RZ_COMMERCIAL_ENTRANCE_TYPE_SEPARATE %}
                      Отдельный
                    {% elseif item.entranceType == c.RZ_COMMERCIAL_ENTRANCE_TYPE_COMMON %}
                      Общий
                    {% endif %}
                  </span>
                  </li>
                {% endif %}

                {% if item.commercialType !== c.RZ_COMMERCIAL_TYPE_PUBLIC_CATERING
                or item.commercialType !== c.RZ_COMMERCIAL_TYPE_AUTO_REPAIR
                or item.commercialType !== c.RZ_COMMERCIAL_TYPE_BUSINESS
                or item.commercialType !== c.RZ_COMMERCIAL_TYPE_HOTEL %}
                  {% if item.renovation %}
                    <li>
                      <span>Ремонт:</span>
                      <span>
                    {% if item.renovation == c.RZ_RENOVATION_TYPE_DESIGNER %}
                      Дизайнерский
                    {% elseif item.renovation == c.RZ_RENOVATION_TYPE_EURO %}
                      Евро
                    {% elseif item.renovation == c.RZ_RENOVATION_TYPE_TRIM %}
                      С отделкой
                    {% elseif item.renovation == c.RZ_RENOVATION_TYPE_NEEDS %}
                      Требует ремонта
                    {% elseif item.renovation == c.RZ_RENOVATION_TYPE_GOOD %}
                      Хороший
                    {% elseif item.renovation == c.RZ_RENOVATION_TYPE_PARTIAL %}
                      Частичный
                    {% elseif item.renovation == c.RZ_RENOVATION_TYPE_ROUGH_FINISH %}
                      Черновая отделка
                    {% endif %}
                  </span>
                    </li>
                  {% endif %}
                {% endif %}

                {% if item.commercialType == c.RZ_COMMERCIAL_TYPE_RETAIL or
                item.commercialType == c.RZ_COMMERCIAL_TYPE_FREE_PURPOSE %}
                  {% if item.purposeBank or item.purposeFoodStore or item.purposeBeautyShop or
                  item.purposeTourAgency or item.purposeMedicalCenter or item.purposeShowRoom %}
                    <li>
                      <span>Возможное назначение:</span>
                      <span>
                    <ul>
                      {% if item.purposeBank %}
                        <li>Помещение для банка</li>
                      {% endif %}
                      {% if item.purposeFoodStore %}
                        <li>Продуктовый магазин</li>
                      {% endif %}
                      {% if item.purposeBeautyShop %}
                        <li>Салон красоты</li>
                      {% endif %}
                      {% if item.purposeTourAgency %}
                        <li>Турагенство</li>
                      {% endif %}
                      {% if item.purposeMedicalCenter %}
                        <li>Медицинский центр</li>
                      {% endif %}
                      {% if item.purposeShowRoom %}
                        <li>Шоу-рум</li>
                      {% endif %}
                    </ul>
                  </span>
                    </li>
                  {% endif %}
                {% endif %}

                {% if item.commercialType == c.RZ_COMMERCIAL_TYPE_WAREHOUSE %}
                  {% if item.purposeAlcohol or item.purposeStoreHouse or item.purposePharmaceutical %}
                    <li>
                      <span>Возможное назначение:</span>
                      <span>
                        <ul>
                          {% if item.purposeAlcohol %}
                            <li>Алкогольный склад</li>
                          {% endif %}
                          {% if item.purposeStoreHouse %}
                            <li>Овощехранилище</li>
                          {% endif %}
                          {% if item.purposePharmaceutical %}
                            <li>Фармацевтический склад</li>
                          {% endif %}
                        </ul>
                      </span>
                    </li>
                  {% endif %}
                {% endif %}
              {% endif %}

              {% if item.commercialType == c.RZ_COMMERCIAL_TYPE_LAND %}
                {% if item.commercialLotArea %}
                  <li>
                    <span>Площадь участа:</span>
                    <span>
                      {{ item.commercialLotArea }}
                      {% if item.lotAreaUnit == c.RZ_LOT_AREA_UNIT_AR %}
                        соток
                      {% elseif item.lotAreaUnit == c.RZ_LOT_AREA_UNIT_GA %}
                        гектар
                      {% endif %}
                </span>
                  </li>
                {% endif %}
              {% endif %}
            </ul>
          </div>
          <div class="col-md-6">
            {% if item.commercialType !== c.RZ_COMMERCIAL_TYPE_BUSINESS %}
              <ul class="value-check">
                {% if item.commercialType == c.RZ_COMMERCIAL_TYPE_OFFICE or
                item.commercialType == c.RZ_COMMERCIAL_TYPE_RETAIL %}
                  {{ objectCheckBox(item.internet, 'Интернет') }}
                {% endif %}

                {{ objectCheckBox(item.aircondition, 'Кондиционер') }}
                {{ objectCheckBox(item.ventilation, 'Вентиляция') }}
                {{ objectCheckBox(item.fireAlarm, 'Пожарная сигнализация') }}

                {% if item.commercialType == c.RZ_COMMERCIAL_TYPE_OFFICE %}
                  {{ objectCheckBox(item.twentyFourSeven, 'Доступ на объект 24/7') }}
                  {{ objectCheckBox(item.accessControlSystem, 'Пропускная система') }}
                  {{ objectCheckBox(item.parking, 'Охраняемая парковка') }}
                  {{ objectCheckBox(item.eatingFacilities, 'Заведение питания в здании') }}
                  {{ objectCheckBox(item.selfSelectionTelecom, 'Можно выбрать оператора интернета') }}
                  {{ objectCheckBox(item.addingPhoneOnRequest, 'Можно добавить телефонные линии') }}
                {% endif %}

                {% if item.commercialType == c.RZ_COMMERCIAL_TYPE_WAREHOUSE
                or item.commercialType == c.RZ_COMMERCIAL_TYPE_MANUFACTURING %}
                  {% if item.commercialType == c.RZ_COMMERCIAL_TYPE_WAREHOUSE %}
                    {{ objectCheckBox(item.officeWarehouse, 'Наличие офиса на складе') }}
                    {{ objectCheckBox(item.responsibleStorage, 'Ответственное хранение') }}
                    {{ objectCheckBox(item.serviceThreePl, 'Наличие 3PL услуг') }}
                  {% endif %}

                  {{ objectCheckBox(item.freightElevator, 'Грузовой лифт') }}
                  {{ objectCheckBox(item.truckEntrance, 'Возможность подъезда фуры') }}
                  {{ objectCheckBox(item.ramp, 'Наличие пандуса') }}
                  {{ objectCheckBox(item.railway, 'Наличие ветки железной дороги') }}
                {% endif %}
              </ul>
            {% endif %}
          </div>

        {% endif %}

      </div>
    </div>

  </div>

{% endmacro %}