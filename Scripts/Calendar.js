(function (toExport) {
    "use strict";
    /**
     * @namespace Пространство имен для календаря
     *
     * @field {EventFactory}  объект, хранящий ссылки на inputы необходимые для создания нового события
     * @field eventList  ссылка на дом объект, хранящий список событий
     * @field eventBase все события пользователя
     * @field errorManager объект хранящий функции для валидации полей в дом и хранящий в себе некоторые тривиальные операции
     * @field currentFilters фильтры наложенные на текущие события
     */
    var Calendar = function ($factory, $filter, $table, baseUrl) {
        var cloneCalendar = this;
        this.factory = new FactoryEvent($factory);
        this.filter = new FilterEventBase($filter);
        this.table = new TableEventBase($table);

        this.loadBase(baseUrl);
        this.factory.WriteDefaultEvent();

        this.factory.$container.find("input[type = text], input[type = date]").on("blur", function () {
            cloneCalendar.factory.eventValidation();
        })

        this.factory.$container.find("#SubmitNewEventButton").on("click", function () {
            var eventObj = cloneCalendar.factory.readEvent(),
                errors = Event.isValidate(eventObj),
                isCritical = errors.some(function (element) {
                    return element.isCritical;
                });
            cloneCalendar.factory.eventValidation();
            if (isCritical) {
                return;
            }
            if (errors.length !== 0) {
                if (!confirm('Некоторые незначительные поля некорректны, продолжить?')) {
                    return;
                }
            }
            cloneCalendar.saveNewEvent(baseUrl, eventObj);
            alert("УИИИ!!!");
        });
        this.filter.$container.find("input").on("click", function () {
            var newBaseEvent = cloneCalendar.filter.apply(cloneCalendar.baseEvent);
            cloneCalendar.table.updateTable(newBaseEvent);
        });
        this.filter.$container.find("input").on("blur", function () {
            var newBaseEvent = cloneCalendar.filter.apply(cloneCalendar.baseEvent);
            cloneCalendar.table.updateTable(newBaseEvent);
        });
    };
    toExport.Calendar = Calendar;
    Calendar.prototype = Object.create(Model.prototype, {
        constructor: {
            value: Event,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    /**
     * @function Загрузить по url базу событий
     * @param baseUrl {String} url
     *
     */
    Calendar.prototype.loadBase = function (baseUrl) {
        var calendar = this,
            i,
            events;
        $.getJSON(baseUrl, function (date) {
            events = [];
            for (i = 0; i < date.items.length; i += 1) {
                var item = date.items[i];
                events.push(new Event({
                     "start": new Date(item.start),
                     "end": new Date(item.end),
                     "name": item.end,
                     "gps": {
                         "x": parseFloat(item.gps.x),
                         "y": parseFloat(item.gps.y)
                     },
                     "cost": parseFloat(item.cost),
                     "stars": parseInt(item.stars),
                     "parties": item.parties
                }));
            }
            calendar.baseEvent = new BaseEvent(events);
            calendar.table.updateTable(calendar.baseEvent);
        });
    };
    /**
     *
     * @param {String} saveUrl url
     * @param {Event} newEvent новое событие
     * @function отправляет json с новым событием на сервер
     */
    Calendar.prototype.saveNewEvent = function (saveUrl, newEvent) {
        var cloneCalendar = this;
        $.post(saveUrl ,newEvent,
            function (data){
                cloneCalendar.baseEvent.items.push(new Event(newEvent));
                var newBaseEvent = cloneCalendar.filter.apply(cloneCalendar.baseEvent);
                cloneCalendar.table.updateTable(newBaseEvent);
                console.log("Ответ от сервера");
                console.log(data);
            }, "json");
    };
/**
 * @function - функция, отправляет изменения календаря на сервер, а именно, что пользователь добавил новое событие
 *
 * @return {BaseEvent}
*/
    Calendar.prototype.sendChange = function (newEvent) {
        var jsonBase = JSON.stringify(newEvent);
        ajaxXHR('post','base.json',jsonBase,  function (err) {
            if (!err) {
            } else
            {
                console.log("Отправка произошла");
            }
        });
    };
}(window));