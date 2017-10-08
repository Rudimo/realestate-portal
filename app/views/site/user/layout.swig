{% extends '../layout2.swig' %}

{% block content %}

  <div growl></div>

  <!-- LEFT -->
  <div class="col-lg-3 col-md-3 col-sm-4">

    <!-- SIDE NAV -->
    <ul class="side-nav list-group margin-bottom-60" id="sidebar-nav">
      <li class="{% if currentUrl.indexOf('/user/objects') === 0 %}active{% endif %} list-group-item">
        <a href="/user/objects"><i class="fa fa-eye"></i> ОБЪЯВЛЕНИЯ</a>
      </li>
      <li class="{% if currentUrl.indexOf('/user/setting') === 0 %}active{% endif %} list-group-item">
        <a href="/user/setting"><i class="fa fa-gears"></i> НАСТРОЙКИ</a>
      </li>
    </ul>
    <!-- /SIDE NAV -->


    <!-- info -->
    <div class="box-light margin-bottom-30"><!-- .box-light OR .box-light -->
      <div class="text-muted">
        {#<pre>{{ loggedUser | json(2) }}</pre>#}
      </div>
    </div>

  </div>

  {% block userContent %}

  {% endblock %}

{% endblock %}