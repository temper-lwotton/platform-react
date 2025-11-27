'use client';

import { useMemo } from 'react';
import { Event } from '@/lib/events';
import { getSpaceColor, groupEventsBySpace } from '@/lib/calendar-utils';

interface CalendarColorLegendProps {
  events: Event[];
}

export function CalendarColorLegend({ events }: CalendarColorLegendProps) {
  const spaceGroups = useMemo(() => groupEventsBySpace(events), [events]);

  // Get unique spaces with their colors
  const spaces = useMemo(() => {
    const uniqueSpaces = new Map<number, { id: number; name: string; color: string; count: number }>();

    spaceGroups.forEach((events, spaceId) => {
      if (events.length > 0) {
        const space = events[0].space;
        uniqueSpaces.set(spaceId, {
          id: spaceId,
          name: space.name,
          color: getSpaceColor(spaceId),
          count: events.length,
        });
      }
    });

    return Array.from(uniqueSpaces.values()).sort((a, b) => b.count - a.count);
  }, [spaceGroups]);

  if (spaces.length === 0) {
    return null;
  }

  return (
    <div className="calendar-color-legend">
      <h3 className="calendar-color-legend-title">Spaces</h3>
      <div className="calendar-color-legend-items">
        {spaces.map((space) => (
          <div key={space.id} className="calendar-color-legend-item">
            <span
              className="calendar-color-legend-dot"
              style={{ backgroundColor: space.color }}
            />
            <span className="calendar-color-legend-name">{space.name}</span>
            <span className="calendar-color-legend-count">{space.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
