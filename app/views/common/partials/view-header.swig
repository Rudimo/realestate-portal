{% macro header(params) %}

  <header class="page-header">
    <h2>{{ params.title }}</h2>

    <div class="pull-right">
      <ol class="breadcrumbs">
        <li>
          {% if params.showCloseButton %}
            <a href="{{ cancelActionUrl }}">Закрыть <i class="fa fa-close"></i></a>
          {% endif %}
        </li>
      </ol>
    </div>

  </header>
{% endmacro %}
