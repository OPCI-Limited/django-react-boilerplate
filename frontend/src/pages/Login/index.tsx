import React, { FormEvent, useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';


import { AuthContext } from '../../context/AuthContext';

function initialFormValues() {
  return {
    email: '',
    password: ''
  };
}

export function Login() {
  const [values, setValues] = useState(initialFormValues);
  const [loginRequestStatus, setLoginRequestStatus] = useState('success');
  const { signIn } = useContext(AuthContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoginRequestStatus('loading');

    await signIn(values);

    setLoginRequestStatus('success');
  }

  useEffect(() => {
    // clean the function to fix memory leak
    return () => setLoginRequestStatus('success');
  }, []);

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4">Login</Card.Title> <Form noValidate data-testid="login-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    className="text-muted"
                    placeholder="Email"
                    value={values.email}
                    type="email"
                    name="email"
                    data-testid="login-input-email"
                    disabled={loginRequestStatus === 'loading'}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="text-muted"
                    placeholder="Password"
                    value={values.password}
                    type="password"
                    name="password"
                    data-testid="login-input-password"
                    disabled={loginRequestStatus === 'loading'}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  data-testid="login-submit-button"
                  disabled={loginRequestStatus === 'loading'}
                >
                  {loginRequestStatus === 'loading' ? 'Loading...' : 'Submit'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>);
}
