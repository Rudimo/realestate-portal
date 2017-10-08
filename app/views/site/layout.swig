{% include './partials/tags.swig' %}

<!DOCTYPE html>
<!--[if IE 8]>
<html lang="ru" class="ie ie8"> <![endif]-->
<!--[if IE 9]>
<html lang="ru" class="ie ie9"> <![endif]-->
<!--[if gt IE 9]><!-->
<html lang="ru"> <!--<![endif]-->
<head>
  <meta charset="utf-8"/>
  <link rel="icon" href="/images/favicon.ico">
  <link rel="SHORTCUT ICON" href="/images/favicon.ico">
  <title>{{ seoData.title }}</title>
  <meta name="keywords" content="{{ seoData.keywords }}"/>
  <meta name="description" content="{{ seoData.description }}"/>
  <meta name="Author" content="Realza.ru"/>

  <meta name="viewport" content="width=device-width, maximum-scale=1, initial-scale=1, user-scalable=0"/>
  <!--[if IE]>
  <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'><![endif]-->

  {% if meta and meta.jsonLd %}
    {% if meta.jsonLd %}
      <script type="application/ld+json">{{ meta.jsonLd | json | raw }}</script>
    {% endif %}
  {% endif %}

  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-2792313860706009",
      enable_page_level_ads: true
    });
  </script>

  <link
    href="https://fonts.googleapis.com/css?family=Open+Sans:300,400%7CRaleway:300,400,500,600,700%7CLato:300,400,400italic,600,700"
    rel="stylesheet" type="text/css"/>

  <link rel="stylesheet" href="/stylesheets/site_build.css?v={{ globalConfig.appVersion }}">
  <link rel="stylesheet" href="/stylesheets/site_build_less.css?v={{ globalConfig.appVersion }}">
  {# Dev stylesheets #}
  {#<link rel="stylesheet/less" type="text/css" href="/stylesheets/dev.less">#}
  <style>
    [ng\:cloak], [ng-cloak], .ng-cloak {
      display: none !important;
    }
  </style>
</head>

<body data-ng-app="Realza">

{#<pre>{{ meta | json(2) }}</pre>#}

<!-- wrapper -->
<div id="wrapper">

  <div id="topBar">
    <div class="container">

      <!-- right -->
      <ul class="top-links list-inline pull-right">

        {% if loggedUser %}
          <li class="text-welcome hidden-xs">Здравствуйте <strong>{{ loggedUser.firstName }}</strong></li>

          <li>
            <a class="dropdown-toggle no-text-underline" data-toggle="dropdown" href="#"><i
                class="fa fa-user hidden-xs"></i> Личный кабинет</a>
            <ul class="dropdown-menu pull-right">
              <li>
                {{ anchor({path: '/user/objects', text: 'Мои объявления', title: 'Мои объявления', faicon: 'list-alt', subDomain: 'auto'}) }}
              </li>
              <li>
                {{ anchor({path: '/user/setting', text: 'Настройки', title: 'Настройки', faicon: 'cog', subDomain: 'auto'}) }}
              </li>
              <li class="divider"></li>
              <li>
                {{ anchor({path: '/logout', text: 'Выход', title: 'Выход', faicon: 'sign-out', subDomain: 'auto'}) }}
              </li>
            </ul>
          </li>
        {% else %}
          <li>
            {{ anchor({path: '/signin', text: 'Вход', title: 'Вход', subDomain: 'auto'}) }}
          </li>
          <li>
            {{ anchor({path: '/signup', text: 'Регистрация', title: 'Регистрация', subDomain: 'auto'}) }}
          </li>
        {% endif %}

      </ul>

    </div>
  </div>

  <div id="header" class="clearfix header-sm">

    <!-- TOP NAV -->
    <header id="topNav">
      <div class="container">

        <!-- Mobile Menu Button -->
        <button class="btn btn-mobile" data-toggle="collapse" data-target=".nav-main-collapse">
          <i class="fa fa-bars"></i>
        </button>

        <!-- Logo -->
        <a class="logo pull-left" href="{{ meta.jsonLd.url }}">
          <img src="/images/logo-min.png" alt="Портал недвижимости Realza.ru" title="Портал недвижимости Realza.ru"/>
        </a>


        <div class="navbar-collapse pull-right nav-main-collapse collapse">
          <nav class="nav-main">

            <ul id="topMain" class="nav nav-pills nav-main">
              {% if meta.subDomain %}
              {#<li class="dropdown mega-menu"><!-- PORTFOLIO -->
                <a class="dropdown-toggle" href="#">
                  PORTFOLIO
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <div class="row">

                      <div class="col-md-5th">
                        <ul class="list-unstyled">
                          <li><span><a href="">GRID</a></span></li>
                          <li><a href="portfolio-grid-1-columns.html">1 COLUMN</a></li>
                          <li><a href="portfolio-grid-2-columns.html">2 COLUMNS</a></li>
                          <li><a href="portfolio-grid-3-columns.html">3 COLUMNS</a></li>
                          <li><a href="portfolio-grid-4-columns.html">4 COLUMNS</a></li>
                          <li><a href="portfolio-grid-5-columns.html">5 COLUMNS</a></li>
                          <li><a href="portfolio-grid-6-columns.html">6 COLUMNS</a></li>
                        </ul>
                      </div>

                      <div class="col-md-5th">
                        <ul class="list-unstyled">
                          <li><span>MASONRY</span></li>
                          <li><a href="portfolio-masonry-2-columns.html">2 COLUMNS</a></li>
                          <li><a href="portfolio-masonry-3-columns.html">3 COLUMNS</a></li>
                          <li><a href="portfolio-masonry-4-columns.html">4 COLUMNS</a></li>
                          <li><a href="portfolio-masonry-5-columns.html">5 COLUMNS</a></li>
                          <li><a href="portfolio-masonry-6-columns.html">6 COLUMNS</a></li>

                        </ul>
                      </div>

                      <div class="col-md-5th">
                        <ul class="list-unstyled">
                          <li><span>SINGLE</span></li>
                          <li><a href="portfolio-single-extended.html">EXTENDED ITEM</a></li>
                          <li><a href="portfolio-single-parallax.html">PARALLAX IMAGE</a></li>
                          <li><a href="portfolio-single-slider.html">SLIDER GALLERY</a></li>
                          <li><a href="portfolio-single-html5-video.html">HTML5 VIDEO</a></li>
                          <li><a href="portfolio-single-masonry-thumbs.html">MASONRY THUMBS</a></li>
                          <li><a href="portfolio-single-embed-video.html">EMBED VIDEO</a></li>
                        </ul>
                      </div>

                      <div class="col-md-5th">
                        <ul class="list-unstyled">
                          <li><span>LAYOUT</span></li>
                          <li><a href="portfolio-layout-default.html">DEFAULT</a></li>
                          <li><a href="portfolio-layout-aside-left.html">LEFT SIDEBAR</a></li>
                          <li><a href="portfolio-layout-aside-right.html">RIGHT SIDEBAR</a></li>
                          <li><a href="portfolio-layout-aside-both.html">BOTH SIDEBAR</a></li>
                          <li><a href="portfolio-layout-fullwidth.html">FULL WIDTH (100%)</a></li>
                          <li><a href="portfolio-layout-tabfilter.html">TAB FILTER &amp; PAGINATION</a></li>

                        </ul>
                      </div>

                    </div>
                  </li>
                </ul>
              </li>#}
              {% else %}
                <li class="dropdown">
                  <a class="dropdown-toggle" href="#">
                    Недвижимость
                  </a>
                  <ul class="dropdown-menu has-topBar">
                    <li><a href="https://msk.realza.ru">В Москве</a></li>
                    <li><a href="https://moskovskaya.realza.ru">В Московской области</a></li>
                    <li><a href="https://spb.realza.ru">В Санкт-Петербурге</a></li>
                    <li><a href="https://leningradskaya.realza.ru">В Ленинградской области</a></li>
                    <li><a href="https://krasnodarskiy.realza.ru">В Краснодарском крае</a>
                    <li><a href="https://realza.ru/regions">В регионах</a></li>
                  </ul>
                </li>
              {% endif %}

              {% if loggedUser %}
                <li>
                  {{ anchor({path: '/user/objects/create', text: 'Подать объявление', title: 'Подать объявление', subDomain: 'auto'}) }}
                </li>
              {% else %}
                <li>
                  {{ anchor({path: '/objects/create', text: 'Подать объявление', title: 'Подать объявление', subDomain: 'auto'}) }}
                </li>
              {% endif %}

            </ul>

          </nav>
        </div>

      </div>
    </header>
    <!-- /Top Nav -->

  </div>

  {% if currentUrl === '/' and not meta.subDomain %}

    <div class="container">
      <div class="row">
        <div class="col-md-10 col-md-offset-1">
          {% include "../common/partials/messages.swig" %}
        </div>
      </div>
    </div>

    {% block content %}{% endblock %}
  {% else %}


    <div class="nopadding">
      <div class="container">
        <div class="row">
          <div class="col-md-10 col-md-offset-1">
            {% include "../common/partials/messages.swig" %}
          </div>
        </div>
      </div>
    </div>

    {% include '../common/partials/pagination-pages.swig' %}
    {% include '../common/partials/pagination-rows.swig' %}
    {% include '../common/partials/pagination-summary.swig' %}
    {% include 'partials/breadcrumbs.swig' %}

    {% block indexContent %}{% endblock %}

  {% endif %}

  <!-- FOOTER -->
  <footer id="footer">
    <div class="container">

      <div class="row margin-top-60 margin-bottom-40 size-13">

        <!-- col #1 -->
        <div class="col-md-3 col-sm-3">

          <!-- Footer Logo -->
          <img class="footer-logo" src="/images/logo-light-min.png" alt="Портал недвижимости Realza.ru"
               title="Портал недвижимости Realza.ru"/>

          <address>
            <ul class="list-unstyled">
              <li>
                <p>По всем вопросам и предложениям пишите на наш почтовый ящик</p>
              </li>
              <li class="footer-sprite email">
                <a href="mailto:mail@realza.ru"><span>mail@realza.ru</span></a>
              </li>
            </ul>
          </address>

        </div>
        <!-- /col #1 -->

        <!-- col #2 -->
        <div class="col-md-8 col-sm-8">

          <div class="row">

            <div class="col-md-4">
              {% if meta.subDomain %}
                {#<span class="letter-spacing-1">Что то</span>#}
              {% else %}
                <span class="letter-spacing-1">Недвижимость в</span>
                <ul class="list-unstyled footer-list half-paddings noborder">
                  <li><a class="block" href="https://msk.realza.ru"><i class="fa fa-angle-right"></i> Москве</a></li>
                  <li><a class="block" href="https://moskovskaya.realza.ru"><i class="fa fa-angle-right"></i> Московской
                      области</a></li>
                  <li><a class="block" href="https://spb.realza.ru"><i class="fa fa-angle-right"></i>
                      Санкт-Петербурге</a>
                  </li>
                  <li><a class="block" href="https://leningradskaya.realza.ru"><i class="fa fa-angle-right"></i>
                      Ленинградской области</a>
                  </li>
                  <li><a class="block" href="https://krasnodarskiy.realza.ru"><i class="fa fa-angle-right"></i> Краснодарском
                      крае</a>
                  <li><a class="block" href="https://realza.ru/regions"><i class="fa fa-angle-right"></i> В регионах</a>
                  </li>
                </ul>
              {% endif %}
            </div>

            <div class="col-md-4">
              <span class="letter-spacing-1">Ссылки</span>
              <ul class="list-unstyled footer-list half-paddings noborder">
                <li>
                  {{ anchor({path: '/contacts', subDomain: 'auto', text: 'Контакты', title: 'Контакты', class: 'block'}) }}
                </li>
                {% if loggedUser %}
                  <li>
                    {{ anchor({path: '/user/objects/create', subDomain: 'auto', text: 'Подать объявление', title: 'Подать объявление', class: 'block'}) }}
                  </li>
                  <li>
                    {{ anchor({path: '/user/objects', subDomain: 'auto', text: 'Личный кабинет', title: 'Личный кабинет'}) }}
                  </li>
                {% else %}
                  <li>
                    {{ anchor({path: '/objects/create', subDomain: 'auto', text: 'Подать объявление', title: 'Подать объявление'}) }}
                  </li>
                  <li>
                    {{ anchor({path: '/signin', subDomain: 'auto', text: 'Вход', title: 'Вход'}) }}
                  </li>
                  <li>
                    {{ anchor({path: '/signup', subDomain: 'auto', text: 'Регистрация', title: 'Регистрация'}) }}
                  </li>
                {% endif %}
              </ul>
            </div>

            <div class="col-md-4">
              <span class="letter-spacing-1">Мы в соц. сетях</span>
              <div class="margin-top-20">
                <div class="clearfix">

                  <a href="https://vk.com/realza" class="social-icon social-icon-sm social-vk pull-left"
                     data-toggle="tooltip" data-placement="top" title="VK" target="_blank">
                    <i class="icon-vk"></i>
                    <i class="icon-vk"></i>
                  </a>

                  <a href="https://www.facebook.com/RealzaPortal/"
                     class="social-icon social-icon-sm social-facebook pull-left"
                     data-toggle="tooltip" data-placement="top" title="Facebook" target="_blank">
                    <i class="icon-facebook"></i>
                    <i class="icon-facebook"></i>
                  </a>

                  <a href="https://twitter.com/RealzaRu" class="social-icon social-icon-sm social-twitter pull-left"
                     data-toggle="tooltip" data-placement="top" title="Twitter" target="_blank">
                    <i class="icon-twitter"></i>
                    <i class="icon-twitter"></i>
                  </a>

                  <a href="https://plus.google.com/107192548083985635245"
                     class="social-icon social-icon-sm social-gplus pull-left"
                     data-toggle="tooltip" data-placement="top" title="Google plus" target="_blank">
                    <i class="icon-gplus"></i>
                    <i class="icon-gplus"></i>
                  </a>

                  <a href="https://www.youtube.com/channel/UCVt2x2NG7usnXrXnQdh6-3g"
                     class="social-icon social-icon-sm social-youtube pull-left"
                     data-toggle="tooltip" data-placement="top" title="Youtube" target="_blank">
                    <i class="icon-youtube"></i>
                    <i class="icon-youtube"></i>
                  </a>

                  {#<a href="#" class="social-icon social-icon-sm social-icon-border social-rss pull-left" data-toggle="tooltip"
                     data-placement="top" title="Rss">
                    <i class="icon-rss"></i>
                    <i class="icon-rss"></i>
                  </a>#}

                </div>

              </div>
            </div>

          </div>

        </div>
        <!-- /col #2 -->

      </div>

    </div>

    <div class="copyright">
      <div class="container">
        <ul class="pull-right nomargin list-inline mobile-block">
          {#<li><a href="#">Terms &amp; Conditions</a></li>
          <li>&bull;</li>
          <li><a href="#">Privacy</a></li>#}
        </ul>
        &copy; 2015-2017 Realza.ru v{{ globalConfig.appVersion }}
      </div>
    </div>

  </footer>
  <!-- /FOOTER -->

</div>
<!-- /wrapper -->


<!-- SCROLL TO TOP -->
<a href="#" id="toTop"></a>


<!-- PRELOADER -->
<div id="preloader">
  <div class="inner">
    <span class="loader"></span>
  </div>
</div><!-- /PRELOADER -->


<!-- JAVASCRIPT FILES -->

<script type="text/javascript">var plugin_path = '/plugins/';</script>
<script type="text/javascript" src="/javascripts/jquery-2.1.4.min.js" defer></script>
<script src="/javascripts/site_build.js?v={{ globalConfig.appVersion }}" defer></script>
<script src='https://www.google.com/recaptcha/api.js' defer></script>

<script>
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src   = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-91673873-1', 'auto');
  ga('send', 'pageview');
</script>

<script type="text/javascript">
  (function (d, w, c) {
    (w[c] = w[c] || []).push(function () {
      try {
        w.yaCounter42679599 = new Ya.Metrika({
          id: 42679599,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          params: {ip: '{{ ipAddress }}'}
        });
      } catch (e) {
      }
    });

    var n   = d.getElementsByTagName("script")[0],
        s   = d.createElement("script"),
        f   = function () {
          n.parentNode.insertBefore(s, n);
        };
    s.type  = "text/javascript";
    s.async = true;
    s.src   = "https://mc.yandex.ru/metrika/watch.js";

    if (w.opera == "[object Opera]") {
      d.addEventListener("DOMContentLoaded", f, false);
    } else {
      f();
    }
  })(document, window, "yandex_metrika_callbacks");
</script>
<noscript>
  <div><img src="https://mc.yandex.ru/watch/42679599" style="position:absolute; left:-9999px;" alt=""/></div>
</noscript>

</body>
</html>

{% block scripts %}{% endblock %}
