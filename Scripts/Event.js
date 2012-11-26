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
    }
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
        this.id = createGUID();
        this.gps =  {x: 0, y: 0};
        this.name = "Что-то";
        this.stars =  0;
        this.cost =  0;
        this.parties = [];
        Model.call(this, data);
        if (typeof data.start === "string") {
            this.start = new Date(data.start);
        }
        if (typeof data.start === "string") {
            this.end = new Date(data.end);
        }
        this.isValidate(this);
        this.setLocation(this.location.gps, this.location.nameLocation);
        this.stars = this.leaveMark(this.stars);
    }
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
 * @return {bool}
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
 * @function проверяет корректный ли параметр содержащий Id события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateId = function (event) {
        var errors = [];
        if (typeof event.id !== "string") {
            errors.push({
                "who": "id",
                "isCritical": true,
                "text": "id - это строка содержащая GUID"
            });
        }
        else {
            if (event.id.length !== 36) {
                errors.push({
                    "who": "id",
                    "isCritical": true,
                    "text": "Id = имеет длину ровно 36 символов"
                });
            }
        }
    }
/**
 *
 * @function проверяет корректный ли параметр интервала времени события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateTimeInterval = function (event) {
        var errors = [];
        if (!dateValidator(event.start)) {
            errors.push({
                "who": "timeInterval",
                "isCritical": true,
                "text": "Дата начала события задана не корректно"
            });
        }
        if (!dateValidator(event.end)) {
            errors.push({
                "who": "timeInterval",
                "isCritical": true,
                "text": "Дата конца событий задана не корректно"
            });
        }
        if (errors.length !== 0) {
            if (event.start.getTime() > event.end.getTime())
            errors.push({
                "who": "timeInterval",
                "isCritical": true,
                "text": "Дата начала и конца события перепутаны местами"
            });
        }
        return errors;
    }
/**
 *
 * @function проверяет корректный ли параметры содержащие координаты события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateGps = function (event) {
        var errors = [];

        if (!$.isNumeric(event.gps.x)) {
            errors.push({
                "who": "gps",
                "isCritical": false,
                "text": "Координата X - не число"
            });
        }
        if (!$.isNumeric(event.gps.y)) {
            errors.push({
                "who": "gps",
                "isCritical": false,
                "text": "Координата Y - не число"
            });
        }
        if (errors.length === 2) {
            errors = [{
                "who": "gps",
                "isCritical": false,
                "text": "Обе координаты содержат не числа"
            }];
        }
        return errors;
    }
/**
 *
 * @function проверяет корректный ли параметр названия события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateName = function (event) {
        var errors = [];
        if (event.name.length !== 0 && event.name.length < 100) {
            errors.push({
                "who": "name",
                "isCritical": true,
                "text": "Название события должно содержать имя от 0 до 100 символов"
            });
        }
        return errors;
    }
/**
 *
 * @function проверяет корректный ли параметр рейтинга события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    var isValidateStars = function (event) {
        var errors = [];
        if (!$.isNumeric(event.stars)) {
            errors.push({
                "who": "stars",
                "isCritical": false,
                "text": "В поле должно быть введено число"
            });
        } else {
            if (event.stars < 0 || event.stars > 5) {
                errors.push({
                    "who": "stars",
                    "isCritical": false,
                    "text": "Количество звезд от 0 до 5"
                });
            }
            else {
                if (Math.floor(event.stars) !== event.stars) {
                    errors.push({
                        "who": "stars",
                        "isCritical": false,
                        "text": "Количество звезд целое число"
                    });
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
        if ($.isNumeric(event.cost)) {
            errors.push({
                "who": "cost",
                "isCritical": false,
                "text": "В этом поле должно быть число"
            });
        }
        else {
            if (event.cost < 0) {
                errors.push({
                    "who": "cost",
                    "isCritical": false,
                    "text": "Цена за участие не может быть отрицательной"
                });
            }
        }
        return errors;
    }
/**
 * @function Проверяет объект на корректность
 *
 * @field {Object} event - то что проверяемый
 * @return {Array} сообщение с ошибками.
*/
    Event.prototype.isValidate = function (event) {
        return [].concat(
            isValidateId(event),
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
    }
/**
 * @function Функция, печатающие значение рейтинга в звездочках
 *
 * @return {String} ,*,**,***,****,*****
*/
    Event.prototype.starsToString= function() {
        return new Array(this.stars + 1).join('*');;
    }
}(window));