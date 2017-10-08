{% extends 'layout2.swig' %}

{% block content %}
<div class="col-md-6 col-md-offset-3">

  <div class="box-static box-border-top padding-30">
    <div class="box-title margin-bottom-30">
      <h2 class="size-20"><i class="fa fa-users"></i> Присоединись к нам</h2>
    </div>

    <form class="nomargin sky-form" action="/signup" method="post" id="sign-up-form">

      <fieldset class="nomargin">
        <label class="input margin-bottom-10">
          <i class="ico-append fa fa-envelope"></i>
          <input type="text" placeholder="E-mail" name="email" required>
        </label>


        <label class="input margin-bottom-10">
          <div class="input-group">
            <span class="input-group-addon">+7</span>
            <i class="ico-append fa fa-phone"></i>
            <input type="text" placeholder="Телефон" name="phone" class="form-control masked"
                   data-format="(999) 999-99-99" data-placeholder="X" required>
          </div>
        </label>

        <label class="input margin-bottom-10">
          <i class="ico-append fa fa-user"></i>
          <input type="text" placeholder="Имя" name="firstName" required>
        </label>

        <label class="input margin-bottom-10">
          <i class="ico-append fa fa-lock"></i>
          <input type="password" placeholder="Пароль" name="password" required>
        </label>

        <label class="input margin-bottom-10">
          <i class="ico-append fa fa-lock"></i>
          <input type="password" placeholder="Повторите пароль" name="password2" required>
        </label>

        <div class="form-group">
          <label class="switch switch-info">
            <input name="isAgent" type="checkbox">
            <span class="switch-label" data-off="НЕТ" data-on="ДА"></span>
            <span class="control-label">Я посредник</span>
          </label>
        </div>

        <div class="margin-top-30 validate">
          <label class="checkbox nomargin"><input class="checked-agree" type="checkbox" name="terms" required><i></i>
            Я согласен c
            <a href="/legal/rules" target="_blank">Правилами сервиса</a>
            и
            <a href="/legal/personal-data" target="_blank">Политикой обработки персональных данных</a>
          </label>
        </div>
      </fieldset>

      <div class="row margin-bottom-20">
        <div class="col-md-12">
          <button type="button" class="g-recaptcha btn btn-primary"
                  data-sitekey="{{ googleRecapchaSiteKey }}"
                  data-callback="signUpFormSubmitRecapcha">
            <i class="fa fa-check"></i> Зарегистрироваться
          </button>
        </div>
      </div>

    </form>

  </div>

</div>
{% endblock %}