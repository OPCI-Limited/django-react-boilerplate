import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { NotificationsProvider } from './context/Notification';

import { NavBar } from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
// import { NotificationsToast } from './components/Notification';
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
      <NotificationsProvider>
        <NavBar/>
        <RouteList/>
      </NotificationsProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
