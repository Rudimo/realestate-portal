{% extends '../layout.swig' %}

{% block title %}Объявления{% endblock %}

{% block pageheader %}
  {{ pageheader({title: 'Объявления'}) }}
{% endblock %}

{% block pagecontent %}

  <div class="row">
    <div class="col-sm-3 col-md-3">
      <p>
        <a href="{{ baseUrl }}/reindex" class="btn btn-default btn-block">Reindex items</a>
      </p>
      <p>
        <a href="{{ baseUrl }}/recreateIndex" class="btn btn-danger btn-block">Recreate ES index</a>
      </p>
      <p>
        <a href="{{ baseUrl }}/resave-all" class="btn btn-primary btn-block">Resave All</a>
      </p>
      <div class="search-filters">
        {{ search() }}

        <br>
        {% include '../../common/partials/search-by-object-status.swig' %}
        {{ searchByObjectStatus() }}

        {% include '../../common/partials/search-by-publish-status.swig' %}
        {{ searchByPublishStatus() }}

        {{ search_buttons() }}
      </div>
      <br/>

    </div>

    <div class="col-sm-9 col-md-9">
      <div class="msg-header">
        <div class="pull-right">
          <h5 class="sm-title text-right">{{ pagination_summary() }}</h5>
          {{ pagination_pages() }}
        </div>

        {{ bulk_actions({check: true, bulkEdit: true, bulkDelete: true}) }}

      </div>

      <div class="list-group media-list msg-list">
        <div class="list-group-item list-group-sorting">
          <div class="">
            Sort by:
            {{ sorting_column({title: 'Создано', field: 'createdAt'}) }}
            {#{{ sorting_column({title: 'Обновлено', field: 'updatedAt'}) }}#}
            {{ sorting_column({title: 'Заголовок', field: 'title'}) }}
            {{ sorting_column({title: 'Rating', field: 'rating'}) }}
            {{ sorting_column({title: 'Price', field: 'price'}) }}
          </div>
        </div>

        {% for item in items %}
          {% set editActionUrl = baseUrl + '/' + item.id + '/edit' %}
          {% set viewActionUrl = baseUrl + '/' + item.id %}
          {% set deleteActionUrl = baseUrl + '/' + item.id + '/delete' %}

          <div class="list-group-item">

            {{ item_select_checkbox() }}

            <div class="list-group-item-body">
              <div class="pull-right media-option clearfix">

                <div class="text-right">

                  {% if item.status === c.OBJECT_STATUS_DRAFT %}
                    <span class="label label-default">Черновик</span>
                  {% elseif item.status === c.OBJECT_STATUS_MODERATION_PENDING %}
                    <span class="label label-primary">Ожидает модерацию</span>
                  {% elseif item.status === c.OBJECT_STATUS_REJECTED %}
                    <span class="label label-danger">Отклонено модератором</span>
                  {% elseif item.status === c.OBJECT_STATUS_PUBLISHED %}
                    <span class="label label-success">Опубликовано</span>
                  {% elseif item.status === c.OBJECT_STATUS_ARCHIVED %}
                    <span class="label label-warning">В архиве</span>
                  {% endif %}

                  <div class="label label-default">{{ item.price | price }}</div>

                  {#{% for gvsco in item.GVSCompaniesRef %}#}
                  {#<div class="label label-info">{{ gvsco.coname }}</div>#}
                  {#{% endfor %}#}

                  {#{% for store in item.storesRef %}#}
                  {#<div class="label label-default">{{ store.pracName }}</div>#}
                  {#{% endfor %}#}

                  {{ item_inlist_notifications() }}

                  {{ resource_action_buttons({viewActionUrl: viewActionUrl, editActionUrl: editActionUrl, deleteActionUrl: deleteActionUrl}) }}
                </div>

                <p class="help-block">
                  {# TODO #}
                  <small>Последнее
                    обновление: {{ moment(item.lastUpdate).utcOffset(geoInfo.utcOffset).calendar() }}</small>
                </p>

              </div>

              <a href="{{ viewActionUrl }}">
                <h4 class="sender">
                  {{ item.title }}
                </h4>
              </a>

              <p>
                id: {{ item.id }} /
                rating: {{ item.rating }} /
                <a href="/users/{{ item.user.slug | default(item.user.id) }}" target="_blank">
                  {{ item.user.fullName }}
                </a>
              </p>

              <div class="row">
                <div class="col-sm-12">
                  {% if item.status === c.OBJECT_STATUS_MODERATION_PENDING %}
                    <a class="btn btn-primary btn-xs" href="/admin/objects/{{ item.id }}/moderate" target="_blank">
                      Проверить
                    </a>
                    <a class="btn btn-success btn-xs" href="/admin/objects/{{ item.id }}/approve" target="_blank">
                      Принять
                    </a>
                  {% else %}
                    <a class="btn btn-default btn-xs" href="/admin/objects/{{ item.id }}/ban"
                       target="_blank">
                      <i class="fa fa-ban" aria-hidden="true"></i>
                      Бан
                    </a>
                    {% if item.status === c.OBJECT_STATUS_PUBLISHED %}
                      <a class="btn btn-success btn-xs" href="/admin/objects/{{ item.id }}/tweet"
                         target="_blank">
                        <i class="fa fa-twitter" aria-hidden="true"></i>
                        Твит
                      </a>
                      <a class="btn btn-success btn-xs" href="/admin/objects/{{ item.id }}/generate-video"
                         target="_blank">
                        <i class="fa fa-youtube-play" aria-hidden="true"></i>
                        Создать видео
                      </a>
                    {% endif %}
                  {% endif %}
                </div>
              </div>

            </div>
          </div>
        {% endfor %}

      </div>

      <div class="list-group-footer">
        <div class="pull-right">
          {{ pagination_rows() }}
        </div>
        <div class="pull-left">
          {{ pagination_pages() }}
        </div>
      </div>

    </div>
  </div>

{% endblock %}