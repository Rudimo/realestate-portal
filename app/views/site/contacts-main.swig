{% extends 'layout2.swig' %}

{% block content %}
  <div class="col-md-6 col-md-offset-1">
    <h3>Контакты</h3>
    <p>
      По вопросам размещения рекламы на портале:
      <strong>
        <a href="mailto:ads@realza.ru">ads@realza.ru</a>
      </strong>
    </p>
    <hr>
    <p>
      Realza осуществляет свою деятельность на всей территории РФ. Для оперативного ответа на ваше обращение вы
      можете использовать форму обратной связи. Мы всегда готовы к взаимовыгодному сотрудничеству. Так же обращаем
      ваше внимание, что наш портал не является СМИ.
    </p>
    <hr>
    <p>
      Так же для связи возможно использовать следующие адреса:
      <br>
      <br>
      По вопросам технической поддержки:
      <strong><a href="mailto:support@realza.ru">support@realza.ru</a></strong>
      <br>
      По вопросам рекламы и сотрудничества:
      <strong><a href="mailto:ads@realza.ru">ads@realza.ru</a></strong>
      <br>
      По другим вопросам: <strong><a href="mailto:mail@realza.ru">mail@realza.ru</a></strong>
    </p>
  </div>
  <div class="col-md-4">
    <div class="contact-over-box">

      <h3 class="size-20">Обратная связь</h3>

      <form action="/contacts" method="post">
        <fieldset>
          <input type="hidden" name="action" value="contact_send">

          <div class="row">
            <div class="col-md-12 margin-bottom-20">
              <label for="contact:name">Ваше Имя *</label>
              <input required="" type="text" class="form-control" name="name" id="contact:name">
            </div>
            <div class="col-md-12 margin-bottom-20">
              <label for="contact:email">E-mail *</label>
              <input required="" type="email" class="form-control" name="email" id="contact:email">
            </div>

            <div class="col-md-12 margin-bottom-20">
              <label for="contact:subject">Тема обращения *</label>
              <select class="form-control pointer" name="subject" id="contact:subject">
                <option value="">--- Выберите ---</option>
                <option value="Техническая проблема">Техническая проблема</option>
                <option value="Реклама на портале">Реклама на портале</option>
                <option value="Жалоба">Жалоба</option>
                <option value="Сотрудничество">Сотрудничество</option>
                <option value="Другое">Другое</option>
              </select>
            </div>

            <div class="col-md-12 margin-bottom-20">
              <label for="contact:message">Сообщение *</label>
              <textarea required="" maxlength="10000" rows="6" class="form-control" name="message" id="contact:message"></textarea>
            </div>
          </div>

        </fieldset>

        <div class="row">
          <div class="col-md-12">
            {#<button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> ОТПРАВИТЬ</button>#}
            <button type="button" class="btn btn-primary"><i class="fa fa-check"></i> ОТПРАВИТЬ</button>
          </div>
        </div>
      </form>


    </div>
  </div>
{% endblock %}