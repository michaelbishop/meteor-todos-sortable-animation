var reinit = function() {

    // Clear base on startup.

    Todos.remove({});
    Lists.remove({});

    // Remove old chats, leaving last 200 items.
    var lastChat = Chat.findOne({}, {
        sort: {timestamp: -1},
        limit: 1,
        skip: 200
    });
    if (lastChat) {
        Chat.remove({
            timestamp: {
                $lt: lastChat.timestamp
            }
        });
    }

    if (Lists.find().count() === 0) {
        var data = [
            {name: "Meteor Principles",
                contents: [
                    ["Data on the Wire", "Simplicity", "Better UX", "Fun"],
                    ["One Language", "Simplicity", "Fun"],
                    ["Database Everywhere", "Simplicity"],
                    ["Latency Compensation", "Better UX"],
                    ["Full Stack Reactivity", "Better UX", "Fun"],
                    ["Embrace the Ecosystem", "Fun"],
                    ["Simplicity Equals Productivity", "Simplicity", "Fun"]
                ]
            },
            {name: "Languages",
                contents: [
                    ["Lisp", "GC"],
                    ["C", "Linked"],
                    ["C++", "Objects", "Linked"],
                    ["Python", "GC", "Objects"],
                    ["Ruby", "GC", "Objects"],
                    ["JavaScript", "GC", "Objects"],
                    ["Scala", "GC", "Objects"],
                    ["Erlang", "GC"],
                    ["6502 Assembly", "Linked"]
                ]
            },
            {name: "Favorite Scientists",
                contents: [
                    ["Ada Lovelace", "Computer Science"],
                    ["Grace Hopper", "Computer Science"],
                    ["Marie Curie", "Physics", "Chemistry"],
                    ["Carl Friedrich Gauss", "Math", "Physics"],
                    ["Nikola Tesla", "Physics"],
                    ["Claude Shannon", "Math", "Computer Science"]
                ]
            }
        ];

        for (var i = 0; i < data.length; i++) {
            var list_id = Lists.insert({
                name: data[i].name,
                order: i,
                good: true
            });
            for (var j = 0; j < data[i].contents.length; j++) {
                var info = data[i].contents[j];
                Todos.insert({list_id: list_id,
                    text: info[0],
                    order: j,
                    tags: info.slice(1),
                    good: true});
            }
        }
    }

    if (Tiles.find().count() === 0) {
        for (var j = 0; j < 200; j++) {
            Tiles.insert({
                order: j,
                label: j
            });
        }
    }

};

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {

    reinit();

    Meteor.setInterval(reinit, 1000 * 60 * 30);
});
