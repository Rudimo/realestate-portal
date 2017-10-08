{% extends '../layout.swig' %}

{% block indexContent %}

  {% include '../partials/object/object-post.swig' %}

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

        <div class="col-lg-9 col-md-9 col-sm-8 margin-bottom-80 ng-cloak">

          {% if items.length > 0 %}

            <div class="info-views-post text-right">{{ pagination_summary() }}</div>

            <div class="page-vda-list user-objects-list">

              {% for object in items %}

                {{ objectPost(object) }}

              {% endfor %}

              <div class="row">
                <div class="col-xs-12 col-md-9 col-md-offset-2">
                  <div class="pull-right">
                    {{ pagination_pages() }}
                  </div>
                </div>
              </div>
            </div>

          {% else %}

            <div class="row">
              <div class="col-md-10 col-md-offset-1 text-center">
                <br><br><br><br>
                <h4>Объявлений по заданным критериям поиска не найдено</h4>
              </div>
            </div>

          {% endif %}

          {#<pre>{{ items || json(2) }}</pre>#}
          {#<pre>{{ meta | json(2) }}</pre>#}

        </div>
      </div>
    </div>
  </section>

{% endblock %}