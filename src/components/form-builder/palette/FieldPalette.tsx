'use client';

import React, { useState, useEffect } from 'react';
import { FIELD_PALETTE_ITEMS } from '../field-palette-config';
import FieldPaletteItem from './FieldPaletteItem';
import FieldTemplateItem from './FieldTemplateItem';
import { useFormBuilder } from '../FormBuilderProvider';
import * as Separator from '@radix-ui/react-separator';
import * as Tabs from '@radix-ui/react-tabs';
import { FolderOpen, LayoutList, Star, Mail, MapPin, CreditCard, Calendar, User, Search, X } from 'lucide-react';
import styles from './FieldPalette.module.scss';

export default function FieldPalette() {
  const { state } = useFormBuilder();
  const [activeTab, setActiveTab] = useState('fields');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Listen for Cmd+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (((e.metaKey || e.ctrlKey) && e.key === 'k') || (e.key === '/' && !isInputField)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get the selected section if any
  const selectedSection = state.sections.find((s) => s.id === state.selectedSectionId);

  // Filter function for search
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Group fields by category with search filter
  const basicFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['text', 'textarea', 'email', 'number', 'tel', 'url', 'currency'].includes(item.type) &&
    (matchesSearch(item.label) || matchesSearch(item.description))
  );

  const choiceFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['select', 'radio', 'checkbox', 'checkbox-group'].includes(item.type) &&
    (matchesSearch(item.label) || matchesSearch(item.description))
  );

  const dateTimeFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['date', 'time'].includes(item.type) &&
    (matchesSearch(item.label) || matchesSearch(item.description))
  );

  const advancedFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['file', 'file-multiple', 'switch', 'rating', 'slider', 'signature', 'color'].includes(item.type) &&
    (matchesSearch(item.label) || matchesSearch(item.description))
  );

  // Group templates by category with search filter
  const contactTemplates = state.templates.filter((t) =>
    t.category === 'contact' &&
    (matchesSearch(t.name) || matchesSearch(t.description || ''))
  );
  const addressTemplates = state.templates.filter((t) =>
    t.category === 'address' &&
    (matchesSearch(t.name) || matchesSearch(t.description || ''))
  );
  const paymentTemplates = state.templates.filter((t) =>
    t.category === 'payment' &&
    (matchesSearch(t.name) || matchesSearch(t.description || ''))
  );
  const dateTimeTemplates = state.templates.filter((t) =>
    t.category === 'date-time' &&
    (matchesSearch(t.name) || matchesSearch(t.description || ''))
  );
  const personalTemplates = state.templates.filter((t) =>
    t.category === 'personal' &&
    (matchesSearch(t.name) || matchesSearch(t.description || ''))
  );
  const customTemplates = state.templates.filter((t) =>
    t.category === 'custom' &&
    (matchesSearch(t.name) || matchesSearch(t.description || ''))
  );
  const otherTemplates = state.templates.filter((t) =>
    t.category === 'other' &&
    (matchesSearch(t.name) || matchesSearch(t.description || ''))
  );

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

      <div className={styles.searchBox}>
        <Search size={16} className={styles.searchIcon} />
        <input
          ref={searchInputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search fields... (Cmd+K or /)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className={styles.clearSearch}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
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
