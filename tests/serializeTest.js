test("Create object Event using Model constructor", function () {
    "use strict";

    var item = new Collection([{"name":"pewpew","start":"2012-11-07T10:18:39.207Z","end":"2012-11-07T10:18:39.207Z"}])
                    .serialise();

    ok(item === '[{"name":"pewpew","start":"2012-11-07T10:18:39.207Z","end":"2012-11-07T10:18:39.207Z"}]');
});

''