#Littel Design Comments

###Why did we implement a chrome extension
in order to simulate the UX as closely as possible.

###Seperation of services
We used Kadira's "Cluster" for Service Discovery and Load Balancing, that implements its services as a part of your software.

###Spam Detection
Concerning the Spam Detection, we used Akismet API, wrapped with NodeJS
We didn't have enough time to seperate it as a service alone.

Concerning the Monitoring of the Spam and Fraud Alerts, we thoughts of using Mixpanel.com
Even if Mixpanel.com is used for App usage analytics, it can make a first administration dashboard for an inhouse spam solution, if the suspected spam is represented as an event.
Since it is super Powerful when it comes to funnel analysis, direct-messaging users, segmenting audiences and adding rules.

###About notifications
They can be seemlessly implemented using the Meteor's own DDP Pub/Sub.


