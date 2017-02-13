import React from 'react';
import Home from './Home';
import AnimalsContainer from './AnimalsContainer';
import PostAnimalContainer from './PostAnimalContainer';
import EditAnimalContainer from './EditAnimalContainer';

var App = React.createClass({
  getInitialState: function () {
    return (
      {activeComp: 'home',
       activeId: null}
    );
  },
  updateActiveComp: function (comp, id) {
    this.setState({activeComp: comp, activeId: id});
  },
  renderProperComp: function () {
    if (this.state.activeComp === 'home') {
      <Home updateActiveComp={this.updateActiveComp} />
    } else if (this.state.activeComp === 'viewAll') {
      <AnimalsContainer />
    } else if (this.state.activeComp === 'postNew') {
      <PostAnimalContainer />
    } else if (this.state.activeComp === 'edit') {
      <EditAnimalContainer />
    } else {
      return (<div>Loading...</div>)
    }
  },
  render: function () {
    return (
      <div>
        {this.renderProperComp()}
      </div>
    )
  }
});

export default App;
