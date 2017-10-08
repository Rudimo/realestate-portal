{% extends 'layout.swig' %}

{% block indexContent %}
<section class="padding-xxs">
  <div class="container">
    <div class="row">
      {% block content %}{% endblock %}
    </div>
  </div>
</section>
{% endblock %}
