import { Container } from "react-bootstrap";
import React from "react";
import MainNav from "./MainNav";
const Layout = (props) => {
  return (
    <>
      <MainNav />
      <br />
      <Container>{props.children}</Container>
      <br />
    </>
  );
};

export default Layout;
