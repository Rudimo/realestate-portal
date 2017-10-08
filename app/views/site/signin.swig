{% extends 'layout2.swig' %}

{% block content %}
  <div class="col-md-6 col-md-offset-3">

    <div class="box-static box-border-top padding-30">
      <div class="box-title margin-bottom-30">
        <h2 class="size-20">Вход в личный кабинет</h2>
      </div>

      <form class="nomargin" method="post" action="/signin" id="sign-in-form">
        <div class="clearfix">

          <!-- Email -->
          <div class="form-group">
            <input type="text" name="username" class="form-control" placeholder="E-mail" required>
          </div>

          <!-- Password -->
          <div class="form-group">
            <input type="password" name="password" class="form-control" placeholder="Пароль" required>
          </div>

        </div>

        <div class="row">

          <div class="col-md-6 col-sm-6 col-xs-6">

            <!-- Inform Tip -->
            <div class="form-tip pt-20">
              <a class="no-text-decoration size-13 margin-top-10 block" href="#">Забыли пароль?</a>
            </div>

          </div>

          <div class="col-md-6 col-sm-6 col-xs-6 text-right">

            <button type="button" class="g-recaptcha btn btn-primary"
                    data-sitekey="{{ googleRecapchaSiteKey }}"
                    data-callback="signInFormSubmitRecapcha">
              ВОЙТИ
            </button>

          </div>

        </div>

      </form>

    </div>

    <div class="margin-top-30 text-center">
      <a href="/signup"><strong>Создать аккаунт</strong></a>

    </div>

  </div>
{% endblock %}