var updateUsername = function($input) {

    var value = $.trim($input.val());
    if (!value) {
        return;
    }

    if (value.length > 14) {
        alert('Too long nickname');
        return;
    }

    var existing = Meteor.users.findOne({username: value, _id: {$ne: Meteor.userId()}});

    if (existing) {
        alert('Nickname used by another user :(');
        return;
    }

    Meteor.users.update({_id: Meteor.userId()}, {
        $set: {
            username: value
        }
    });

    Session.set("editing_username", false);
};

Template.username_dialog.rendered = function() {

    if (this.$input) {
        // Prevent dialog reinit.
        return;
    }

    var $input = this.$input = $(this.find("#username-input"));

    var $dialog = $(this.find("#username-dialog"));

    $dialog.dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        show: {
            effect: "scale",
            duration: 500
        },
        hide: {
            effect: "scale",
            duration: 500
        },
        open: function() {
            $input.focus();
            $input.select();
        },
        buttons: [
            {
                text: "Update",
                click: function() {
                    updateUsername($input);
                }
            }
        ],
        close: function( event, ui ) {
            Session.set("editing_username", false);
        }
    });

    Deps.autorun(function() {
        var show = Session.get("editing_username");
        var opened = $dialog.dialog("isOpen");
        if (show) {
            if (!opened) {
                $dialog.dialog('open');
            }
        } else {
            if (opened) {
                $dialog.dialog('close');
            }
        }
    });
};

Template.username_dialog.events({
    'keyup #username-input': function(evt, tmpl) {
        if (evt.keyCode === 13) {
            updateUsername(tmpl.$input);
        }
    }
});