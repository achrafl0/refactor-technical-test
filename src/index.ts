/* eslint-disable prefer-const */
/* eslint-disable immutable/no-let */

// This is the code that was written by your intern, and because we are going to
// Add multiple new features to it we need to refactor it first.

export type TrackingEvent = {
  date: Date;
  location: string;
  status: "actual" | "estimated";
  type: "departure" | "arrival";
};

export type Tracking = {
  events: TrackingEvent[];
};

export function updateTracking(
  existing: Tracking,
  updates: TrackingEvent[],
): Tracking & { hasEtaChanged: boolean; hasEtdChanged: boolean } {
  let updatedTracking = existing;
  let hasEtaChanged = false;
  let hasEtdChanged = false;

  updates.forEach((update) => {
    let found = false;

    updatedTracking.events = updatedTracking.events.map((event) => {
      if (event.location === update.location && event.type === update.type) {
        found = true;
        if (event.date !== update.date) {
          if (!event.date || !update.date || event.date.getTime() !== update.date.getTime()) {
            event.date = update.date;

            return event;
          }
        }
        event.status = update.status;
      }

      return event;
    });

    if (!found) {
      updatedTracking.events.push(update);
    }
  });

  let firstDeparture = updatedTracking.events.find((e) => e.type === "departure");
  let lastArrival = updatedTracking.events.findLast((e) => e.type === "arrival");

  if (firstDeparture && updates.some((u) => u.type === "departure" && u.location === firstDeparture.location)) {
    hasEtdChanged = true;
  }
  if (lastArrival && updates.some((u) => u.type === "arrival" && u.location === lastArrival.location)) {
    hasEtaChanged = true;
  }

  return { ...updatedTracking, hasEtaChanged, hasEtdChanged };
}
