/**
 * Composing <Route> in React Router v6
 * https://gist.github.com/mjackson/d54b40a094277b7afdd6b81f51a0393f
 *
 * Upgrading from v5
 * https://reactrouter.com/docs/en/v6/upgrading/v5
 */
import { Navigate, Route, Routes } from "react-router-dom";

import { CreateEvent } from "../pages/CreateEvent";
import { EditEvent } from "../pages/EditEvent";
import { Event } from "../pages/Event";
import { Events } from "../pages/Events";
import { Invitations } from "../pages/Invitations";
import { Login } from "../pages/Login";
import { Metrics } from "../pages/Metrics";
import { Profile } from "../pages/Profile";
import { Register } from "../pages/Register";
import { Users } from "../pages/Users";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

export const RouteList = () => (
  <>
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute redirectTo="/login">
            <Navigate to="/events" replace />
          </PrivateRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path={"/profile"}
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/metrics"
        element={
          <PrivateRoute permissions={["metrics.list"]} redirectTo="/login">
            <Metrics />
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute permissions={["users.list", "users.create"]}>
            <Users />
          </PrivateRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <PrivateRoute permissions={["users.list", "users.create"]}>
            <Users />
          </PrivateRoute>
        }
      />

      <Route
        path="/events"
        element={
          <PrivateRoute permissions={["events.view_event"]}>
            <Events />
          </PrivateRoute>
        }
      />

      <Route
        path="/events/:id"
        element={
          <PrivateRoute permissions={["events.view_event"]}>
            <Event />
          </PrivateRoute>
        }
      />

      <Route
        path="/events/create"
        element={
          <PrivateRoute permissions={["events.add_event"]}>
            <CreateEvent />
          </PrivateRoute>
        }
      />

      <Route
        path="/events/:id/edit"
        element={
          <PrivateRoute permissions={["events.change_event"]}>
            <EditEvent />
          </PrivateRoute>
        }
      />

      <Route
        path="/invitations"
        element={
          <PrivateRoute permissions={["events.view_event"]}>
            <Invitations />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  </>
);
