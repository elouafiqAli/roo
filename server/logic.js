client_identifiers = {
    ip_address : '127.0.0.1',
    http_headers : undefined
};

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

        var check = {
            user_ip : client_identifiers.ip_address,
            user_agent : client_identifiers.http_headers['user-agent'],
            referrer : '',
            is_test: 1,
            comment_type : 'message',
            comment_author : username,
            comment_content : text
        };

        var isSpam = Meteor.call('akismetCheckSpam', check);
        console.log(isSpam);
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

function vanguard(connection){
    var identifiers= {
        ip_address: connection.clientAddress,
        http_headers: connection.httpHeaders
    };
    console.log(identifiers);
    client_identifiers = identifiers;
}
Meteor.onConnection(vanguard);