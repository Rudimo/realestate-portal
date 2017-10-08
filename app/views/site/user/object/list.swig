{% extends '../layout.swig' %}

{% block userContent %}

  {% include '../../partials/object/object-post.swig' %}

  <div class="col-lg-9 col-md-9 col-sm-8 margin-bottom-80 ng-cloak">

  {% if items.length > 0 %}

    <div class="info-views-post text-right">{{ pagination_summary() }}</div>

    <div class="page-vda-list user-objects-list">

      {% for object in items %}
        {% set viewActionUrl = baseUrl + '/' + object.id %}

        {% set editActionUrl = baseUrl + '/' + object.id + '/edit' %}
        {% set publishActionUrl = baseUrl + '/' + object.id + '/publish' %}
        {% set deleteActionUrl = baseUrl + '/' + object.id + '/delete' %}

        {{ userObjectPost(object, {viewActionUrl: viewActionUrl, editActionUrl: editActionUrl, publishActionUrl: publishActionUrl, deleteActionUrl: deleteActionUrl, showStatus: true}) }}

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
        <h4>На данный момент у Вас нет ни одного объявления</h4>
        <hr>
        <a href="/user/objects/create" class="btn btn-success">Добавить объявление</a>
        <br><br><br><br><br><br><br><br><br><br><br><br>
      </div>
    </div>

  {% endif %}

  </div>

{% endblock %}