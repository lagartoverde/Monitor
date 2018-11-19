import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

export default class Header extends React.Component {
  render() {
    return (
      <Navbar inverse sticky='top'>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Monitor</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="/">
            Vista General
          </NavItem>
          <NavItem eventKey={2} href="/logs">
            Logs
          </NavItem>
          <NavItem eventKey={2} href="/graphs">
            Graphs
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}