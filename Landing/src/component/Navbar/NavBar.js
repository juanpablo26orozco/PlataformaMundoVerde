import React from "react";
import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  Container,
  Collapse,
} from "reactstrap";
import { Link } from "react-router-dom";

// Import Logo
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";

//import icon
import FeatherIcon from "feather-icons-react";

import { useLocation } from "react-router-dom";


import useNavbarScroll from '../../hooks/useNavbarScroll';

const NavbarPage = ({ navItems }) => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const { navClass, imglight } = useNavbarScroll();
  const location = useLocation();

  const toggle = () => setIsOpenMenu(!isOpenMenu);



  return (
    <React.Fragment>
      <nav
        expand="lg"
        fixed="top"
        className={"navbar navbar-expand-lg fixed-top navbar-custom " + navClass}
        id="navbar"
      >
        <Container fluid style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
          <NavbarBrand className="logo" style={{ marginRight: 'auto' }}>
            <Link to="/">
              {imglight ? (
                <img src={logolight} alt="Mundo Verde" height="80" />
              ) : (
                <img src={logodark} alt="Mundo Verde" height="80" />
              )}
            </Link>
          </NavbarBrand>
          <NavbarToggler onClick={toggle}>
            <i>
              <FeatherIcon icon="menu" />
            </i>
          </NavbarToggler>
          <Collapse
            id="navbarCollapse"
            isOpen={isOpenMenu}
            className="navbar-collapse"
          >
            <Nav navbar className="ms-auto d-flex align-items-center" id="mySidenav" style={{ gap: '0.5rem' }}>
              {navItems.map((item, key) => (
                <NavItem
                  key={key}
                  className={
                    (item.link && item.link.startsWith('/#') && location.pathname === "/") ||
                    (item.link && !item.link.startsWith('/#') && item.link === location.pathname) ||
                    (item.navheading === "Inicio" && location.pathname === "/")
                      ? "active"
                      : ""
                  }
                  style={{ margin: '0 0.2rem' }}
                >
                  {item.link ? (
                    item.link.startsWith('/#') ? (
                      <a
                        href={item.link}
                        className="nav-link"
                        style={{
                          textDecoration: 'none',
                          padding: '0.6rem 1rem',
                          fontWeight: '500',
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.navheading}
                      </a>
                    ) : (
                      <Link
                        to={item.link}
                        className={`nav-link ${(item.link === location.pathname) ? "active" : ""}`}
                        style={{
                          textDecoration: 'none',
                          padding: '0.6rem 1rem',
                          fontWeight: (item.link === location.pathname) ? '600' : '500',
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.navheading}
                      </Link>
                    )
                  ) : (
                    <a
                      href={`#${item.idnm}`}
                      className="nav-link"
                      style={{
                        textDecoration: 'none',
                        padding: '0.6rem 1rem',
                        fontWeight: '500',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.navheading}
                    </a>
                  )}
                </NavItem>
              ))}
            </Nav>
          </Collapse>
        </Container>
      </nav>
    </React.Fragment>
  );
};

export default NavbarPage;
