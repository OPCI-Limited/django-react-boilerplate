import { useMemo, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import useEvents from "../../hooks/events/useEvents";
import { Event } from "../../interfaces";
import { formatDate, formatDateForGrouping } from "../../utils/formatDate";

export function AgendaView() {
  const { events, loading, error } = useEvents();
  const [textFilter, setTextFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events
      .filter((event) => {
        const matchesText =
          event.title.toLowerCase().includes(textFilter.toLowerCase()) ||
          event.description.toLowerCase().includes(textFilter.toLowerCase());

        return matchesText;
      })
      .sort((a, b) => {
        const timeA = new Date(a.start_time).getTime();
        const timeB = new Date(b.start_time).getTime();

        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      });
  }, [events, textFilter, sortOrder]);

  const groupedByDate = useMemo(() => {
    const groups: { [date: string]: Event[] } = {};

    filteredEvents.forEach((event) => {
      const date = formatDateForGrouping(event.start_time);
      if (!groups[date]) groups[date] = [];

      groups[date].push(event);
    });

    return groups;
  }, [filteredEvents]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events.</p>;

  return (
    <>
      <Form className="mb-4">
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by title or description"
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Sort</Form.Label>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <option value="asc">Start Time ↑</option>
              <option value="desc">Start Time ↓</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {Object.keys(groupedByDate).length === 0 && (
        <p className="text-muted">No events found.</p>
      )}

      {Object.entries(groupedByDate).map(([date, eventsOnDate]) => (
        <div key={date} className="mb-4">
          <h5 className="text-primary">{formatDateForGrouping(date)}</h5>
          {eventsOnDate.map((event) => (
            <Card
              key={event.id}
              className="mb-2 clickable event-card"
              onClick={() => navigate(`/events/${event.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title className="mb-1">{event.title}</Card.Title>
                <Card.Subtitle className="text-muted mb-2">
                  {formatDate(event.start_time)} - {formatDate(event.end_time)}
                </Card.Subtitle>
                <Card.Text>{event.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      ))}
    </>
  );
}
