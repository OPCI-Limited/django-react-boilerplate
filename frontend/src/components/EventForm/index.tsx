import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { Event, EventFormData } from '../../interfaces';
import { api } from '../../services/api';
import { formatDateForInput } from '../../utils/formatDate';

interface EventFormProps {
  /** Set event id to put form in edit mode */
  eventId?: number;
}

export function EventForm({ eventId }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch event data if we're editing
  useEffect(() => {
    if (!eventId) {
      return;
    }

    // if (eventId) {
    setLoading(true);
  
    api.get<Event>(`/events/${eventId}`)
      .then((response) => {
        const event = response.data;

        setFormData({
          ...event,
          start_time: formatDateForInput(response.data.start_time),
          end_time: formatDateForInput(response.data.end_time),
        });
      })
      .catch((error) => {
        // TODO: handle error
        console.error('Error fetching event:', error);
      })
      .finally(() => setLoading(false));
    // }
  }, [eventId, formatDateForInput]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = eventId ? `/events/${eventId}/` : '/events/';
    const method = eventId ? 'PATCH' : 'POST'; // Use PATCH for editing, POST for creating

    api({
      method,
      url: endpoint,
      data: formData,
    })
      .then(() => {
        navigate('/events'); // Redirect to events list after successful submit
      })
      .catch((error) => {
        console.error('Error submitting event:', error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>{eventId ? 'Edit Event' : 'Create Event'}</h2>

      <Form.Group controlId="formTitle">
        <Form.Label>Event Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="formStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="formEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit" disabled={loading} className="mt-3">
        {loading ? 'Saving...' : eventId ? 'Save Changes' : 'Create Event'}
      </Button>
    </Form>
  );
}
