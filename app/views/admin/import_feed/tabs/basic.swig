<div class="tab-pane active" id="tab-basic">

  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Основная информация</h3>
    </div>
    <div class="panel-body">

      <div class="row">

        <div class="col-sm-12">
          <div class="form-group">
            <label class="control-label" for="title">Название фида</label>
            <input type="text" id="portalName" name="portalName" class="form-control" value="{{ item.portalName }}" required
                   autofocus/>
          </div>
        </div>

      </div>

      <div class="row">

        <div class="col-sm-12">
          <div class="form-group">
            <label class="control-label" for="content">URL ссылка на фид</label>
            <input type="text" id="url" name="url" class="form-control" value="{{ item.url }}" required />
          </div>
        </div>

      </div>

    </div>
  </div>

</div>