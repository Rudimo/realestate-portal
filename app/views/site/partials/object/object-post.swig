{% macro objectPost(object, options) %}

  {% set objectUrl = currentUrl + '/' + object.slug %}

  <div class="object-item-list col-md-12">
    <div class="col-md-4">
      <a href="{{ object.url }}" class="property-featured-image">
        {% if object.images.length > 0 %}
          <img src="{{ object.images[0].thumbnailCdnUrl }}"
               alt="{{ object.images[0].title | default(object.title) }}"/>
        {% else %}
          <img src="/images/no-image.png" alt="Изображение этого объекта отсутствует"/>
        {% endif %}
      </a>
    </div>
    <div class="col-md-8">
      <div class="property-info">
        <div class="price">
          <strong>₽</strong>
          <span class="">{{ object.price | price }}</span>
        </div>

        <h3>
          <a href="{{ object.url }}">{{ object.title }}</a>
        </h3>
        <span class="location"><i class="fa fa-map-marker"></i>
          {{ object.geoAddress }}
        </span><br>
        <p>{{ object.description | limit(130) }}</p>
      </div>
      {#<div class="property-amenities clearfix">
        <span class="area"><strong>1240</strong>Area</span>
        <span class="baths"><strong>3</strong>Baths</span>
        <span class="beds"><strong>3</strong>Beds</span>
        <span class="parking"><strong>2</strong>Parking</span>
      </div>#}
    </div>
  </div>
{% endmacro %}

{% macro userObjectPost(object, options) %}

  <div class="object-item-list col-md-12">
    <div class="col-md-4">
      <a href="{{ options.viewActionUrl }}" class="property-featured-image">
        {% if object.images.length > 0 %}
          <img src="{{ object.images[0].thumbnailCdnUrl }}"
               alt="{{ object.images[0].title | default(object.title) }}"/>
        {% else %}
          <img src="/images/no-image.png" alt="Изображение этого объекта отсутствует"/>
        {% endif %}
      </a>
    </div>
    <div class="col-md-8">
      <div class="property-info">
        <div class="price">
          <strong>₽</strong>
          <span class="">{{ object.price | price }}</span>
        </div>
        {% if object.status === c.OBJECT_STATUS_DRAFT %}
          <span class="label label-default">Черновик</span>
        {% elseif object.status === c.OBJECT_STATUS_MODERATION_PENDING %}
          <span class="label label-primary">Ожидает модерацию</span>
        {% elseif object.status === c.OBJECT_STATUS_REJECTED %}
          <span class="label label-danger">Отклонено модератором</span>
        {% elseif object.status === c.OBJECT_STATUS_PUBLISHED %}
          <span class="label label-success">Опубликовано</span>
        {% elseif object.status === c.OBJECT_STATUS_ARCHIVED %}
          <span class="label label-warning">В архиве</span>
        {% endif %}

        {% if object.status !== c.OBJECT_STATUS_PUBLISHED %}
          {% if options.editActionUrl or options.publishActionUrl or options.deleteActionUrl %}
            <div class="controls-objects" style="display: inline">

              {% if options.editActionUrl %}
                <a class="btn" title="Редактировать" href="{{ options.editActionUrl }}">
                  <span class="fa fa-edit"></span>
                </a>
              {% endif %}

              {% if options.deleteActionUrl %}
                <a class="btn" style="padding: 6px" href="javascript:void(0)" title="Удалить"
                   onclick="if (confirm('Вы уверены что хотите удалить объявление навсегда?')) {document.location.href='{{ deleteActionUrl }}'}">
                  <span class="fa fa-times" style="color: #ff0a13"></span>
                </a>
              {% endif %}

            </div>
          {% endif %}
        {% endif %}
        <h3>
          <a href="{{ options.viewActionUrl }}">{{ object.title }}</a>
        </h3>
        <span class="location"><i class="fa fa-map-marker"></i>
          {{ object.geoAddress }}
        </span><br>
        <p>{{ object.description | limit(130) }}</p>
      </div>
      {#<div class="property-amenities clearfix">
        <span class="area"><strong>1240</strong>Area</span>
        <span class="baths"><strong>3</strong>Baths</span>
        <span class="beds"><strong>3</strong>Beds</span>
        <span class="parking"><strong>2</strong>Parking</span>
      </div>#}
    </div>
  </div>
{% endmacro %}