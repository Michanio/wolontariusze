
'use strict'
var createStore  = require('fluxible/addons').createStore

var ActivityStore = createStore({
  storeName: 'Activity',
  handlers: {
    'LOAD_ACTIVITY': 'load',
    'PRECREATE_ACTIVITY': 'precreate',
    'ACTIVITY_UPDATED': 'update',
    'JOINT_CREATED': 'join',
    'JOINT_DELETED': 'leave',
  },

  initialize: function () {
    this.activity = {
      title: '',
      startEventTimestamp: '',
      duration: '',
      place: '',
      content: '',
      maxVolunteers: 5
    }
    this.volunteers = []
    this.invalidSnackBar = ''
  },

  load: function(data) {
    var volunteers = data.volunteers || []
    delete data.volunteers
    this.activity = data
    this.volunteers = volunteers
    this.emitChange()
  },
  
  precreate: function() {
    this.initialize()
    this.emitChange()
  },
  
  join: function(joint) {
    // Dodaj obiekt połączenia
    for (var i = 0; i < this.volunteers.length; i++) {
      if (this.volunteers[i].user_id == joint.user_id)
        return
    }
    this.volunteers.push(joint)
    this.emitChange()
  },

  leave: function(id) {
    // Usuń obiekt połączenia
    this.volunteers = this.volunteers.filter(function(volunteer) {
      return volunteer.id !== id
    })
    this.emitChange()
  },
  
 create: function(data) {
    // TODO
    //this.rehydrate(data)
    this.emitChange()
  },


  update: function(data) {
    this.activity = data
    this.emitChange()
  },

  getState: function () {
    return {
      activity: this.activity,
      volunteers: this.volunteers,
      invalidSnackBar: this.invalidSnackBar
    }
  },

  dehydrate: function () {
    return this.getState()
  },

  rehydrate: function (state) {
    this.activity = state.activity
    this.volunteers = state.volunteers
    this.invalidSnackBar = state.invalidSnackBar
  }

})

ActivityStore.attributes = function() {
  return [
    'id',
    'title',
    'content',
    'creationTimestamp',
    'editionTimestamp',
    'startEventTimestamp',
    'duration',
    'place',
    'is_urgent',
    'creator',
    'editor',
    'maxVolunteers',
  ]
}

module.exports = ActivityStore
