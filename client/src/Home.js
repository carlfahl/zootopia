import React from 'react';
import jumbotron from 'react-bootstrap';

var Home = function (props) {
  return (
    <Jumbotron>
      <h1>Welcome to Zootopia</h1>
      <Button onClick={() => props.onClick('viewAll', null)} bsStyle='primary'>
        View all Animals
      </Button>
      <Button onClick={() => props.onClick('postNew', null)} bsStyle='primary'>
        Add an Animal
      </Button>
    </Jumbotron>
  )
}
