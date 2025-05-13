import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { useIsMounted } from '../../hooks/events/useIsMounted';
import { Event, EventFormData } from '../../interfaces';
import { api } from '../../services/api';
import { formatDateForInput } from '../../utils/formatDate';


interface EventFormProps {
  /** Set event id to put form in edit mode */
  eventId?: number;
}

const formSchema = yup.object({
  title: yup.string().trim().required('Title is required'),
  description: yup.string().trim().required('Description is required'),
  location: yup.string().trim().required('Location is required'),
  start_time: yup
    .date()
    .typeError('Start time is required')
    .required('Start time is required'),
  end_time: yup
    .date()
    .typeError('End time is required')
    .min(yup.ref('start_time'), 'End time must be after start time')
    .required('End time is required'),
});

export function EventForm({ eventId }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMounted = useIsMounted();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: yupResolver(formSchema),
  });

  // Fetch event data if we're editing
  useEffect(() => {
    if (!eventId) {
      return;
    }

    setLoading(true);
  
    api.get<Event>(`/events/${eventId}`)
      .then((response) => {
        if (isMounted.current) {
          const event = response.data;

          reset({
            ...event,
            // react bootstrap datetime-local input requires a string, but form schema uses Date so got a mismatch here
            // eslint-disable-next-line
            start_time: formatDateForInput(response.data.start_time) as any,
            // eslint-disable-next-line
            end_time: formatDateForInput(response.data.end_time) as any,
          });
        }
      })
      .catch((error) => {
        // TODO: handle error
        console.error('Error fetching event:', error);
      })
      .finally(() => {
        if (isMounted.current) {
          setLoading(false)
        }
      });
  }, [eventId, isMounted]);


  // Handle form submission
  const onSubmit: SubmitHandler<EventFormData> = async (data: EventFormData) => {
    setLoading(true);

    const endpoint = eventId ? `/events/${eventId}/` : '/events/';
    const method = eventId ? 'PATCH' : 'POST'; // Use PATCH for editing, POST for creating

    try {
      await api({
        method,
        url: endpoint,
        data,
      });

      navigate('/events');
    } catch (error) {
      console.error('Error submitting event:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h2>{eventId ? 'Edit Event' : 'Create Event'}</h2>

      <Form.Group controlId="formTitle">
        <Form.Label>Event Title</Form.Label>
        <Form.Control
          type="text"
          isInvalid={!!errors.title}
          {...register('title')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.title?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          isInvalid={!!errors.description}
          {...register('description')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formLocation">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          isInvalid={!!errors.location}
          {...register('location')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.location?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col>
          <Form.Group controlId="formStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              isInvalid={!!errors.start_time}
              {...register('start_time')}
            />

            <Form.Control.Feedback type="invalid">
              {errors.start_time?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="formEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              isInvalid={!!errors.end_time}
              {...register('end_time')}
            />

            <Form.Control.Feedback type="invalid">
              {errors.end_time?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit" disabled={loading || isSubmitting} className="mt-3">
        {(isSubmitting || loading) && (
          <Spinner
            animation="border"
            size="sm"
            className="me-2"
          />
        )}
        {eventId ? 'Save Changes' : 'Create Event'}
      </Button>
    </Form>
  );
}
