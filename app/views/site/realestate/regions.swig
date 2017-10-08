{% extends '../layout.swig' %}

{% block indexContent %}

  <section class="fullheight regions">

    <div class="container">

      <div class="col-md-12">
        <div class="breadcrumbs">
          {{ breadcrumbs() }}
        </div>
      </div>

      <h1 class="title">{{ seoData.title }}</h1>

      <div class="col-md-12">
        <div class="row raion-list">
          {% for column in columns %}

            <div class="col-md-4">

              <ul>
                {% for region in column %}
                  <li><a href="{{ meta.protocol }}://{{ region.abbreviation }}.{{ meta.domain }}">{{ region._id }}
                      ({{ region.count }})</a></li>
                {% endfor %}
              </ul>

            </div>

          {% endfor %}
        </div>
      </div>

    </div>

  </section>

  {#<pre>{{ columns | json(2) }}</pre>#}
  {#<pre>{{ region | json(2) }}</pre>#}
  {#<pre>{{ meta.breadcrumbs | json(2) }}</pre>#}
  {#<pre>{{ meta | json(2) }}</pre>#}
{% endblock %}