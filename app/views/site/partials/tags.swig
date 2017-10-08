{% macro anchor(options) %}

  {# href
     protocol, subDomain(!/auto), domain, path(!)
     title(!), text(!) #}

  {% if options.protocol %}
    {% set protocol = options.protocol %}
  {% else %}
    {% set protocol = httpProtocol %}
  {% endif %}

  {% if options.subDomain === 'auto' %}
    {% if meta.subDomain %}
      {% set subDomain = meta.subDomain %}
    {% else %}
      {% set subDomain = meta.region.abbreviation %}
    {% endif %}
  {% elseif options.subDomain %}
    {% set subDomain = options.subDomain %}
  {% else %}
    {% set subDomain = null %}
  {% endif %}

  {% if options.domain %}
    {% set domain = options.domain %}
  {% else %}
    {% set domain = meta.domain %}
  {% endif %}

  {% if options.href %}

    {% set href = options.href %}

  {% else %}

    {% set href =  protocol + '://' %}

    {% if subDomain %}
      {% set href = href + subDomain + '.' %}
    {% endif %}

    {% set href = href + domain %}

    {% if options.path %}
      {% set href = href + options.path %}
    {% endif %}

  {% endif %}

  <a href="{{ href }}" title="{{ options.title }}" {% if options.target %}target="{{ options.target }}"{% endif %}
    {% if options.class %}class="{{ options.class }}"{% endif %}>
    {% if options.faicon %}<i class="fa fa-{{ options.faicon }}"></i> {% endif %}
    {{ options.text | raw }}
    {% if options.append %}
      {{ options.append | raw }}
    {% endif %}
  </a>

{% endmacro %}

{% macro categoryAnchor(params) %}

  {% set text = params.text %}

  {% if params.megaCompoundType %}
    {#{% set count = counts.megaCompoundTypes | find({key: params.megaCompoundType}) %}#}
    {% set count = counts[params.megaCompoundType] %}
  {% else %}
    {% set count = 'not_needed' %}
  {% endif %}

  {% if count %}
    {% if params.showCounter %}
      {% set text = text + ' (' + count + ')' %}
    {% endif %}
    {{ anchor({
      subDomain: 'auto',
      path: params.baseUrl + params.path,
      text: text,
      title: params.title }) }}
  {% elseif count === 'not_needed' %}
    {{ anchor({
      subDomain: 'auto',
      path: params.baseUrl + params.path,
      text: text,
      title: params.title }) }}
  {% else %}
    <span class="no-items" title="Объекты отсутствуют">{{ text | raw }}</span>
  {% endif %}

{% endmacro %}