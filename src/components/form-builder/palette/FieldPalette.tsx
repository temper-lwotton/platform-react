'use client';

import React, { useState } from 'react';
import { FIELD_PALETTE_ITEMS } from '../field-palette-config';
import FieldPaletteItem from './FieldPaletteItem';
import FieldTemplateItem from './FieldTemplateItem';
import { useFormBuilder } from '../FormBuilderProvider';
import * as Separator from '@radix-ui/react-separator';
import * as Tabs from '@radix-ui/react-tabs';
import { FolderOpen, LayoutList, Star, Mail, MapPin, CreditCard, Calendar, User } from 'lucide-react';
import styles from './FieldPalette.module.scss';

export default function FieldPalette() {
  const { state } = useFormBuilder();
  const [activeTab, setActiveTab] = useState('fields');

  // Get the selected section if any
  const selectedSection = state.sections.find((s) => s.id === state.selectedSectionId);

  // Group fields by category
  const basicFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['text', 'textarea', 'email', 'number', 'tel', 'url', 'currency'].includes(item.type)
  );

  const choiceFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['select', 'radio', 'checkbox', 'checkbox-group'].includes(item.type)
  );

  const dateTimeFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['date', 'time'].includes(item.type)
  );

  const advancedFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['file', 'file-multiple', 'switch', 'rating', 'slider', 'signature', 'color'].includes(item.type)
  );

  // Group templates by category
  const contactTemplates = state.templates.filter((t) => t.category === 'contact');
  const addressTemplates = state.templates.filter((t) => t.category === 'address');
  const paymentTemplates = state.templates.filter((t) => t.category === 'payment');
  const dateTimeTemplates = state.templates.filter((t) => t.category === 'date-time');
  const personalTemplates = state.templates.filter((t) => t.category === 'personal');
  const customTemplates = state.templates.filter((t) => t.category === 'custom');
  const otherTemplates = state.templates.filter((t) => t.category === 'other');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'contact':
        return Mail;
      case 'address':
        return MapPin;
      case 'payment':
        return CreditCard;
      case 'date-time':
        return Calendar;
      case 'personal':
        return User;
      case 'custom':
        return Star;
      default:
        return LayoutList;
    }
  };

  return (
    <div className={styles.palette}>
      <div className={styles.header}>
        <h3>Form Builder</h3>
        <p>Click to add to form</p>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className={styles.tabs}>
        <Tabs.List className={styles.tabsList}>
          <Tabs.Trigger value="fields" className={styles.tabsTrigger}>
            Field Types
          </Tabs.Trigger>
          <Tabs.Trigger value="templates" className={styles.tabsTrigger}>
            Templates
          </Tabs.Trigger>
        </Tabs.List>

        {/* Show where fields will be added */}
        {selectedSection ? (
          <div className={styles.targetIndicator}>
            <FolderOpen size={16} />
            <div className={styles.targetText}>
              <span className={styles.targetLabel}>Adding to:</span>
              <span className={styles.targetValue}>{selectedSection.title}</span>
            </div>
          </div>
        ) : state.sections.length > 0 ? (
          <div className={`${styles.targetIndicator} ${styles.unsectioned}`}>
            <LayoutList size={16} />
            <div className={styles.targetText}>
              <span className={styles.targetLabel}>Adding to:</span>
              <span className={styles.targetValue}>Unsectioned Fields</span>
            </div>
          </div>
        ) : null}

        <Tabs.Content value="fields" className={styles.tabContent}>
          <div className={styles.sections}>
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Basic Inputs</h4>
          <div className={styles.items}>
            {basicFields.map((item) => (
              <FieldPaletteItem key={item.type} item={item} />
            ))}
          </div>
        </section>

        <Separator.Root className={styles.separator} />

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Choice Fields</h4>
          <div className={styles.items}>
            {choiceFields.map((item) => (
              <FieldPaletteItem key={item.type} item={item} />
            ))}
          </div>
        </section>

        <Separator.Root className={styles.separator} />

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Date & Time</h4>
          <div className={styles.items}>
            {dateTimeFields.map((item) => (
              <FieldPaletteItem key={item.type} item={item} />
            ))}
          </div>
        </section>

        <Separator.Root className={styles.separator} />

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Advanced</h4>
          <div className={styles.items}>
            {advancedFields.map((item) => (
              <FieldPaletteItem key={item.type} item={item} />
            ))}
          </div>
        </section>
          </div>
        </Tabs.Content>

        <Tabs.Content value="templates" className={styles.tabContent}>
          <div className={styles.sections}>
            {customTemplates.length > 0 && (
              <>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Star size={14} />
                    My Templates
                  </h4>
                  <div className={styles.items}>
                    {customTemplates.map((template) => (
                      <FieldTemplateItem key={template.id} template={template} />
                    ))}
                  </div>
                </section>
                <Separator.Root className={styles.separator} />
              </>
            )}

            {contactTemplates.length > 0 && (
              <>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Mail size={14} />
                    Contact
                  </h4>
                  <div className={styles.items}>
                    {contactTemplates.map((template) => (
                      <FieldTemplateItem key={template.id} template={template} />
                    ))}
                  </div>
                </section>
                <Separator.Root className={styles.separator} />
              </>
            )}

            {addressTemplates.length > 0 && (
              <>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <MapPin size={14} />
                    Address
                  </h4>
                  <div className={styles.items}>
                    {addressTemplates.map((template) => (
                      <FieldTemplateItem key={template.id} template={template} />
                    ))}
                  </div>
                </section>
                <Separator.Root className={styles.separator} />
              </>
            )}

            {paymentTemplates.length > 0 && (
              <>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <CreditCard size={14} />
                    Payment
                  </h4>
                  <div className={styles.items}>
                    {paymentTemplates.map((template) => (
                      <FieldTemplateItem key={template.id} template={template} />
                    ))}
                  </div>
                </section>
                <Separator.Root className={styles.separator} />
              </>
            )}

            {dateTimeTemplates.length > 0 && (
              <>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Calendar size={14} />
                    Date & Time
                  </h4>
                  <div className={styles.items}>
                    {dateTimeTemplates.map((template) => (
                      <FieldTemplateItem key={template.id} template={template} />
                    ))}
                  </div>
                </section>
                <Separator.Root className={styles.separator} />
              </>
            )}

            {personalTemplates.length > 0 && (
              <>
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <User size={14} />
                    Personal Info
                  </h4>
                  <div className={styles.items}>
                    {personalTemplates.map((template) => (
                      <FieldTemplateItem key={template.id} template={template} />
                    ))}
                  </div>
                </section>
                <Separator.Root className={styles.separator} />
              </>
            )}

            {otherTemplates.length > 0 && (
              <section className={styles.section}>
                <h4 className={styles.sectionTitle}>
                  <LayoutList size={14} />
                  Other
                </h4>
                <div className={styles.items}>
                  {otherTemplates.map((template) => (
                    <FieldTemplateItem key={template.id} template={template} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
