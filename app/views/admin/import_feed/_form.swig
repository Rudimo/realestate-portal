<form name="itemForm" action="{{ actionUrl }}" method="post">

  <div class="row">
    <div class="col-sm-3 col-md-3 col-lg-2">
      <h5 class="sm-title">Detail Tabs</h5>
      <ul class="nav nav-pills nav-stacked nav-msg">
        <li role="presentation" class="active">
          <a href="#tab-basic" aria-controls="tab-basic" role="tab" data-toggle="tab">Основная информация</a>
        </li>
      </ul>
    </div>
    <div class="col-sm-9 col-md-9 col-lg-10">
      <div class="tab-content">
        {% include "tabs/basic.swig" %}
      </div>
    </div>
  </div>

</form>