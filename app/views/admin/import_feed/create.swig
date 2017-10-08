{% extends '../layout.swig' %}

{% block title %}Добавить фид{% endblock %}

{% block pageheader %}
  {{ pageheader({title: 'Управление импортом фидов - добавление фида', showSaveButton: true, showCloseButton: true}) }}
{% endblock %}

{% block pagecontent %}
  {% include '_form.swig' %}
{% endblock %}

{% block page_js %}

{% endblock %}