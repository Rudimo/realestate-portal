{% for message in flashMessages %}
  <div class="flash">
    <div class="alert alert-{{ message.type }}">
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
      <strong>{{ message.text }}</strong>
    </div>
  </div>
{% endfor %}
