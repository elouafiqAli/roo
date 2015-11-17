serviceDiscovery = {
    server: 'http://127.0.0.1:3001/meteor',
    origin: '127.0.0.1',
    port: 3001,
    type: 'mongoDB'
};

Meteor.publish("messages", function () {
    return Conversation.find({
        $or: [
            { private: {$ne: true} },
            { owner: this.userId }
        ]
    });
});

//Cluster.connect(serviceDiscovery.server);
//Cluster.register("chat");
Cluster.allowPublicAccess("chat");
Meteor.methods({
    ping: function(){
        console.log('sweet!');
    },
    addMessage: function (text, userId, username) {
        // Make sure the user is logged in before inserting a message

        console.log([text, userId, username]);
        Conversation.insert({
            text: text,
            createdAt: new Date(),
            owner: userId,
            username: username
        });
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