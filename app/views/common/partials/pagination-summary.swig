{% macro pagination_summary() %}
    {% if pagination  %}
    {{ pagination.counterString }}
    {% endif %}
{% endmacro %}