/*global Model: true*/
(function (toExport) {
    "use strict";
    /**
     * function генерирует случайный hex из четырех символов
     * @return {String}
     */
    var randomHex4 = function ()
    {
        return Math.floor(
            Math.random() * 0x10000 /* 65536 */
        ).toString(16);
    };
    /**
     * function генерирует guid в виде строки
     * @return {String}
     */
    var createGUID = function () {
        return (
            randomHex4() + randomHex4() + "-" +
                randomHex4() + "-" +
                randomHex4() + "-" +
                randomHex4() + "-" +
                randomHex4() + randomHex4() + randomHex4()
            );
    };
/**
 * Создает новое событие в календаре
 * @class Событие в календаре
 * @augments Model 
 *
 * @field {Number} - id Индификационный номер объекта по идее тут должен быть GUID
 * @field {Object} - location объект содержащий локационные данные о событии + название события
 * @field {Number} - реитинг
 * @field {Number} - Цена посещения
*/
    var Event = function Event(data) {
        "use strict";
        if (typeof data === "undefined") {
            Model.call(this, {
                "start": new Date(),
                "end" : new Date(),
                "gps" : {
                    "x": 0,
                    "y": 0
                },
                "name" : "Что-то",
                "stars" : 0,
                "cost" : 0,
                "parties" : [],
                "id" : createGUID()
            });
            return this;
        }
        var eventDefaultVal = new Event();
        Model.call(this, eventDefaultVal);
        Model.call(this, data);
        //Костылек
        var newEvent = this;
        Event.isValidate(data).forEach(function(error) {
            newEvent[error.who] = eventDefaultVal[error.who];
        });
        return this;
    };

    toExport.Event = Event;
    Event.prototype = Object.create(Model.prototype, {
        constructor: {
            value: Event,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
/**
 * @function Функция, проверяющая корректность даты
 *
 * @return {Boolean}
*/
    var dateValidator = function (date) {
        "use strict";
        if (Object.prototype.toString.call(date) === "[object Date]") {
            if (!isNaN(date.getTime())) {
                return true;
            }
        }
        return false;
    };
/**
 *
 * @function проверяет корректный ли параметр интервала времени события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateTimeInterval = function (event) {
        var errors = [];
        if (!event.start || !dateValidator(event.start)) {
            errors.push( new FieldsError("start", "Дата начала события задана не корректно", true));
        }
        if (!event.end || !dateValidator(event.end)) {
            errors.push( new FieldsError("end", "Дата конца событий задана не корректно", true));
        }
        if (errors.length === 0) {
            if (event.start.getTime() > event.end.getTime())
            {
                errors.push( new FieldsError("start", "Дата начала и конца события перепутаны местами", true));
                errors.push( new FieldsError("end", "Дата начала и конца события перепутаны местами", true));
            }
        }

        return errors;
    };
/**
 *
 * @function проверяет корректный ли параметры содержащие координаты события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateGps = function (event) {
        var errors = [];

        if (!event.gps || !$.isNumeric(event.gps.x)) {
            errors.push( new FieldsError("gps.x", "Координата X - не число"));
        }
        if (!event.gps || !$.isNumeric(event.gps.y)) {
            errors.push( new FieldsError("gps.y", "Координата Y - не число"));
        }
        return errors;
    };
/**
 *
 * @function проверяет корректный ли параметр названия события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateName = function (event) {
        var errors = [];
        if (event.name && (event.name.length === 0 || event.name.length > 100)) {
            errors.push( new FieldsError("name", "Название события должно содержать имя от 1 до 100 символов", true));
        }
        return errors;
    };
/**
 *
 * @function проверяет корректный ли параметр рейтинга события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateStars = function (event) {
        var errors = [];
        if (!event.stars || !$.isNumeric(event.stars)) {
            errors.push( new FieldsError("stars", "В поле должно быть введено число"));
        } else {
            if (event.stars < 0 || event.stars > 5) {
                errors.push( new FieldsError("stars", "Количество звезд от 0 до 5"));
            }
            else {
                if (Math.floor(event.stars) !== event.stars) {
                    errors.push( new FieldsError("stars", "Количество звезд целое число"));
                }
            }
        }
        return errors;
    };
/**
 *
 * @function проверяет корректный ли параметр стоимости посещения
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateCost = function (event) {
        var errors = [];
        if (!event.cost || !$.isNumeric(event.cost)) {
            errors.push( new FieldsError("cost", "В этом поле должно быть число"));
        }
        else {
            if (event.cost < 0) {
                errors.push( new FieldsError("cost", "Цена за участие не может быть отрицательной"));
            }
        }
        return errors;
    };
/**
 * @function Проверяет объект на корректность
 *
 * @field {Object} event - то что проверяемый
 * @return {Array} сообщение с ошибками.
*/
    Event.isValidate = function (event) {
        return [].concat(
            isValidateTimeInterval(event),
            isValidateName(event),
            isValidateGps(event),
            isValidateCost(event),
            isValidateStars(event)
        );
    };
/**
 * @function Функция, печатающие значение локационных данных объекта
 *
 * @return {String} [location], (x, y) 
*/
    Event.prototype.locationToString = function() {
        return this.location.nameLocation + ", (" + this.location.gps.x + ";" + this.location.gps.y + ")";
    };
/**
 * @function Функция, печатающие значение рейтинга в звездочках
 *
 * @return {String} ,*,**,***,****,*****
*/
    Event.prototype.starsToString= function() {
        return new Array(this.stars + 1).join('*');
    };
}(window));