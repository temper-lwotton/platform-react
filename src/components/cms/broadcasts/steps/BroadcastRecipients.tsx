'use client';

import { useState } from 'react';
import { Users, Filter, Search, UserCheck } from 'lucide-react';
import styles from './Steps.module.scss';

interface BroadcastRecipientsProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const mockSegments = [
  { id: '1', name: 'All Users', count: 5234 },
  { id: '2', name: 'Active Members', count: 3421 },
  { id: '3', name: 'New Signups (Last 30 Days)', count: 456 },
  { id: '4', name: 'Inactive Users', count: 1813 },
  { id: '5', name: 'Premium Members', count: 892 },
];

export function BroadcastRecipients({
  data,
  onUpdate,
  onNext,
}: BroadcastRecipientsProps) {
  const [recipientType, setRecipientType] = useState(
    data.recipientType || 'all'
  );
  const [selectedSegment, setSelectedSegment] = useState(
    data.recipientSegment || ''
  );

  const handleRecipientTypeChange = (type: 'all' | 'segment' | 'custom') => {
    setRecipientType(type);
    let recipientCount = 0;

    if (type === 'all') {
      recipientCount = mockSegments[0].count;
    } else if (type === 'segment' && selectedSegment) {
      const segment = mockSegments.find((s) => s.id === selectedSegment);
      recipientCount = segment?.count || 0;
    }

    onUpdate({
      recipientType: type,
      recipientSegment: type === 'segment' ? selectedSegment : undefined,
      recipientCount,
    });
  };

  const handleSegmentChange = (segmentId: string) => {
    setSelectedSegment(segmentId);
    const segment = mockSegments.find((s) => s.id === segmentId);
    onUpdate({
      recipientType: 'segment',
      recipientSegment: segmentId,
      recipientCount: segment?.count || 0,
    });
  };

  const getRecipientCount = () => {
    if (recipientType === 'all') {
      return mockSegments[0].count;
    } else if (recipientType === 'segment' && selectedSegment) {
      const segment = mockSegments.find((s) => s.id === selectedSegment);
      return segment?.count || 0;
    }
    return 0;
  };

  const isValid = () => {
    if (recipientType === 'all') return true;
    if (recipientType === 'segment') return !!selectedSegment;
    return false;
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Select Recipients</h2>
        <p className={styles.stepDescription}>
          Choose who will receive this email campaign
        </p>
      </div>

      {/* Recipient Type Selection */}
      <div className={styles.recipientTypes}>
        {/* All Users */}
        <button
          onClick={() => handleRecipientTypeChange('all')}
          className={`${styles.recipientTypeCard} ${
            recipientType === 'all' ? styles.selected : ''
          }`}
        >
          <div className={styles.recipientTypeIcon}>
            <Users className={styles.recipientTypeIconSvg} />
          </div>
          <div className={styles.recipientTypeContent}>
            <h3 className={styles.recipientTypeName}>All Users</h3>
            <p className={styles.recipientTypeDescription}>
              Send to all users in your platform
            </p>
            <div className={styles.recipientTypeCount}>
              {mockSegments[0].count.toLocaleString()} recipients
            </div>
          </div>
          {recipientType === 'all' && (
            <div className={styles.selectedBadge}>
              <UserCheck className={styles.selectedIcon} />
            </div>
          )}
        </button>

        {/* Segment */}
        <button
          onClick={() => handleRecipientTypeChange('segment')}
          className={`${styles.recipientTypeCard} ${
            recipientType === 'segment' ? styles.selected : ''
          }`}
        >
          <div className={styles.recipientTypeIcon}>
            <Filter className={styles.recipientTypeIconSvg} />
          </div>
          <div className={styles.recipientTypeContent}>
            <h3 className={styles.recipientTypeName}>User Segment</h3>
            <p className={styles.recipientTypeDescription}>
              Target a specific group of users
            </p>
            <div className={styles.recipientTypeCount}>
              {mockSegments.length} segments available
            </div>
          </div>
          {recipientType === 'segment' && (
            <div className={styles.selectedBadge}>
              <UserCheck className={styles.selectedIcon} />
            </div>
          )}
        </button>
      </div>

      {/* Segment Selection */}
      {recipientType === 'segment' && (
        <div className={styles.segmentSelection}>
          <h3 className={styles.sectionTitle}>Choose a Segment</h3>
          <div className={styles.segmentList}>
            {mockSegments.slice(1).map((segment) => (
              <button
                key={segment.id}
                onClick={() => handleSegmentChange(segment.id)}
                className={`${styles.segmentCard} ${
                  selectedSegment === segment.id ? styles.selected : ''
                }`}
              >
                <div className={styles.segmentInfo}>
                  <div className={styles.segmentName}>{segment.name}</div>
                  <div className={styles.segmentCount}>
                    {segment.count.toLocaleString()} users
                  </div>
                </div>
                {selectedSegment === segment.id && (
                  <UserCheck className={styles.segmentSelectedIcon} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className={styles.recipientSummary}>
        <div className={styles.summaryIcon}>
          <Users className={styles.summaryIconSvg} />
        </div>
        <div className={styles.summaryContent}>
          <div className={styles.summaryLabel}>Total Recipients</div>
          <div className={styles.summaryValue}>
            {getRecipientCount().toLocaleString()}
          </div>
        </div>
      </div>

      <div className={styles.stepFooter}>
        <button onClick={onNext} disabled={!isValid()} className={styles.nextButton}>
          Continue to Design
        </button>
      </div>
    </div>
  );
}
