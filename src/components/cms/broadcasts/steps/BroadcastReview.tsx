'use client';

import { useState } from 'react';
import { CheckCircle, Mail, Users, Calendar, Clock, Eye } from 'lucide-react';
import styles from './Steps.module.scss';

interface BroadcastReviewProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function BroadcastReview({ data, onUpdate }: BroadcastReviewProps) {
  const [sendType, setSendType] = useState(data.sendType || 'now');
  const [scheduledDate, setScheduledDate] = useState(
    data.scheduledDate ? new Date(data.scheduledDate).toISOString().slice(0, 16) : ''
  );

  const handleSendTypeChange = (type: 'now' | 'scheduled') => {
    setSendType(type);
    onUpdate({
      sendType: type,
      scheduledDate: type === 'scheduled' ? scheduledDate : undefined,
    });
  };

  const handleScheduledDateChange = (dateStr: string) => {
    setScheduledDate(dateStr);
    onUpdate({
      sendType: 'scheduled',
      scheduledDate: new Date(dateStr),
    });
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Review & Send</h2>
        <p className={styles.stepDescription}>
          Review your campaign details and choose when to send
        </p>
      </div>

      {/* Campaign Summary */}
      <div className={styles.reviewSection}>
        <h3 className={styles.sectionTitle}>Campaign Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryItemIcon}>
              <Mail className={styles.summaryItemIconSvg} />
            </div>
            <div>
              <div className={styles.summaryItemLabel}>Campaign Name</div>
              <div className={styles.summaryItemValue}>{data.name}</div>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.summaryItemIcon}>
              <Mail className={styles.summaryItemIconSvg} />
            </div>
            <div>
              <div className={styles.summaryItemLabel}>Subject Line</div>
              <div className={styles.summaryItemValue}>{data.subject}</div>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.summaryItemIcon}>
              <Users className={styles.summaryItemIconSvg} />
            </div>
            <div>
              <div className={styles.summaryItemLabel}>Recipients</div>
              <div className={styles.summaryItemValue}>
                {data.recipientCount?.toLocaleString() || 0} users
              </div>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.summaryItemIcon}>
              <Mail className={styles.summaryItemIconSvg} />
            </div>
            <div>
              <div className={styles.summaryItemLabel}>From</div>
              <div className={styles.summaryItemValue}>
                {data.fromName} ({data.fromEmail})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div className={styles.reviewSection}>
        <h3 className={styles.sectionTitle}>Email Preview</h3>
        <div className={styles.emailPreview}>
          <div className={styles.emailPreviewHeader}>
            <div className={styles.previewLabel}>
              <Eye className={styles.previewIcon} />
              Preview
            </div>
          </div>
          <div className={styles.emailPreviewContent}>
            <div className={styles.emailMetadata}>
              <div className={styles.emailMetadataRow}>
                <span className={styles.emailMetadataLabel}>From:</span>
                <span className={styles.emailMetadataValue}>
                  {data.fromName} &lt;{data.fromEmail}&gt;
                </span>
              </div>
              <div className={styles.emailMetadataRow}>
                <span className={styles.emailMetadataLabel}>Subject:</span>
                <span className={styles.emailMetadataValue}>{data.subject}</span>
              </div>
              {data.preheader && (
                <div className={styles.emailMetadataRow}>
                  <span className={styles.emailMetadataLabel}>Preheader:</span>
                  <span className={styles.emailMetadataValue}>{data.preheader}</span>
                </div>
              )}
            </div>
            <div className={styles.emailBody}>
              {data.emailContent ? (
                <div className={styles.emailContentPreview}>
                  Email content will be rendered here
                </div>
              ) : (
                <div className={styles.noContent}>No email content designed yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Send Options */}
      <div className={styles.reviewSection}>
        <h3 className={styles.sectionTitle}>Send Options</h3>
        <div className={styles.sendOptions}>
          {/* Send Now */}
          <button
            onClick={() => handleSendTypeChange('now')}
            className={`${styles.sendOption} ${
              sendType === 'now' ? styles.selected : ''
            }`}
          >
            <div className={styles.sendOptionIcon}>
              <CheckCircle className={styles.sendOptionIconSvg} />
            </div>
            <div className={styles.sendOptionContent}>
              <h4 className={styles.sendOptionTitle}>Send Now</h4>
              <p className={styles.sendOptionDescription}>
                Send this campaign immediately to all recipients
              </p>
            </div>
          </button>

          {/* Schedule */}
          <button
            onClick={() => handleSendTypeChange('scheduled')}
            className={`${styles.sendOption} ${
              sendType === 'scheduled' ? styles.selected : ''
            }`}
          >
            <div className={styles.sendOptionIcon}>
              <Calendar className={styles.sendOptionIconSvg} />
            </div>
            <div className={styles.sendOptionContent}>
              <h4 className={styles.sendOptionTitle}>Schedule for Later</h4>
              <p className={styles.sendOptionDescription}>
                Choose a specific date and time to send
              </p>
            </div>
          </button>
        </div>

        {sendType === 'scheduled' && (
          <div className={styles.scheduledDateInput}>
            <label htmlFor="scheduledDate" className={styles.label}>
              <Clock className={styles.labelIcon} />
              Schedule Date & Time
            </label>
            <input
              id="scheduledDate"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => handleScheduledDateChange(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className={styles.dateTimeInput}
            />
          </div>
        )}
      </div>

      {/* Final Checklist */}
      <div className={styles.checklistCard}>
        <h3 className={styles.checklistTitle}>Pre-Send Checklist</h3>
        <div className={styles.checklistItems}>
          <div className={styles.checklistItem}>
            <CheckCircle
              className={`${styles.checklistIcon} ${
                data.name && data.subject ? styles.complete : ''
              }`}
            />
            <span>Campaign details are complete</span>
          </div>
          <div className={styles.checklistItem}>
            <CheckCircle
              className={`${styles.checklistIcon} ${
                data.recipientCount > 0 ? styles.complete : ''
              }`}
            />
            <span>Recipients are selected</span>
          </div>
          <div className={styles.checklistItem}>
            <CheckCircle
              className={`${styles.checklistIcon} ${
                data.emailContent ? styles.complete : ''
              }`}
            />
            <span>Email content is designed</span>
          </div>
          {sendType === 'scheduled' && (
            <div className={styles.checklistItem}>
              <CheckCircle
                className={`${styles.checklistIcon} ${
                  scheduledDate ? styles.complete : ''
                }`}
              />
              <span>Send time is scheduled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
