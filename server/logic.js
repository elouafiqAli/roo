Meteor.publish("messages", function () {
    return Conversation.find({
        $or: [
            { private: {$ne: true} },
            { owner: this.userId }
        ]
    });
});

Meteor.methods({
    addMessage: function (text) {
        // Make sure the user is logged in before inserting a message
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Conversation.insert({
            text: text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    deleteMessage: function (messageId) {
        var message = Conversation.findOne(messagId);
        if (message.private && message.owner !== Meteor.userId()) {
            // If the message is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }

        Conversation.remove(messageId);
    },
    setChecked: function (taskId, setChecked) {
        var task = Conversation.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error("not-authorized");
        }

        Conversation.update(taskId, { $set: { checked: setChecked} });
    }
});