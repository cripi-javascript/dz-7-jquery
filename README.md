# Домашнее задание по jQuery

Необходимо заменить **все нативные DOM функции** функциями jQuery и заставить работать ваш проект **под IE8+**

Нет IE8? - http://www.my-debugbar.com/wiki/IETester/HomePage

## Обратить внимание

  * `innerHTML` -> `$().text(), $().html()`
  * `querySelectorAll, getElementById` -> `$('#selector')`
  * `JSON.*` -> полифилл https://github.com/douglascrockford/JSON-js/blob/master/json2.js
  * `XMLHttpRequest` -> `$.get(), $.post()`
  * `[].map(), [].forEach(), [].filter()` -> полифилл https://github.com/kriskowal/es5-shim или underscore.js (lowdash.js)
  * `addEventListener` -> `$().on('click', function () {})` или `$().click(function () {})`
  * ваш основной .js файл обвернуть в DOMReady `$(function () { /*your code*/ });`
  * генерацию HTML `createElement` заменить на шаблоны http://ejohn.org/blog/javascript-micro-templating/ или http://api.jquery.com/jquery.tmpl/ или любой другой