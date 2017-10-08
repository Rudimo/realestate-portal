{% macro pagination_rows() %}
  {% if pagination %}
    <select class="form-control listFilter" data-field="pageSize" data-base-path="{{ pagination.basePath }}">
      <option value="10" {% if pagination.pageSize == 10 %}selected{% endif %}>10 строк</option>
      <option value="25" {% if pagination.pageSize == 25 %}selected{% endif %}>25 строк</option>
      <option value="50" {% if pagination.pageSize == 50 %}selected{% endif %}>50 строк</option>
      <option value="100" {% if pagination.pageSize == 100 %}selected{% endif %}>100 строк</option>
    </select>
  {% endif %}
{% endmacro %}
