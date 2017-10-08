{% extends '../layout.swig' %}

{% block indexContent %}

  {% set baseUrlForSearch = '/' %}

  {% if breadcrumbsData.raion %}
    {% set baseUrlForSearch = '/' + breadcrumbsData.raion.nameUrl + '/' %}
  {% endif %}

  <section class="fullheight realestate-head">
    <div class="container">
      <h1 class="title">{{ seoData.title }}</h1>
    </div>
  </section>

  <section class="padding-xs realestate">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="breadcrumbs">
            {{ breadcrumbs() }}
          </div>
        </div>
        <div class="col-md-3">
          {% if not breadcrumbsData.region.isCityCenter and not breadcrumbsData.raion %}
            <div class="clarify-raion">
              <i class="fa fa-map-marker"></i>
              {{ anchor({
                subDomain: 'auto',
                path: '/raions',
                text: 'Уточнить район',
                title: 'Уточнить район' }) }}
            </div>
          {% endif %}

          {% include '../partials/objects-search-form.swig' %}
          {{ objectsSearchForm() }}

        </div>
        <div class="col-md-9">
          <div class="row">
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_SALE %}
              <div class="col-md-6">
                <div class="sky-form boxed">
                  <header class="size-18 margin-bottom-20">
                    <h4>Купить квартиру</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'однокомнатные',
                        title: 'Однокомнатные квартиры в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kvartira/odnokomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>
                      {{ categoryAnchor({
                        text: 'двухкомнатные',
                        title: 'Двухкомнатные квартиры в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kvartira/dvuhkomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'трехкомнатные',
                        title: 'Продажа трехкомнатных квартир в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kvartira/trekhkomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'четырехкомнатные',
                        title: 'Продажа четырехкомнатных квартир в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kvartira/chetyrekhkomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'пятикомнатные и более',
                        title: 'Продажа Пятикомнатных квартир в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kvartira/pyatikomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'студии',
                        title: 'Продажа студий в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kvartira/studiya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'со свободной планировкой',
                        title: 'Продажа квартир со свободной планировкой в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kvartira/svobodnaya-planirovka',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_RENT %}
              <div class="col-md-6">
                <div class="sky-form boxed">
                  <header class="size-18 margin-bottom-20">
                    <h4>Снять квартиру</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'однокомнатные',
                        title: 'Однокомнатные квартиры в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kvartira/odnokomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_1_ROOM_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>
                      {{ categoryAnchor({
                        text: 'двухкомнатные',
                        title: 'Двухкомнатные квартиры в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kvartira/dvuhkomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_2_ROOM_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'трехкомнатные',
                        title: 'Продажа трехкомнатных квартир в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kvartira/trekhkomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_3_ROOM_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'четырехкомнатные',
                        title: 'Продажа четырехкомнатных квартир в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kvartira/chetyrekhkomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_4_ROOM_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'пятикомнатные и более',
                        title: 'Продажа Пятикомнатных квартир в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kvartira/pyatikomnatnaya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_5_ROOM_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'студии',
                        title: 'Продажа студий в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kvartira/studiya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_STUDIO_ROOM_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'со свободной планировкой',
                        title: 'Продажа квартир со свободной планировкой в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kvartira/svobodnaya-planirovka',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_FLAT_OPEN_ROOM_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
          </div>

          <div class="row">
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_SALE %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Купить дом</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'дома',
                        title: 'Дома в ' + breadcrumbsData.region.name3,
                        path: 'kupit/dom/dom',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'коттеджи',
                        title: 'Коттеджи в ' + breadcrumbsData.region.name3,
                        path: 'kupit/dom/kottedzh',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'дачи',
                        title: 'Дачи в ' + breadcrumbsData.region.name3,
                        path: 'kupit/dom/dacha',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'таунхаусы',
                        title: 'Таунхаусы в ' + breadcrumbsData.region.name3,
                        path: 'kupit/dom/taunhaus',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'части домов',
                        title: 'Части домов в ' + breadcrumbsData.region.name3,
                        path: 'kupit/dom/chasti-doma',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_RENT %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Снять дом</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'дома',
                        title: 'Дома в ' + breadcrumbsData.region.name3,
                        path: 'snyat/dom/dom',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'коттеджи',
                        title: 'Коттеджи в ' + breadcrumbsData.region.name3,
                        path: 'snyat/dom/kottedzh',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_COTTAGE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'дачи',
                        title: 'Дачи в ' + breadcrumbsData.region.name3,
                        path: 'snyat/dom/dacha',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_DACHA_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'таунхаусы',
                        title: 'Таунхаусы в ' + breadcrumbsData.region.name3,
                        path: 'snyat/dom/taunhaus',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_TOWNHOUSE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'части домов',
                        title: 'Части домов в ' + breadcrumbsData.region.name3,
                        path: 'snyat/dom/chasti-doma',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_HOUSE_HALF_HOUSE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
          </div>

          <div class="row">
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_SALE %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Купить комнату</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'все комнаты',
                        title: 'Купить комнаты в ' + breadcrumbsData.region.name3,
                        path: 'kupit/komnata',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_ROOM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_RENT %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Снять комнату</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'все комнаты',
                        title: 'Снять комнаты в ' + breadcrumbsData.region.name3,
                        path: 'snyat/komnata',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_ROOM_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
          </div>

          <div class="row">
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_SALE %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Купить коммерческую недвижимость</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'офисы',
                        title: 'Офисы в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/ofis',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'торговые пемещения',
                        title: 'Торговые пемещения в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/torgovoe-pomeshenie',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'помещения свободного назначения',
                        title: 'Помещения свободного назначения в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/pomeshenie-svobodnogo-naznacheniya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'общепиты',
                        title: 'Общепиты в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/obshepit',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'автосервисы',
                        title: 'Автосервисы в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/avtoservis',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'готовые бизнесы',
                        title: 'Готовые бизнесы в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/gotovyi-biznes',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'земельные участки',
                        title: 'Земельные участки в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/zemelnyi-uchastok',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'гостиницы',
                        title: 'Гостиницы в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/gostinica',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'складские помещения',
                        title: 'Складские помещения в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/sklad',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'производственные помещения',
                        title: 'Производственные помещения в ' + breadcrumbsData.region.name3,
                        path: 'kupit/kommercheskaya-nedvizhimost/proizvodstvennoe-pomeshenie',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_RENT %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Аренда коммерческой недвижимости</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'офисы',
                        title: 'Офисы в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/ofis',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_OFFICE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'торговые пемещения',
                        title: 'Торговые пемещения в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/torgovoe-pomeshenie',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_RETAIL_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'помещения свободного назначения',
                        title: 'Помещения свободного назначения в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/pomeshenie-svobodnogo-naznacheniya',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_FREE_PURPOSE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'общепиты',
                        title: 'Общепиты в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/obshepit',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_PUBLIC_CATERING_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'автосервисы',
                        title: 'Автосервисы в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/avtoservis',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_AUTO_REPAIR_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'готовые бизнесы',
                        title: 'Готовые бизнесы в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/gotovyi-biznes',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_BUSINESS_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'юридические адреса',
                        title: 'Юридические адреса в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/yuridicheskiy-adres',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LEGAL_ADDRESS_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'земельные участки',
                        title: 'Земельные участки в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/zemelnyi-uchastok',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_LAND_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'гостиницы',
                        title: 'Гостиницы в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/gostinica',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_HOTEL_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'складские помещения',
                        title: 'Складские помещения в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/sklad',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_WAREHOUSE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'производственные помещения',
                        title: 'Производственные помещения в ' + breadcrumbsData.region.name3,
                        path: 'snyat/kommercheskaya-nedvizhimost/proizvodstvennoe-pomeshenie',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_COMMERCIAL_MANUFACTURING_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
          </div>

          <div class="row">
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_SALE %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Купить гараж
                      {#{{ anchor({#}
                        {#text: 'Купить гараж',#}
                        {#title: 'Купить гаражи в ' + breadcrumbsData.region.name3,#}
                        {#path: '/kupit/garazh',#}
                        {#baseUrl: baseUrlForSearch,#}
                        {#showCounter: true#}
                      {#}) }}#}
                    </h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'гаражи',
                        title: 'Купить гаражи в ' + breadcrumbsData.region.name3,
                        path: 'kupit/garazh/garazh',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'машиноместо',
                        title: 'Купить машиноместо в ' + breadcrumbsData.region.name3,
                        path: 'kupit/garazh/mashinomesto',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'боксы',
                        title: 'Купить боксы в ' + breadcrumbsData.region.name3,
                        path: 'kupit/garazh/boks',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_RENT %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Снять гараж</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'гаражи',
                        title: 'Снять гаражи в ' + breadcrumbsData.region.name3,
                        path: 'snyat/garazh/garazh',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'машиноместо',
                        title: 'Снять машиноместо в ' + breadcrumbsData.region.name3,
                        path: 'snyat/garazh/mashinomesto',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_PARKING_PLACE_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'боксы',
                        title: 'Снять боксы в ' + breadcrumbsData.region.name3,
                        path: 'snyat/garazh/boks',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_GARAGE_BOX_RENT,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
          </div>

          <div class="row">
            {% if not breadcrumbsData.offerType or breadcrumbsData.offerType.number === c.RZ_OFFER_TYPE_SALE %}
              <div class="col-md-6">
                <div class="sky-form boxed margin-top-10">
                  <header class="size-18 margin-bottom-20">
                    <h4>Купить участок</h4>
                  </header>
                  <ul class="property-list">
                    <li>{{ categoryAnchor({
                        text: 'под индивидуальное строительство',
                        title: 'Земли под индивидуальное строительство в ' + breadcrumbsData.region.name3,
                        path: 'kupit/uchastok/individualnoe-stroitelstvo',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_IGS_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'в садоводстве',
                        title: 'Земли в садоводстве в ' + breadcrumbsData.region.name3,
                        path: 'kupit/uchastok/v-sadovodstve',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_GARDEN_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                    <li>{{ categoryAnchor({
                        text: 'фермерские',
                        title: 'Земли фермерские в ' + breadcrumbsData.region.name3,
                        path: 'kupit/uchastok/fermerskiy',
                        megaCompoundType: c.RZ_MEGA_CMP_OBJECT_TYPE_LOT_FARM_SALE,
                        baseUrl: baseUrlForSearch,
                        showCounter: true
                      }) }}</li>
                  </ul>
                </div>
              </div>
            {% endif %}
          </div>
          {#<pre>{{ counts | json(2) }}</pre>#}
          {#<pre>{{ breadcrumbsData | json(2) }}</pre>#}
          {#<pre>{{ meta | json(2) }}</pre>#}
          {#<pre>{{ seoData | json(2) }}</pre>#}
        </div>
      </div>
    </div>
  </section>

{% endblock %}