var React = require('react')
var NavLink = require('fluxible-router').NavLink
var ReactMarkdown = require('react-markdown');

var ActivityStore = require('../stores/Activity')
var Authentication = require('./Authentication.jsx')
var ActivityEdit = require('./ActivityEdit.jsx')

var TimeService = require('../modules/time/TimeService.js')

var Tabs = require('material-ui/lib/tabs/tabs')
var Tab =  require('material-ui/lib/tabs/tab')
var DateTime = require('react-datetime');
var AutoSuggest = require('react-autosuggest');

var actions = require('../actions')
var updateAction = actions.updateActivity

var Activity = React.createClass({
  
  render: function () {
    var activityTitle = this.props.context.getStore(ActivityStore).getState().title;
    var content;
    if (activityTitle) {
      content = <ActivityTabs user={this.user()} context={this.props.context} />
    } else {
      content = <h1>Ta aktywność nie istnieje</h1>
    }
    return ( 
      <div>
        {content}
       </div>
    )
  },
  
  user: function() {
    return this.props.context.getUser()
  },
  
  user_name: function() {
    return this.user() && this.user().first_name
  }

})

var ActivityTabs = React.createClass({
    
  getInitialState: function () {
      return this.props.context.getStore(ActivityStore).getState()
  },

  _changeListener: function() {
    this.setState(this.props.context.getStore(ActivityStore).getState());
  },

  componentDidMount: function() {
    this.props.context.getStore(ActivityStore).addChangeListener(this._changeListener);
  },
  
  update: function() {
    this.props.context.executeAction(updateAction, this.state)
  },
  onAcceptButtonClick: function () {   
    var modifiedState = this.state ;
    modifiedState.activeVolonteers.push( {
      id: this.props.user.id,
      name: this.props.user.first_name+" "+this.props.user.last_name,
      email: this.props.user.email
    })
    modifiedState.updateEmail = false;
    this.setState(modifiedState);
    this.update();   
  },
  onCancelButtonClick: function () {
    var modifiedState = this.state ;
    for (var i = 0; i < modifiedState.activeVolonteers.length; i++) {
        if (modifiedState.activeVolonteers[i].id == this.props.user.id) {
            modifiedState.activeVolonteers.splice(i,1);
        }         
    }
    modifiedState.updateEmail = false;
    this.setState(modifiedState);   
    this.update();
  },
  
    
  render: function () {
  
    var user = this.props.user
    var is_owner = user && user.id === this.state.creatorId
    var is_admin = user && user.is_admin;
    
    var editLink
    if(is_admin) {
      editLink = <div className="adminToolbar">
        <NavLink href={"/aktywnosc/"+ this.state.id +"/edytuj"}>Edytuj</NavLink>
      </div>
    }
    
    var priority;
    if (this.state.is_urgent && this.state.is_urgent == true) {
      priority = "PILNE"
    } else {
      priority = "NORMALNE"
    }
    
    var activeVolonteersList = []
    var activeVolonteersIds = []
    if (this.state.activeVolonteers) {
        activeVolonteersList = this.state.activeVolonteers.map (function (volonteer) {
            return (
                <span className="volonteerLabel"><a href={'/wolontariusz/'+volonteer.id}>{volonteer.name}</a></span>
            )
        })
        activeVolonteersIds = this.state.activeVolonteers.map (function (volonteer) {
          return volonteer.id
        })
    }

    
    var buttons = [];
    //acceptButton
    if (user &&
        ( ( activeVolonteersIds && activeVolonteersIds.length < this.state.maxVolonteers) || 
            this.state.maxVolonteers == 0) &&
        activeVolonteersIds.indexOf(user.id) == -1 ) {
        buttons.push(<input type="button" onClick={this.onAcceptButtonClick} value="Zgłaszam się" />)
    }
    
    //canceButton
    if (user &&
        activeVolonteersIds.indexOf(user.id) !== -1 ) {
        buttons.push(<input type="button" onClick={this.onCancelButtonClick} value="Wypisz mnie" />)
    }
    
    
    var tabs = [
        <Tab label="Opis" >
            {editLink}
            <h2>{this.state.title}</h2>
            <b>Dodano:</b> {TimeService.showTime(this.state.creationTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+this.state.creator.id}>{this.state.creator.name}</a></span>
            <br></br>
            <b>Ostatnia edycja:</b> {TimeService.showTime(this.state.editionTimestamp)} przez <span className="volonteerLabel"><a href={'/wolontariusz/'+this.state.editor.id}>{this.state.editor.name}</a></span>
            <br></br>
            <b>Czas rozpoczęcia:</b> {TimeService.showTime(this.state.startEventTimestamp)}  <b>Czas trwania:</b> {this.state.duration}
            <br></br>
            <b>Miejsce wydarzenia:</b> {this.state.place}
            <br></br>
            <b>Prorytet:</b> {priority}
            <br></br>
            <ReactMarkdown source={this.state.content} />
            <br></br>
            <b>Wolontariusze, którzy biorą udział:</b> {activeVolonteersList}
            <br></br>
            <b>Limit(maksymalna liczba wolontariuszy):</b> {this.state.volonteersLimit}
            <br></br>
            {buttons}
        </Tab>
    ]
    
    return (
        <Tabs tabItemContainerStyle={{'backgroundColor': 'rgba(0,0,0,0.1)'}}>
            {tabs}
        </Tabs>
    )
  }

})

/* Module.exports instead of normal dom mounting */
module.exports = Activity
