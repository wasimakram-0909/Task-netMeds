import React from 'react'
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faHome } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';

function Layout({ children }) {
    // const marg = { margin: 1 }
    return (
        <div>
            <Navbar expand="lg" className="custom-nav">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/"><h6 className="navLink">Home</h6> </Nav.Link>
                        <Nav.Link as={Link} to="/forms"> <h6 className="navLink">Forms</h6></Nav.Link>
                        <Nav.Link as={Link} to="/records"> <h6 className="navLink">Records</h6></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div>
                {children}
            </div>
        </div>
    )
}

export default Layout
