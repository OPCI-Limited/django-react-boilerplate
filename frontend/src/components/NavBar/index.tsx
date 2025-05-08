import { useContext } from 'react';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { CanAccess } from '../CanAccess';

export function NavBar() {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">MyApp</Navbar.Brand>
        {isAuthenticated && (
          <Navbar.Brand as={Link} to="/events">Events</Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/*<Nav.Link as={Link} to="/">Home</Nav.Link>*/}
            {/*<Nav.Link as={Link} to="/register">Register</Nav.Link>*/}
            {/*<Nav.Link as={Link} to="/login">Login</Nav.Link>*/}

            <CanAccess permissions={['users.list']}>
              <Nav.Link as={Link} to="/users">Users</Nav.Link>
            </CanAccess>

            <CanAccess permissions={['metrics.list']}>
              <Nav.Link as={Link} to="/metrics">Metrics</Nav.Link>
            </CanAccess>
          </Nav>

          <Nav className="ml-auto">
            {isAuthenticated ? (
              <>
                <NavDropdown title={user?.email} id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Divider/>
                  <NavDropdown.Item
                    as={Button}
                    onClick={() => signOut()}
                    data-testid="logout-button"
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button variant="outline-primary link" href="/login" style={{ maxWidth: '150px', width: '100%' }}>Login</Button>
                <Button variant="outline-secondary link" href="/register" className="ms-2" style={{ maxWidth: '150px', width: '100%' }}>Register</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
