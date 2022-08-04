import React, { Component } from 'react';

export class Redirect extends Component {
  constructor(props) {
    super();
    this.state = { ...props };
  }

  componentDidMount() {
    const { link } = this.state;
    window.location = link;
  }

  render() {
    return <section>Redirecting...</section>;
  }
}

export default Redirect;
