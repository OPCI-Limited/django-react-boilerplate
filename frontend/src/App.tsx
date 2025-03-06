import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EventProvider } from "./context/EventContext";

import { NavBar } from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import { RouteList } from './routes';

// import Container from "react-bootstrap/Container";
// import Button from 'react-bootstrap/Button';
// import Card from "react-bootstrap/Card";
// import CardGroup from 'react-bootstrap/CardGroup';
// import Alert from 'react-bootstrap/Alert';
// import Spinner from 'react-bootstrap/Spinner';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <EventProvider>
        <NavBar/>
        <RouteList/>
      </EventProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
