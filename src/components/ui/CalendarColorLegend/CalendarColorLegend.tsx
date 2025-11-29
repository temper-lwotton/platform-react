'use client';

import { useMemo } from 'react';
import { Event } from '@/lib/events';
import { getSpaceColor, groupEventsBySpace } from '@/lib/calendar-utils';
import { Badge } from '../primitives';
import styles from './CalendarColorLegend.module.scss';

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
    <div className={styles.legend}>
      <h3 className={styles.title}>Spaces</h3>
      <div className={styles.items}>
        {spaces.map((space) => (
          <div key={space.id} className={styles.item}>
            <span
              className={styles.dot}
              style={{ backgroundColor: space.color }}
            />
            <span className={styles.name}>{space.name}</span>
            <Badge variant="outline" size="sm">
              {space.count}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
