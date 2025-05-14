import { Button, Container, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import React, { useState } from "react";
import { AgendaView } from "../../components/AgendaView";
import { CanAccess } from "../../components/CanAccess";
import { EventsList } from "../../components/EventList";

export function Events() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");

  const handleCreateButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigate(`/events/create`);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Events</h1>
        <CanAccess permissions={["events.add_event"]}>
          <Button variant="primary" onClick={handleCreateButtonClick}>
            Create Event
          </Button>
        </CanAccess>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "list")}
        className="mb-3"
      >
        <Tab eventKey="list" title="List View">
          <EventsList />
        </Tab>
        <Tab eventKey="agenda" title="Agenda View">
          <AgendaView />
        </Tab>
      </Tabs>
    </Container>
  );
}
