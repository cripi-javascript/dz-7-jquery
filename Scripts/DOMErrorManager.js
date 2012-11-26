(function (toExport) {
    "use strict";
/**
 * @class * Класс содержит обработчики ошибок при изменении элементов DOM
*/
    var DOMErrorManager = function (errorClassName) {
        this.errorClassName = errorClassName;
    }
    toExport.DOMErrorManager = DOMErrorManager;
/**
 * @function Обработчик ошибок объекта, содержащий начальное и конечное время
 * @param {HTMLDivElement} хранилище, содержащее таймер.
*/
    DOMErrorManager.prototype.isFieldWithError = function (element) {
        var $lastElement = $("." + this.errorClassName);
        return $lastElement.length === 0;
    }
/**
 * @function Устанавливает в передаваемый элемент ошибку
 *
 * @param {jQuery} $element на что устанавливаем ошибку.
 * @param {String} text текст ошибки.
*/
    DOMErrorManager.prototype.setTextError = function ($element, text) {
        var $newError = $("<span />",{
            "text": text,
            "class": this.errorClassName
        });
        $element.append($newError);
    }
/**
 * @function Стереть ошибку
 *
 * @param {HTMLDivElement} element на что устанавливаем ошибку.
*/
    DOMErrorManager.prototype.removeTextError = function ($element) {
        $element.find("."+this.errorClassName).remove();
    }
/**
* @function Изменить или стереть ошибку в зависимости от того есть она или нет
*
* @param {HTMLDivElement} element хранилище элемента
* @param {HTMLDivElement} element текст сообщения с ошибкой
*/
    DOMErrorManager.prototype.changeTextError = function ($element, errorText) {
        var currentErrorState = this.isFieldWithError($element);
        if (errorText === "") {
            if (currentErrorState) {
                this.removeTextError(element);
            }
        }
        else
        {
            if (currentErrorState) {
                this.removeTextError($element);
            }
            this.setTextError($element, errorText);
        }
    }
}(window));