{% macro breadcrumbs() %}

  {% if meta.breadcrumbs.length > 0 %}

    <ul class="custom-breadcrumb">

      {% for breadcrumbItem in meta.breadcrumbs %}
        <li>
          {{ anchor({
            href: breadcrumbItem.url,
            text: breadcrumbItem.text,
            title: breadcrumbItem.title }) }}
        </li>
      {% endfor %}

    </ul>

  {% endif %}

{% endmacro %}