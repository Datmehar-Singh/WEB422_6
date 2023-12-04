import { useState } from 'react';
import { Button, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '../lib/userData';
import { getToken, removeToken,readToken} from '../lib/authenticate';
 // Import readToken and removeToken functions

const MainNav = () => {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [isExpanded, setIsExpanded] = useState(false);

  const logout = () => {
    setIsExpanded(false);
    removeToken(); // Invoke removeToken function from authentication lib
    router.push('/login'); // Redirect user to the "/login" page
  };



  const token = readToken(); // Retrieve the token value using readToken function
  console.log(token);

  let username = "hello";
  if(token)
  {
  username = token.userName;
  console.log(username)
  }
  else{
    username = "USER"
  }

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsExpanded(false);
    const searchField = e.target.elements.search.value;
    
    try {
      setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
      router.push(`/artwork?title=true&q=${searchField}`);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        expanded={isExpanded}
        className="bg-dark navbar-dark fixed-top"
      >
        {/* ... */}
        <Navbar.Toggle
          onClick={() => setIsExpanded(!isExpanded)}
          aria-controls="basic-navbar-nav"
        />
        {/* ... */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="basic-navbar-nav">
            {/* ... */}
            {token ? (
              <>
                {/* Show when user is logged in */}
                <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="basic-navbar-nav">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link
                active={router.pathname === "/"}
                onClick={() => setIsExpanded(false)}
              >
                Home
              </Nav.Link>
            </Link>
            <Link href="/search" passHref legacyBehavior>
              <Nav.Link
                active={router.pathname === "/search"}
                onClick={() => setIsExpanded(false)}
              >
                Advanced Search
              </Nav.Link>
            </Link>
            &nbsp;
            <Form className="d-flex nav-form" onSubmit={handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                name="search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success" type="submit">
                Search
              </Button>
            </Form>
            &nbsp;
          
            <NavDropdown title={username||"User Name"} id="basic-nav-dropdown">
              <Link href="/favourites" passHref legacyBehavior>
                <Nav.Link active={router.pathname === "/favourites"}>
                  <NavDropdown.Item
                    href="#action/3.1"
                    onClick={() => setIsExpanded(false)}
                  >
                    Favourites
                  </NavDropdown.Item>
                </Nav.Link>
              </Link>
              <Link href="/history" passHref legacyBehavior>
                <Nav.Link active={router.pathname === "/history"}>
                  <NavDropdown.Item
                    href="#action/3.2"
                    onClick={() => setIsExpanded(false)}
                  >
                    Search History
                  </NavDropdown.Item>
                </Nav.Link>
              </Link>
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>

            </NavDropdown>
            
          </Nav>
        </Navbar.Collapse>
              </>
            ) : (
              <>
                {/* Show when user is not logged in */}
                <Nav className="me-auto">
                  <Link href="/register" passHref legacyBehavior> 
                    <Nav.Link active={router.pathname === '/register'} onClick={() => setIsExpanded(false)}>
                      Register
                    </Nav.Link>
                  </Link>
                  <Link href="/login" passHref legacyBehavior>
                    <Nav.Link active={router.pathname === '/login'} onClick={() => setIsExpanded(false)}>
                      Login
                    </Nav.Link>
                  </Link>
                </Nav>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <br />
      <br />
    </>
  );
};

export default MainNav;
