var React = require('react'),
    Fluxible = require('fluxible'),
    fetchrPlugin = require('fluxible-plugin-fetchr'),
    RouteStore = require('fluxible-router').RouteStore

var routes = require('./routes')
var ApplicationStore = require('./stores/ApplicationStore')
var VolonteerStore = require('./stores/Volonteer')
var VolonteersStore = require('./stores/Volonteers')
var ActivityStore = require('./stores/Activity')
var ProfileCommentsStore = require('./stores/ProfileCommentsStore')
var passportPlugin = require('./plugins/passportPlugin')

// Instancja kontenera aplikacji Fluxible
var app = new Fluxible({
    component: React.createFactory(require('./components/Application.jsx')),
    stores: [
        RouteStore.withStaticRoutes(routes),
        ApplicationStore,
        VolonteerStore,
        VolonteersStore,
        ProfileCommentsStore,
        ActivityStore
    ]
});

app.plug(fetchrPlugin())
app.plug(passportPlugin())

module.exports = app
