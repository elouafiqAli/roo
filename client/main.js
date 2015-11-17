// This code only runs on the client
var chatConnection = Cluster.discoverConnection("chat");
Meteor.subscribe("messages");

Template.body.helpers({
    messages: function () {
        if (Session.get("hideCompleted")) {
            // If hide completed is checked, filter messages
            return Conversation.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
        } else {
            // Otherwise, return all of the messages
            return Conversation.find({}, {sort: {createdAt: -1}});
        }
    },
    hideCompleted: function () {
        return Session.get("hideCompleted");
    },
    incompleteCount: function () {
        return Conversation.find({checked: {$ne: true}}).count();
    }
});

Template.body.events({
    "submit .new-message": function (event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        var text = event.target.text.value;

        // Insert a message into the collection
        chatConnection.call("addMessage", text, Meteor.userId(), Meteor.user().username, function(err, result){
            if (err) throw err;
        });

        // Clear form
        event.target.text.value = "";
    },
    "change .hide-completed input": function (event) {
        Session.set("hideCompleted", event.target.checked);
    }
});

Template.message.helpers({
    isNotOwner: function () {
        return !(this.owner === Meteor.userId());
    }
});

Template.message.events({
    "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        chatConnection.call("setChecked", this._id, ! this.checked, function(err, result){
            if (err) throw err;
        });
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});