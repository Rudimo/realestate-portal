{% macro sorting_column(options) %}
    {% if sorting.field == options.field  %}
    <th class="sorting_{{ sorting.order }}" {% if options.width %}width="{{options.width}}"{% endif %}>
        <a href="{{ sorting.basePath }}?filter[sortingField]={{ options.field }}&filter[sortingOrder]={% if sorting.order == 'asc' %}desc{% else %}asc{% endif %}">{{ options.title }}</a>
    </th>
    {% else %}
    <th class="sorting" {% if options.width %}width="{{options.width}}"{% endif %}>
        <a href="{{ sorting.basePath }}?filter[sortingField]={{ options.field }}&filter[sortingOrder]=asc">{{ options.title }}</a>
    </th>
    {% endif %}
{% endmacro %}
