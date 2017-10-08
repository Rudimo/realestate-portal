{% extends 'layout/layout.swig' %}

{% block content %}
  <h3>Здравствуйте, {{ user.firstName }}!</h3>

  <p class="lead">
    Мы благодарим Вас за регистрацию на Realza.ru!
  </p>

  <p>
    Для входа на сайт Вы можете использовать этот E-mail или номер телефона <strong>{{ user.phone }}</strong>.
  </p>

  <p class="callout">
    Для того чтобы подтвердить адрес электронной почты, пожалуйста, перейдите по ссылке:
    <a href="{{ baseUrl }}/confirm-email/{{ user.emailVerificationCode }}">
      {{ baseUrl }}/confirm-email/{{ user.emailVerificationCode }}
    </a>
  </p>
{% endblock %}