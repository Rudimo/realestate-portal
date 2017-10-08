{% macro searchByPublishStatus() %}

  {% set filterName = 'inFieldPublishStatus' %}

  <div class="form-group">

    <select class="form-control select2" data-filter="{{ filterName }}" multiple style="width:100%"
            data-placeholder="Фильтровать по статусу публикации">

      {% set statuses = [
      {value: c.OBJECT_PUBLISH_STATUS_NOT_PUBLISHED, name: 'Не опубликовано'},
      {value: c.OBJECT_PUBLISH_STATUS_MODERATION_PENDING, name: 'Ожидает модерации'},
      {value: c.OBJECT_PUBLISH_STATUS_REJECTED, name: 'Отклонено'},
      {value: c.OBJECT_PUBLISH_STATUS_PUBLISHED, name: 'Опубликовано'}
      ] %}

      {% set filterData = filters.inField | find({filterName: filterName}) %}

      {% for status in statuses %}
        <option value="{{ status.value }}"
                {% if filterData and filterData.fieldValue.indexOf(status.value.toString()) > -1 %}selected{% endif %}>
          {{ status.name }}
        </option>
      {% endfor %}
    </select>
  </div>

  {#<pre>{{ filters | json(2) }}</pre>#}
  {#<pre>{{ filterData | json(2) }}</pre>#}
{% endmacro %}