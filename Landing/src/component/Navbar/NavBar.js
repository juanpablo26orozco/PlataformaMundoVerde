import React from "react";
import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Container,
  Collapse,
} from "reactstrap";
import { Link } from "react-router-dom";

// Import Logo
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";

//import icon
import FeatherIcon from "feather-icons-react";

import ScrollspyNav from "./Scrollspy";
import { useLocation } from "react-router-dom";


import useNavbarScroll from '../../hooks/useNavbarScroll';

const NavbarPage = ({ navItems }) => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const { navClass, imglight } = useNavbarScroll();
  const targetId = navItems.filter(item => item.idnm).map(item => item.idnm);
  const location = useLocation();

  const toggle = () => setIsOpenMenu(!isOpenMenu);

  // Solo usar ScrollspyNav en la landing ("/" o "/Layout1")
  const isLanding = location.pathname === "/" || location.pathname === "/Layout1";

  return (
    <React.Fragment>
      <nav
        expand="lg"
        fixed="top"
        className={"navbar navbar-expand-lg fixed-top navbar-custom " + navClass}
        id="navbar"
      >
        <Container>
          <NavbarBrand className="logo">
            <Link to="/">
              {imglight ? (
                <img src={logolight} alt="Mundo Verde" height="45" />
              ) : (
                <img src={logodark} alt="Mundo Verde" height="45" />
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
            className=" navbar-collapse"
          >
            {isLanding ? (
              <ScrollspyNav
                scrollTargetIds={targetId}
                scrollDuration="800"
                headerBackground="true"
                activeNavClass="active"
                className="navbar-collapse"
              >
                <Nav navbar className="ms-auto navbar-center" id="mySidenav">
                  {navItems.map((item, key) => (
                    <NavItem
                      key={key}
                      className={item.navheading === "Inicio" ? "active" : ""}
                    >
                      {item.link ? (
                        <Link
                          to={item.link}
                          className={`nav-link ${item.navheading === "Inicio" ? "active" : ""}`}
                          style={{
                            textDecoration: 'none',
                            padding: '0.5rem 1rem'
                          }}
                        >
                          {item.navheading}
                        </Link>
                      ) : (
                        <NavLink
                          className={item.navheading === "Inicio" ? "active" : ""}
                          href={"#" + item.idnm}
                        >
                          {item.navheading}
                        </NavLink>
                      )}
                    </NavItem>
                  ))}
                </Nav>
              </ScrollspyNav>
            ) : (
              <Nav navbar className="ms-auto navbar-center" id="mySidenav">
                {navItems.map((item, key) => (
                  <NavItem
                    key={key}
                    className={item.link === location.pathname ? "active" : ""}
                  >
                    {item.link ? (
                      <Link
                        to={item.link}
                        className={`nav-link ${item.link === location.pathname ? "active" : ""}`}
                        style={{
                          textDecoration: 'none',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        {item.navheading}
                      </Link>
                    ) : (
                      <NavLink
                        href={"#" + item.idnm}
                      >
                        {item.navheading}
                      </NavLink>
                    )}
                  </NavItem>
                ))}
              </Nav>
            )}
          </Collapse>
        </Container>
      </nav>
    </React.Fragment>
  );
};

export default NavbarPage;
