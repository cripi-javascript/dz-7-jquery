/*
* function FormEvent(collection) - для сохдания объекта из формы
*  @param {collection} - массив со значениями полей 
* function create() - добавляет событие в список событий при отправке данных из формы
* function content() - выводит полную информацию о событии при наведении на событие
* function filterAll() - функция фильтрует или сортирует события в зависимости от значений формы фильтрации
* function all() - выводит полный список событий по нажатию на кнопку	"Вывести все события"
* function template (nameClass, mass) - шаблон для вывода списка событий
*     @param {nameClass} - название классов для событий
*     @param {mass} - коллекция событий типа Events
* function passive () - реакция на событие mouseout
*/
var hash = new Events();
var collection = new Events();
function FormEvent(collection) {
    "use strict";
    if (typeof collection.start.value === "undefined" || collection.start.value.length === 0) {
        alert("Дата начала встречи задана не корректно");
	    throw new TypeError("should be date");
    }
    return {
        "name": collection.name.value || "Встреча",
        "start": collection.start.value,
        "end": collection.end.value,
        "place": collection.place.value || {},
        "info": collection.info.value || {},
        "reminder": collection.reminder.value || "За день до встречи",
        "type": collection.type.value || "Работа",
        "party": collection.party.value || "да"
    };
}

function create() {
    "use strict";
    var newEvent, fact, el;
    newEvent = new FormEvent(document.forms[0]);
    fact = new Event(newEvent);
    hash.elem[hash.elem.length] = fact;
    $('#spisok').empty();
    template("oneEvent", hash);
}

function content() {
    "use strict";
    var s, $idParents, newEvent, $list, k, $el;
    $(this).attr("class", $(this).attr("class") + " js_active");
    s = $(this).attr("class");
    $idParents = $(this).attr("id");
    $('#contecsk').empty();
    newEvent = hash.elem[0];
    $el = $('#meeting').clone(true);
    $el.attr("class", "elements");
    $list =  $('#meeting label').clone(true);
    $list.children().each(function () {
        if (this.nodeType === 1) {
            $(this).remove();
        }
    });
    $list.each(function (i) {
        for (k in newEvent) {
            if (k === document.forms[0].elements[i].name) {
                if (s === 'oneEventCollection js_active') {
                    $(this).text($(this).text() + " " + collection.elem[$idParents.charAt($idParents.length - 1)][k]);
                } else {
                    $(this).text($(this).text() + " " + hash.elem[$idParents.charAt($idParents.length - 1)][k]);
                }
            }
        }
    });
    $list.appendTo('#contekst');
}

window.onload = function () {
    "use strict";
    document.getElementById('submitEvent').addEventListener('click', create, true);
    document.getElementById('sort').addEventListener('click', filterAll, true);
    document.getElementById('all').addEventListener('click', all, true);
    asyncXHR('get', 'test.json', null, readToFile);
}

function filterAll() {
    "use strict";
    var collection2 = new Events();
    $('#spisok').empty();
    var op1 = document.forms[1].elements[0].value;
    var op2 = document.forms[1].elements[1].value;
    switch (op1) {
    case "предстоящие":
        collection2 = hash.FilterToDate(1);
        break;
    case "прошедшие":
        collection2 = hash.FilterToDate(-1);
        break;
    case "я не участвую":
        collection2 = hash.FilterToParty(-1);
        break;
    case "я участвую":
        collection2 = hash.FilterToParty(1);
        break;
    }
    switch (op2) {
    case "предстоящие":
        collection = collection2.FilterToDate(1);
        break;
    case "прошедшие":
        collection = collection2.FilterToDate(-1);
        break;
    case "я не участвую":
        collection = collection2.FilterToParty(-1);
        break;
    case "я участвую":
        collection = collection2.FilterToParty(1);
        break;
    case "сортировать по дате":
        collection = collection2.SortToDate();
        break;
    }
    template("oneEventCollection", collection);
}

function all () {
    "use strict";
    $('#spisok').empty();
    template ('oneEvent', hash);
}

function template(nameClass, mass) {
    "use strict";
    var i;
    for (i = 0; i < mass.elem.length; i++) {
        var $el = $('<div />', {
            class : [nameClass],
            id : 'oneEvent' + i,
            text : mass.elem[i].start + "-" + mass.elem[i].end + " " + mass.elem[i].name,
            mouseout: passive,
            mouseover: content
        }).appendTo('#spisok');
    }
}

function passive() {
    "use strict";
    if ($(this).attr("class") === 'oneEvent js_active') {
        $(this).attr("class","oneEvent");
    } else {
        $(this).attr("class", "oneEventCollection");
    }
    $('#contekst').empty();
}