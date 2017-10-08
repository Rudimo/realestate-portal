{% extends '../layout.swig' %}

{% block userContent %}

  {% include '../../partials/object/object-param.swig' %}

  <div class="col-lg-9 col-md-9 col-sm-8 margin-bottom-80 ng-cloak">

    <div class="row">
      <div class="col-md-12">
        <div class="object_header">
          <h4>{{ item.title }}</h4>
          <span class="fa fa-map-marker" aria-hidden="true"></span>
          Адрес: {{ item.geoAddress }}
          <hr>
          {% if item.status !== c.OBJECT_STATUS_PUBLISHED %}
            <a href="/user/objects/{{ item.id }}/edit">Редактировать</a>
            <hr>
          {% endif %}
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-9">

        {{ objectParamView() }}

        <div class="ug-gallery" id="ug-gallery">
          {% for image in item.images %}
            <img alt="{{ image.title | default(item.title) }}" src="{{ image.thumbnailMiniCdnUrl }}"
                 data-image="{{ image.cdnUrl }}"
                 data-description="{{ image.title }}">
          {% endfor %}
        </div>

      </div>

      <div class="col-md-3">

      </div>
    </div>

  </div>

{% endblock %}