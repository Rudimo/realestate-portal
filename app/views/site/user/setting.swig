{% extends 'layout.swig' %}

{% block userContent %}

  <div class="col-lg-9 col-md-9 col-sm-8 margin-bottom-80">

    <ul class="nav nav-tabs nav-top-border">
      <li class="active"><a href="#info" data-toggle="tab">Контактная информация</a></li>
      <li><a href="#password" data-toggle="tab">Изменение пароля</a></li>
      <li><a href="#email" data-toggle="tab">Изменение E-mail</a></li>
      <li><a href="#privacy" data-toggle="tab">Privacy</a></li>
    </ul>

    <div class="tab-content margin-top-20">

      {% set init = 'ctrl.init(' + JSON.stringify(profile) + ')' %}

      <!-- PERSONAL INFO TAB -->
      <div class="tab-pane fade in active ng-cloak" id="info"
           data-ng-controller="UserSettingController as ctrl" data-ng-init="{{ init }}">
        <div class="row">
          <div class="col-md-8">
            <form class="validate" data-ng-submit="ctrl.save()">
              <div class="form-group">
                <label class="control-label">Имя *</label>
                <input name="firstName" type="text" placeholder="Имя" class="form-control"
                       data-ng-model="ctrl.item.firstName" required>
              </div>
              <div class="form-group">
                <label class="control-label">Фамилия</label>
                <input name="lastName" type="text" placeholder="Фамилия" class="form-control"
                       data-ng-model="ctrl.item.lastName">
              </div>
              <div class="form-group">
                <label class="control-label">Отчество</label>
                <input name="surName" type="text" placeholder="Отчество" class="form-control"
                       data-ng-model="ctrl.item.surName">
              </div>
              <div class="form-group">
                <label class="control-label">Мобильный телефон *</label>
                <div class="input-group">
                  <span class="input-group-addon">+7</span>
                  <input type="text" placeholder="Мобильный телефон" class="form-control masked"
                         data-ng-model="ctrl.item.phone" data-format="(999) 999-99-99" data-placeholder="X" required>
                </div>
              </div>
              <div class="form-group">
                <label class="control-label">Посредник</label>
                <label class="switch switch-info">
                  <input type="checkbox" data-ng-model="ctrl.item.isAgent">
                  <span class="switch-label" data-off="НЕТ" data-on="ДА"></span>
                </label>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> Сохранить изменения</button>
              </div>
            </form>
          </div>
          <div class="col-md-4">
            <div class="thumbnail text-center">

              <i data-ng-if="ctrl.imageUploading" class="fa fa-spinner fa-pulse fa-5x"></i>

              <img alt="User default image" data-ng-if="!ctrl.imageUploading"
                   data-ng-src="{[{ ctrl.image }]}">

              <div style="margin-top: 10px">
                <span class="btn btn-xs btn-default btn-file">
                  Изменить аватар <input type="file" oi-file="ctrl.imageUploaderOptions">
                </span>&nbsp;
                <span data-ng-click="ctrl.removeUserImage()"
                      data-ng-show="ctrl.item.image"
                      class="btn btn-xs btn-default">
                  Удалить аватар
                </span>
              </div>

              <h2 class="size-18 margin-top-10 margin-bottom-0">{{ loggedUser.firstName }}</h2>
              <h3 class="size-11 margin-top-0 margin-bottom-10 text-muted">
                {% if loggedUser.isAgent %}Агент{% else %}Собственник{% endif %}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <!-- /PERSONAL INFO TAB -->

      <!-- PASSWORD TAB -->
      <div class="tab-pane fade ng-cloak" id="password"
           data-ng-controller="UserPasswordController as ctrl" data-ng-init="ctrl.init()">

        <form class="validate" data-ng-submit="ctrl.save()">

          <div class="form-group">
            <label class="control-label">Текущий пароль</label>
            <input name="currentPassword" type="password" class="form-control"
                   data-ng-model="ctrl.item.currentPassword" required>
          </div>
          <div class="form-group">
            <label class="control-label">Новый пароль</label>
            <input name="newPassword" type="password" class="form-control"
                   data-ng-model="ctrl.item.newPassword" required>
          </div>
          <div class="form-group">
            <label class="control-label">Повторите новый пароль</label>
            <input name="newPasswordConfirmation" type="password" class="form-control" required
                   data-ng-model="ctrl.item.newPasswordConfirmation">
          </div>

          <div class="margiv-top10">
            <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> Изменить пароль</button>
          </div>

        </form>

      </div>
      <!-- /PASSWORD TAB -->

      <!-- EMAIL TAB -->

      <div class="tab-pane fade ng-cloak" id="email"
           data-ng-controller="UserEmailController as ctrl"
           data-ng-init="ctrl.init('{{ loggedUser.emailChangeRequest.toEmail }}')">

        <form data-ng-if="!ctrl.pendingEmail" class="validate" data-ng-submit="ctrl.save()">

          <div class="form-group">
            <label class="control-label">Текущий E-mail</label>
            <input name="currentEmail" type="email" class="form-control"
                   data-ng-model="ctrl.item.currentEmail" required>
          </div>
          <div class="form-group">
            <label class="control-label">Новый E-mail</label>
            <input name="newEmail" type="email" class="form-control"
                   data-ng-model="ctrl.item.newEmail" required>
          </div>

          <div class="margiv-top10">
            <button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> Изменить E-mail</button>
          </div>

        </form>

        <div data-ng-if="ctrl.pendingEmail">
          <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
              <div style="padding: 10px;" class="alert alert-info">
                <strong class="pull-right">
                  <span class="fa fa-info-circle"></span>
                </strong>
                <br>
                {% if not loggedUser.emailChangeRequest.toEmail %}
                  <strong>Мы отправили 2 сообщения по адресам: </strong> {[{ ctrl.item.currentEmail }]}
                  и {[{ ctrl.item.newEmail }]}
                {% else %}
                  <strong>Мы отправили 2 сообщения по адресам: </strong> {{ loggedUser.email }}
                  и {{ loggedUser.emailChangeRequest.toEmail }}
                {% endif %}
                <br>
                <br>
                Пожалуйта, <span style="text-decoration:underline">следуйте инструкциям в письмах</span> для изменения
                E-mail адреса.
                <br>
              </div>

            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 text-center">
              <a type="button" class="btn btn-xs btn-danger" href="/user/setting/email-change-cancel">
                Отменить изменение E-mail адреса</a>
            </div>
          </div>
        </div>

      </div>
      <!-- /EMAIL TAB -->

      <!-- PRIVACY TAB -->
      <div class="tab-pane fade" id="privacy">

        <form action="#" method="post">
          <div class="sky-form">

            <table class="table table-bordered table-striped">
              <tbody>
              <tr>
                <td>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam.</td>
                <td>
                  <div class="inline-group">
                    <label class="radio nomargin-top nomargin-bottom">
                      <input type="radio" name="radioOption" checked=""><i></i> Yes
                    </label>

                    <label class="radio nomargin-top nomargin-bottom">
                      <input type="radio" name="radioOption" checked=""><i></i> No
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam.</td>
                <td>
                  <label class="checkbox nomargin">
                    <input type="checkbox" name="checkbox" checked=""><i></i> Yes
                  </label>
                </td>
              </tr>
              <tr>
                <td>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam.</td>
                <td>
                  <label class="checkbox nomargin">
                    <input type="checkbox" name="checkbox" checked=""><i></i> Yes
                  </label>
                </td>
              </tr>
              <tr>
                <td>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam.</td>
                <td>
                  <label class="checkbox nomargin">
                    <input type="checkbox" name="checkbox" checked=""><i></i> Yes
                  </label>
                </td>
              </tr>
              </tbody>
            </table>

          </div>

          <div class="margin-top-10">
            <a href="#" class="btn btn-primary"><i class="fa fa-check"></i> Save Changes </a>
            <a href="#" class="btn btn-default">Cancel </a>
          </div>

        </form>

      </div>
      <!-- /PRIVACY TAB -->

    </div>

  </div>

{% endblock %}