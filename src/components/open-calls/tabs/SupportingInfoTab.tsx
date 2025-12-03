import React from 'react';
import { OpenCall } from '@/types/open-calls';
import { Download, FileText, Mail, Phone, HelpCircle } from 'lucide-react';
import styles from './TabContent.module.scss';

interface SupportingInfoTabProps {
  openCall: OpenCall;
}

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <FileText />;
  if (fileType.includes('pdf')) return <FileText />;
  return <FileText />;
};

const formatFileSize = (size?: string) => {
  if (!size) return '';
  return ` (${size})`;
};

export default function SupportingInfoTab({ openCall }: SupportingInfoTabProps) {
  return (
    <div className={styles.tabContent}>
      {openCall.supportingDocuments.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Supporting Documents</h3>
          <div className={styles.documentsList}>
            {openCall.supportingDocuments.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.documentItem}
              >
                <div className={styles.documentIcon}>
                  {getFileIcon(doc.fileType)}
                </div>
                <div className={styles.documentContent}>
                  <div className={styles.documentTitle}>
                    {doc.title}
                    {formatFileSize(doc.fileSize)}
                  </div>
                  {doc.description && (
                    <div className={styles.documentDescription}>{doc.description}</div>
                  )}
                </div>
                <div className={styles.documentAction}>
                  <Download />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {openCall.tabs
        .filter((tab) => tab.id === 'supporting-info')
        .map((tab) =>
          tab.sections.map((section) => (
            <div key={section.id} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <div className={styles.richContent} dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))
        )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact Information</h3>
        <div className={styles.contactGrid}>
          {openCall.contactEmail && (
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <Mail />
              </div>
              <div className={styles.contactContent}>
                <div className={styles.contactLabel}>Email</div>
                <a href={`mailto:${openCall.contactEmail}`} className={styles.contactValue}>
                  {openCall.contactEmail}
                </a>
              </div>
            </div>
          )}

          {openCall.contactPhone && (
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <Phone />
              </div>
              <div className={styles.contactContent}>
                <div className={styles.contactLabel}>Phone</div>
                <a href={`tel:${openCall.contactPhone}`} className={styles.contactValue}>
                  {openCall.contactPhone}
                </a>
              </div>
            </div>
          )}

          {openCall.faqUrl && (
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <HelpCircle />
              </div>
              <div className={styles.contactContent}>
                <div className={styles.contactLabel}>FAQ</div>
                <a href={openCall.faqUrl} target="_blank" rel="noopener noreferrer" className={styles.contactValue}>
                  View Frequently Asked Questions
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
