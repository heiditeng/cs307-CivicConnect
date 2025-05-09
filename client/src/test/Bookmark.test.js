import React from "react";
import { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UserFeed from "../components/UserFeed";

// mock the fetch API
global.fetch = jest.fn((url) => {
  if (url.includes("/api/events")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "1",
            name: "Test Event",
            date: "2024-10-31",
            location: "Test Location",
            rsvpUsers: [],
          },
        ]),
    });
  }
  if (url.includes("/bookmark")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "Bookmark status updated" }),
    });
  }
  return Promise.reject(new Error("Unknown API endpoint"));
});

describe("UserFeed Component", () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockImplementation((url) => {
      if (url.includes("/api/events")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                _id: "1",
                name: "Test Event",
                date: "2024-10-31",
                location: "Test Location",
                rsvpUsers: [],
              },
            ]),
        });
      }
      if (url.includes("/bookmark")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ message: "Bookmark status updated" }) });
      }
      return Promise.reject(new Error("Unknown API endpoint"));
    });
  });

  it("should add a bookmark when clicking the bookmark button", async () => {
    await act(async () => {
      // render UserFeed within Router
      render(
        <Router>
          <UserFeed />
        </Router>
      );
    });

    // wait for events to load
    await waitFor(() => expect(screen.getByText("Test Event")).toBeInTheDocument());

    // get the bookmark button and click it
    const bookmarkButton = screen.getByLabelText("Bookmark");
    fireEvent.click(bookmarkButton);

    // wait for confirmation message to appear
    await waitFor(() => expect(screen.getByText('"Test Event" has been added to your bookmarks.')).toBeInTheDocument());
  });

  it("should remove a bookmark when clicking the bookmark button again", async () => {
    await act(async () => {
      // render UserFeed within Router
      render(
        <Router>
          <UserFeed />
        </Router>
      );
    });

    // wait for events to load
    await waitFor(() => expect(screen.getByText("Test Event")).toBeInTheDocument());

    // get the bookmark button and click it twice to bookmark and unbookmark
    const bookmarkButton = screen.getByLabelText("Bookmark");
    fireEvent.click(bookmarkButton); // First click to add
    await waitFor(() => expect(screen.getByText('"Test Event" has been added to your bookmarks.')).toBeInTheDocument());

    fireEvent.click(bookmarkButton); // second click to remove
    await waitFor(() => expect(screen.getByText('"Test Event" has been removed from your bookmarks.')).toBeInTheDocument());
  });
});
