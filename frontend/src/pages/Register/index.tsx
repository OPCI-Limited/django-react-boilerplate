import React, { FormEvent, useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';


import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function initialFormValues() {
  return {
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
}

export function Register() {
  const [values, setValues] = useState(initialFormValues);
  const [registerRequestStatus, setRegisterRequestStatus] = useState('success');
  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();  // Initialize the useNavigate hook

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validate password confirmation
    if (values.password !== values.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setRegisterRequestStatus('loading');

    const result = await signUp(values);

    setRegisterRequestStatus('success');

    // Redirect to the login page after successful registration
    if (!result) {  // Assuming no error means success
      navigate('/login');
    } else {
      alert("Registration failed. Please try again.");
    }
  }

  useEffect(() => {
    // Cleanup effect to reset state
    return () => setRegisterRequestStatus('success');
  }, []);

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4">Register</Card.Title>
              <Form noValidate data-testid="register-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    className="text-muted"
                    placeholder="Name"
                    value={values.name}
                    type="text"
                    name="name"
                    data-testid="register-input-name"
                    disabled={registerRequestStatus === 'loading'}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSurname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    className="text-muted"
                    placeholder="Surname"
                    value={values.surname}
                    type="text"
                    name="surname"
                    data-testid="register-input-name"
                    disabled={registerRequestStatus === 'loading'}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    className="text-muted"
                    placeholder="Email"
                    value={values.email}
                    type="email"
                    name="email"
                    data-testid="register-input-email"
                    disabled={registerRequestStatus === 'loading'}
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
                    data-testid="register-input-password"
                    disabled={registerRequestStatus === 'loading'}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    className="text-muted"
                    placeholder="Confirm Password"
                    value={values.confirmPassword}
                    type="password"
                    name="confirmPassword"
                    data-testid="register-input-confirm-password"
                    disabled={registerRequestStatus === 'loading'}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  data-testid="register-submit-button"
                  disabled={registerRequestStatus === 'loading'}
                >
                  {registerRequestStatus === 'loading' ? 'Loading...' : 'Submit'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
