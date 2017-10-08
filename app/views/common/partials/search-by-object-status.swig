{% macro searchByObjectStatus() %}

  {% set filterName = 'inFieldStatus' %}

  {#<div class="form-group">

    <select class="form-control select2" data-filter="{{ filterName }}" multiple style="width:100%"
            data-placeholder="Фильтровать по статусу">

      {% set statuses = [
      {value: c.OBJECT_STATUS_OPEN, name: 'Открыто'},
      {value: c.OBJECT_STATUS_CLOSED, name: 'Закрыто'}
      ] %}

      {% set filterData = filters.inField | find({filterName: filterName}) %}

      {% for status in statuses %}
        <option value="{{ status.value }}"
                {% if filterData and filterData.fieldValue.indexOf(status.value.toString()) > -1 %}selected{% endif %}>
          {{ status.name }}
        </option>
      {% endfor %}
    </select>
  </div>#}

  {#<pre>{{ filters | json(2) }}</pre>#}
  {#<pre>{{ filterData | json(2) }}</pre>#}
{% endmacro %}