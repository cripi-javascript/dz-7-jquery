$(function (exports) {
    "use strict";

    var ListOfEvents = new Events();
    var sortedList = new Events();

    var filterOption = "all";
    var sortOption = "without";

    $(document.body).on('load', initialise());

/**
    * Загружает свое состояние с сервера
    * при отсутсвии соединения/страницы на сервере пытается подключиться через 5 минут снова
    *
*/
    function initialise() {

        $.ajax({
            dataType: 'json',
            url: 'http://http://yunnii.github.com/dz-7-jquery/current-event.json',
            success: function(jqXHR) {
                for (var i = 0; i < jqXHR.length; i++)
                {
                    var newEvent = new Event(jqXHR[i]).validate();
                    ListOfEvents = ListOfEvents.add(newEvent);
                };
                changeDocument("sort");
                addListener();
            },
            error: function() {
                if (error === "error") {
                    $('#notifyError').show();
                    return;
                }
            }})
            .always(function() { 
                    $("#notify").hide(); 
                });
        }

/**
 * Добавляет новое событие в список. Если установлены опции фильтрации и сортировки 
 * - то располагает элменты на странице, в с-ии с ними
 *
*/
    function preventDefault() {

        var name = $("#title").val(),
            start = $("#from").val(),
            end = $("#to").val(),
            location = $("#location").val(),
            raiting = $("#raiting").val(),
            description = $("#description").val(),
            remindTime = $("#remindTime").val();

        if (!validateTitle(name, $('#title_help'))) { alert("Событие не было добавлено. Ошибка"); return; };
        if (!validateDate(start, $('#from_help'))) { alert("Событие не было добавлено. Ошибка"); return; };
        if (!validateNumber(remindTime, $('#remindTime_help'))) { alert("Событие не было добавлено. Ошибка"); return; };

        var element = new Event({
                name: name,
                start: start,
                end: end,
                location: location,
                raiting: raiting,
                description: description,
                remindTime: remindTime
            }).validate();

        var result = ListOfEvents.add(element);

        $.ajax({
            type: 'POST',
            url: 'http://yunnii.github.com/dz-7-jquery/current-event.json',
            data: result.serialise(),
            error: function() {
              /*if (error === "error") {
                    alert("Не могу подключиться к северу. Попробуйте позже");
                    return;
                }*/
            }})
            .always(function() {
                ListOfEvents = result;
                changeDocument("sort");
                document.forms["form"].reset();
            });
    };

    function filterEvents(listEvents) {
        switch (filterOption) {
        case "future":
            return listEvents.coming();
        case "past":
            return listEvents.past();
        default:
            return listEvents;
        }
    }

    function sortEvents(listEvents) {
        switch (sortOption) {
        case "byName":
            return ListOfEvents.sortByName();
        case "byStart":
            return ListOfEvents.sortByTime();
        case "byRaiting":
            return ListOfEvents.sortByRaiting();
        default:
            return ListOfEvents;
        }
    }

/**
 * Сортирует и фильтрует события в соответствии с указанными опциями.
 *
 * @param {string} changeType - если указана строка "sort", то события также будут отсортированы,
 *  инчае - только отфильтрованы
 * @return коллекция объектов типа event
*/

    function changeDocument(changeType) {
        var $removeList = $(".events");
        $removeList.remove();

        var $addList = $('<ul />', {
            class: "events"
            });

        var fragment = document.createDocumentFragment();
        if (changeType === "sort") {
            sortedList = sortEvents(ListOfEvents);
        }
        var filterList = filterEvents(sortedList);

        var length = filterList.length();

        for (var i = 0; i < length; i++)
        {
            var element = filterList.items[i];
            var $el = addLiElement(element);
            $el.appendTo($addList);
        }

         var $parent = $(".collection");
        $addList.appendTo(fragment);
        $parent.append(fragment);
}

/**
 * Создает DOM-элемент типа li, заполняется полями из объекта
 *
 * @param {Event} element - объект типа Element
 *
 * @return Возвращает созданный дом-элемент типа li
*/

    function addLiElement (element) {
        var $el = $('<li />', {
            className: 'event_item'
        });

        var $name = $('<div />', {
            text: "Название: " + element.name
        }).appendTo($el);

        var $start = $('<div />', {
            text: "Начало: " + element.start
        }).appendTo($el);

        var $end = $('<div />', {
            text: "Окончание: " + element.end
        }).appendTo($el);

        var $location = $('<div />', {
            text: "Местоположение: " + element.location
        }).appendTo($el);

        var $remindTime = $('<div />', {
            text: "Напомнить за: " + element.remindTime + "минут"
        }).appendTo($el);

        var $description = $('<div />', {
            text: "Описание: " + element.description
        }).appendTo($el);

        var $raiting = $('<div />', {
            text: "Рейтинг: " + element.raiting
        }).appendTo($el);

        return $el;
    };

/**
 * Навешивает обработчики событий на страницу
*/
     function addListener() {
        var $name = $("#title");
        var $start = $("#from");
        var $remindTime = $("#remindTime");
        var $filters = $('.filter');
        var $sort = $('.sort');
        var $button = $("#addButton");

        $name.on('blur', function($event) {
            var cur = $event.currentTarget;
            validateTitle(cur.value, $('#title_help'));
        });

        $start.on('blur', function ($event) {
            var cur = $event.currentTarget;
            validateDate(cur.value, $('#from_help'));
        });

        $remindTime.on('blur', function ($event) {
            var cur = $event.currentTarget;
            validateNumber(remindTime.value, $('#remindTime_help'));
        });

        $filters.each(function(index) {
            $(this).on('change', function ($event) {
            filterOption = $('input[name="filter"]:checked').val(); 
            changeDocument("filter");
        })});

        $sort.each(function(index) {
            $(this).on('change', function ($event) {
            sortOption = $('input[name="sort"]:checked').val(); 
            changeDocument("sort");
        })});


        $button.on('click', preventDefault);
    }

}(window));