import type { Tracking, TrackingEvent } from "./index";
import { updateTracking } from "./index";
describe("Tracking Update Tests", () => {
  describe("Update Existing TrackingEvents Correctly", () => {
    test("should update the date of an existing event", () => {
      const existing: Tracking = {
        events: [
          {
            date: new Date(2023, 3, 1),
            location: "FR/LEH",
            status: "estimated",
            type: "departure",
          },
        ],
      };
      const updates: TrackingEvent[] = [
        {
          date: new Date(2023, 3, 2),
          location: "FR/LEH",
          status: "estimated",
          type: "departure",
        },
      ];
      const updated = updateTracking(existing, updates);

      expect(updated.events.length).toBe(1);
      expect(updated.events[0].date).toEqual(new Date(2023, 3, 2));
    });

    test("should not change the event type when updating date", () => {
      const existing: Tracking = {
        events: [
          {
            date: new Date(2023, 4, 5),
            location: "US/LAX",
            status: "estimated",
            type: "arrival",
          },
        ],
      };
      const updates: TrackingEvent[] = [
        {
          date: new Date(2023, 4, 6),
          location: "US/LAX",
          status: "actual",
          type: "arrival",
        },
      ];
      const updated = updateTracking(existing, updates);

      expect(updated.events[0].type).toBe("arrival");
    });
  });

  describe("Handle ETA/ETD Notifications", () => {
    test("should correctly flag when ETD changes", () => {
      const existing: Tracking = {
        events: [
          {
            date: new Date(2023, 5, 10),
            location: "CN/SHA",
            status: "estimated",
            type: "departure",
          },
        ],
      };
      const updates: TrackingEvent[] = [
        {
          date: new Date(2023, 5, 11),
          location: "CN/SHA",
          status: "actual",
          type: "departure",
        },
      ];
      const result = updateTracking(existing, updates);

      expect(result.hasEtdChanged).toBe(true);
    });

    test("should correctly flag when ETA changes", () => {
      const existing: Tracking = {
        events: [
          {
            date: new Date(2023, 6, 15),
            location: "US/LAX",
            status: "estimated",
            type: "arrival",
          },
        ],
      };
      const updates: TrackingEvent[] = [
        {
          date: new Date(2023, 6, 16),
          location: "US/LAX",
          status: "actual",
          type: "arrival",
        },
      ];
      const result = updateTracking(existing, updates);

      expect(result.hasEtaChanged).toBe(true);
    });
  });
});
