// The service code that you write is always executed on the server, but can be
// accessed transparently from actions without any knowledge of whether it's on
// the server or client. Fetchr provides an appropriate abstraction so that you
// can fetch (CRUD) the data needed in your stores using the same exact syntax
// on server and client side.
//
// Więcej: http://fluxible.io/guides/data-services.html

var activities = {
    "1": {
        id: "1",
        title: "Pierwsza Aktywność",
        content: "Treść pierwszej aktywności",
        creationTimestamp: 120000,
        startEventTimestamp: 1200200,
        endEventTimestamp: 1500200,
        attachments: ["1", "2", "3"],
        place: "Kraków",
        creatorId: 1,
        points: 100,
        visibilityIds: [1, 2],
        maxVolonteers: 5,
        activeIds: [1],
        isOpen: true,
        privateField: "Test1"
     },
    "2": {
        id: "2",
        title: "Druga Aktywność",
        content: "Treść drugiej aktywności",
        creationTimestamp: 220000,
        startEventTimestamp: 2200200,
        endEventTimestamp: 25000200,
        attachments: ["1", "2", "3"],
        place: "Dobczyce",
        creatorId: 2,
        points: 100,
        visibilityIds: [2],
        maxVolonteers: 5,
        activeIds: [2],
        isOpen: true,
        privateField: "Test2"
     },
    "3": {     
        id: "3",
        title: "Trzecia Aktywność",
        content: "Treść trzeciej aktywności",
        creationTimestamp: 320000,
        startEventTimestamp: 3200200,
        endEventTimestamp: 3500200,
        attachments: ["1", "2", "3"],
        place: "Myślenice",
        creatorId: 1,
        points: 100,
        visibilityIds: [1],
        maxVolonteers: 10,
        activeIds: [1],
        isOpen: false,
        privateField: "Test3"
     },
}

var public_attrs = [
  'id',
  'title',
  'content',
  'creationTimestamp',
  'startEventTimestamp',
  'endEventTimestamp',
  'attachments',
  'place',
  'creatorId',
  'points',
  'visibilityIds',
  'maxVolonteers',
  'activeIds',
  'isOpen'
]

var private_attrs = [
    'privateField'
]

module.exports = {
    name: 'activity',
    // at least one of the CRUD methods is required
    read: function(req, resource, params, config, callback) {
      // zobacz /app/pages/volonteers/services
      var user = req.user || config.user
      // Flaga przywilejów administratora
      var is_admin = user && user.is_admin
      // Flaga właściciela profilu
      var is_owner = false;
      


      var activity
      if(params.id) {
        activity = activities[params.id];
        is_owner = (user && (activity.creatorId == user.id)) || config.is_owner;
      }

      if(activity) {
        var model = {}
        // Tablica parametrów uprawnionych do odczytu
        var attrs = public_attrs

        if(is_admin || is_owner) {
          attrs = attrs.concat(private_attrs)
        }

        attrs.forEach(function(attr){
          model[attr] = activity[attr]
        })

        callback(null, model);
      } else {
        callback("404")
      }
    },

    create: function(req, resource, params, body, config, callback) {
        activities.push({
            id: params.id,
            threadID: params.threadID,
            threadName: params.threadName,
            authorName: params.authorName,
            text: params.text,
            timestamp: params.timestamp
        });
        callback(null, _messages);
    }

    // update: function(resource, params, body, config, callback) {},
    // delete: function(resource, params, config, callback) {}

};
