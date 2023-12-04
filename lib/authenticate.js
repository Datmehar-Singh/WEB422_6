import 'bootstrap/dist/css/bootstrap.min.css';
import {jwtDecode} from 'jwt-decode';

export async function authenticateUser(user, password) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ userName: user, password: password }),
      headers: {
        'content-type': 'application/json',
      },
    });
    
    const data = await res.json();
  
    if (res.status === 200) {
      setToken(data.token);
      // console.log("hello")
      return true;
    } else {
      throw new Error(data.message);
    }
  }

  function setToken(token) {
    
    localStorage.setItem('access_token', token);
  }

  export function getToken() {
    // const token = localStorage.getItem('access_token')
    // console.log(jwt_decode())
    try {
      if(localStorage.getItem('access_token'))
      {
        return localStorage.getItem('access_token');
      }
      else
      return null;
      
    } catch (err) {
      return null;
    }
  }

  export function removeToken() {
    localStorage.removeItem('access_token');
  }

  export function getUser(){
    return localStorage.getItem('user')
  }

 



  export function readToken() {
    try {
      const token = getToken();
      if (token) {
        console.log(jwtDecode(token));
        return jwtDecode(token);
      } else {
        console.log('Token is null or undefined');
        return null; // or handle this case according to your needs
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      return null; // or handle decoding errors according to your needs
    }
  }
  


export function isAuthenticated() {
    const token = readToken();
    return token ? true : false;
  }

  export async function registerUser(user, password, password2) {
    const requestBody = JSON.stringify({ userName: user, password: password, password2: password2 });
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: 'POST',
      body: requestBody,
      headers: {
        'content-type': 'application/json',
      },
    });
  
    const data = await res.json();
  
    if (res.status === 200) {
      return true;
    } else {
      throw new Error(data.message);
    }
  }
  