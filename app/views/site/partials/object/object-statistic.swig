{% macro objectStatistic(item) %}
  <div class="object-statistic">
    <span>&nbsp;<i class="fa fa-info"></i>&nbsp;&nbsp;Объявление #{{ item.idNumber }}</span>
    <span><i class="fa fa-eye"></i> Просмотров: {{ item.views }}</span>
    <span>
      {% if moment(item.createdAt).add(1, 'hour').isBefore(item.lastUpdate) %}
        <i class="fa fa-check"></i>&nbsp;Опубликовано {{ moment(item.createdAt).utcOffset(geoInfo.utcOffset).calendar() | lower }}
        <br>
        <i class="fa fa-refresh"></i>&nbsp;&nbsp;Обновлено {{ moment(item.lastUpdate).utcOffset(geoInfo.utcOffset).calendar() | lower }}
      {% else %}
        <i class="fa fa-check"></i>&nbsp;Опубликовано {{ moment(item.createdAt).utcOffset(geoInfo.utcOffset).calendar() | lower }}
      {% endif %}
    </span>
  </div>
{% endmacro %}