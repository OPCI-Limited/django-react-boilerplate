import { Container } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';

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
      <NavBar/>
      <Container>
        <RouteList/>
      </Container>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
