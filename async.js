function asyncXHR(method, url, data, writeToFile) {
    'use strict';
  /* var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.addEventListener('readystatechange', function () {
       if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                readToFile(xhr.responseText);
            } else {
                console.log("error: status != 200 ");
            }
       }
    });
    xhr.send(data);  
    readToFile('test'); */
}

readToFile = function (text) {
    'use strict';
    var newEvents, key;
    text = '[{"name": "Pewpe", "start": "11.12.2012", "end": "13.12.2012"},{"name": "Pewpe", "start": "11.12.2012", "end": "13.12.2012"}]';
    newEvents = JSON.parse(text);
    for (key in newEvents) {
        var OneEvents = new Event(newEvents[key]);
        hash.add(OneEvents);
    }
    template ("oneEvent", hash);
}
