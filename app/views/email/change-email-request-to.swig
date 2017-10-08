{% extends 'layout/layout.swig' %}

{% block content %}
  <h3>Здравствуйте, {{ user.firstName }}!</h3>

  <p class="lead">
    Мы получили запрос на изменение E-mail адреса.
  </p>

  <p class="callout">
    Для того чтобы подтвердить этот адрес электронной почты, пожалуйста, перейдите по ссылке:
    <a href="{{ baseUrl }}/change-email-verification/{{ user.emailChangeRequest.confirmationCode2 }}">
      {{ baseUrl }}/change-email-verification/{{ user.emailChangeRequest.confirmationCode2 }}
    </a>
  </p>
{% endblock %}