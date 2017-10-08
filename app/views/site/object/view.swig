{% extends '../layout2.swig' %}

{% block content %}

  {% include '../partials/object/object-param.swig' %}
  {% include '../partials/object/object-statistic.swig' %}

  <div class="col-md-12">
    <div class="breadcrumbs">
      {{ breadcrumbs() }}
    </div>
  </div>

  <div class="col-md-12 object-item">

    <div class="row">
      <div class="col-md-12">
        <div class="object_header">
          <h1>{{ item.title }}</h1>
        </div>
        <div class="address">
          <i class="fa fa-map-marker" aria-hidden="true"></i>
          <span>Адрес: {{ item.geoAddress }}</span>
          {% if item.geoMetro and item.geoDistance %}
            <span>(менее {{ (item.geoDistance / 1000).toFixed(1) }} км до метро {{ item.geoMetro }})</span>
          {% elseif item.geoCityRaion %}
            <span>({{ item.geoCityRaion }})</span>
          {% endif %}
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">

        <div class="ug-gallery" id="ug-gallery">
          {% for image in item.images %}
            <img alt="{{ image.title | default(item.title) }}" src="{{ image.thumbnailMiniCdnUrl }}"
                 data-image="{{ image.cdnUrl }}"
                 data-description="{{ image.title }}">
          {% endfor %}
        </div>

      </div>
      <div class="col-md-4">
        <div class="user-block">
          <div class="contacts">
            {% if item.user.image %}
              <div class="thumbnail text-center">
                <img alt="User image" src="{{ item.user.image.cdnUrl }}">
              </div>
            {% endif %}
            {% if item.user.isAgent %}
              <p>Риэлтор</p>
            {% else %}
              <p>Частное лицо:</p>
            {% endif %}
            <span class="user-name">{{ item.user.firstName }} {{ item.user.lastName }}</span>
            <div class="phone">
              <button class="btn btn-3d btn-green">
                <i class="fa fa-phone-square"></i>
                {#Показать номер#}{{ item.user.phone | phone }}
              </button>
              <p>Сообщите, что нашли это объявление на&nbsp;портале Realza.ru</p>
            </div>
            <div class="report-object">
              <div class="btn-group">
                <button type="button" class="btn btn-xs btn-amber dropdown-toggle" data-toggle="dropdown">
                  <i class="fa fa-bullhorn"></i>
                  Пожаловаться
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu">
                  <li><a href="#">Не дозвониться</a></li>
                  <li><a href="#">Не частное лицо</a></li>
                  <li><a href="#">Неактуальное объявление</a></li>
                  <li><a href="#">Неверная цена</a></li>
                  <li><a href="#">Неверное описание</a></li>
                  <li><a href="#">Неверные фотографии</a></li>
                  <li><a href="#">Неверный адрес</a></li>
                  <li><a href="#">Объекта не существует</a></li>
                </ul>
              </div>
            </div>
            <div class="price">
              <span>Цена: {{ item.price | price }} <i class="fa fa-rub" aria-hidden="true"></i></span>
            </div>
            <div class="price-param-labels">
              {{ objectPriceParamLabel() }}
            </div>
            {{ objectStatistic(item) }}
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!--Центральный блок-->
      <div class="col-md-8">

        {{ objectParamView() }}

        {#<pre>{{ meta | json(2) }}</pre>#}

      </div>

      <!--Правый блок-->
      <div class="col-md-4">

          <h4>Объект на карте</h4>
          <div class="map">
            <div id="ya-map" style="width: 100%; height: 300px"></div>
            <script>
              function renderObjectMap(ymaps) {
                var myMap       = new ymaps.Map('ya-map', {
                  center: [{{ item.geoLatitude }}, {{ item.geoLongitude }}],
                  zoom: 15
                }, {
                  searchControlProvider: 'yandex#search'
                }),
                  myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                  hintContent: 'Объект на карте',
                  balloonContent: '{{ item.geoAddress }}'
                }, {
                  iconLayout: 'islands#icon',
                  iconColor: '#0095b6'
                });

                myMap.geoObjects.add(myPlacemark);
              }
            </script>
            <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&onload=renderObjectMap" defer></script>
          </div>

        {#<pre>{{ item || json(2) }}</pre>#}
      </div>
    </div>
    {#<pre>{{ meta.jsonLd | json(2) }}</pre>#}

  </div>

{% endblock %}