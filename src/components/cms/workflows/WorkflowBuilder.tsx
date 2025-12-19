'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Zap,
  Target,
  CheckCircle2,
  Plus,
  Trash2,
  Play,
  Save,
  ArrowRight,
  FileText,
  Users,
  MessageSquare,
  Flag,
  Clock,
  Heart,
  Calendar,
  Bell,
  Mail,
  Shield,
  TrendingUp,
  Star,
  Award,
  Archive,
  Ban,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import styles from './WorkflowBuilder.module.scss';

interface TriggerOption {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ConditionOption {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'duration';
  operators: string[];
}

interface ActionOption {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields?: { name: string; type: string; placeholder?: string }[];
}

interface SelectedCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SelectedAction {
  id: string;
  type: string;
  config: Record<string, string>;
}

// Trigger options
const triggerOptions: TriggerOption[] = [
  {
    id: 'post_created',
    category: 'Content',
    label: 'Post Created',
    description: 'When a new post is published',
    icon: FileText,
  },
  {
    id: 'post_liked',
    category: 'Content',
    label: 'Post Liked',
    description: 'When someone likes a post',
    icon: Heart,
  },
  {
    id: 'comment_created',
    category: 'Content',
    label: 'Comment Added',
    description: 'When someone comments on content',
    icon: MessageSquare,
  },
  {
    id: 'user_joined',
    category: 'Users',
    label: 'User Joined',
    description: 'When a new user joins the community',
    icon: Users,
  },
  {
    id: 'user_inactive',
    category: 'Users',
    label: 'User Inactive',
    description: 'When a user hasn\'t been active for X days',
    icon: Clock,
  },
  {
    id: 'content_flagged',
    category: 'Moderation',
    label: 'Content Flagged',
    description: 'When content is flagged by users',
    icon: Flag,
  },
  {
    id: 'event_upcoming',
    category: 'Events',
    label: 'Event Upcoming',
    description: 'X hours/days before an event starts',
    icon: Calendar,
  },
  {
    id: 'time_based',
    category: 'Scheduled',
    label: 'Time-Based',
    description: 'Run on a schedule (hourly, daily, weekly)',
    icon: Clock,
  },
];

// Condition options
const conditionOptions: ConditionOption[] = [
  {
    id: 'like_count',
    label: 'Like Count',
    type: 'number',
    operators: ['≥', '>', '=', '<', '≤'],
  },
  {
    id: 'comment_count',
    label: 'Comment Count',
    type: 'number',
    operators: ['≥', '>', '=', '<', '≤'],
  },
  {
    id: 'flag_count',
    label: 'Flag Count',
    type: 'number',
    operators: ['≥', '>', '=', '<', '≤'],
  },
  {
    id: 'user_role',
    label: 'User Role',
    type: 'select',
    operators: ['is', 'is not'],
  },
  {
    id: 'time_elapsed',
    label: 'Time Elapsed',
    type: 'duration',
    operators: ['after', 'before', 'within'],
  },
  {
    id: 'content_quality',
    label: 'Content Quality Score',
    type: 'number',
    operators: ['≥', '>', '=', '<', '≤'],
  },
  {
    id: 'post_count',
    label: 'User Post Count',
    type: 'number',
    operators: ['≥', '>', '=', '<', '≤'],
  },
];

// Action options
const actionOptions: ActionOption[] = [
  {
    id: 'send_notification',
    category: 'Notifications',
    label: 'Send In-App Notification',
    description: 'Send a notification to user(s)',
    icon: Bell,
    fields: [
      { name: 'title', type: 'text', placeholder: 'Notification title' },
      { name: 'message', type: 'text', placeholder: 'Notification message' },
      { name: 'recipient', type: 'select', placeholder: 'Who receives this' },
    ],
  },
  {
    id: 'send_email',
    category: 'Notifications',
    label: 'Send Email',
    description: 'Send an email to user(s)',
    icon: Mail,
    fields: [
      { name: 'subject', type: 'text', placeholder: 'Email subject' },
      { name: 'template', type: 'select', placeholder: 'Email template' },
      { name: 'recipient', type: 'select', placeholder: 'Who receives this' },
    ],
  },
  {
    id: 'feature_content',
    category: 'Content',
    label: 'Feature Content',
    description: 'Pin content to homepage or category',
    icon: Star,
    fields: [
      { name: 'location', type: 'select', placeholder: 'Where to feature' },
      { name: 'duration', type: 'text', placeholder: 'How long (hours)' },
    ],
  },
  {
    id: 'assign_role',
    category: 'Users',
    label: 'Assign User Role',
    description: 'Change a user\'s role or permissions',
    icon: Award,
    fields: [
      { name: 'role', type: 'select', placeholder: 'Select role' },
    ],
  },
  {
    id: 'auto_moderate',
    category: 'Moderation',
    label: 'Auto-Moderate Content',
    description: 'Hide, approve, or escalate content',
    icon: Shield,
    fields: [
      { name: 'action', type: 'select', placeholder: 'Moderation action' },
      { name: 'reason', type: 'text', placeholder: 'Reason (optional)' },
    ],
  },
  {
    id: 'create_task',
    category: 'Tasks',
    label: 'Create Task',
    description: 'Create a task for team members',
    icon: CheckCircle2,
    fields: [
      { name: 'title', type: 'text', placeholder: 'Task title' },
      { name: 'assignee', type: 'select', placeholder: 'Assign to' },
    ],
  },
  {
    id: 'archive_content',
    category: 'Content',
    label: 'Archive Content',
    description: 'Move content to archive',
    icon: Archive,
  },
  {
    id: 'ban_user',
    category: 'Moderation',
    label: 'Ban User',
    description: 'Temporarily or permanently ban user',
    icon: Ban,
    fields: [
      { name: 'duration', type: 'select', placeholder: 'Ban duration' },
      { name: 'reason', type: 'text', placeholder: 'Ban reason' },
    ],
  },
];

export function WorkflowBuilder() {
  const router = useRouter();
  const [step, setStep] = useState<'metadata' | 'trigger' | 'conditions' | 'actions' | 'preview'>('metadata');

  // Workflow state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerOption | null>(null);
  const [conditions, setConditions] = useState<SelectedCondition[]>([]);
  const [actions, setActions] = useState<SelectedAction[]>([]);

  const handleAddCondition = () => {
    setConditions([...conditions, { id: Date.now().toString(), field: '', operator: '', value: '' }]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const handleUpdateCondition = (id: string, updates: Partial<SelectedCondition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleAddAction = (actionType: ActionOption) => {
    setActions([...actions, { id: Date.now().toString(), type: actionType.id, config: {} }]);
    setStep('actions');
  };

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const handleUpdateActionConfig = (id: string, field: string, value: string) => {
    setActions(actions.map(a =>
      a.id === id ? { ...a, config: { ...a.config, [field]: value } } : a
    ));
  };

  const handleSave = () => {
    console.log('Save workflow:', { name, description, category, selectedTrigger, conditions, actions });
    router.push('/admin/workflows');
  };

  const handleTest = () => {
    console.log('Test workflow');
    alert('Testing workflow... (simulated execution)');
  };

  const canProceed = () => {
    switch (step) {
      case 'metadata': return name && description && category;
      case 'trigger': return selectedTrigger !== null;
      case 'conditions': return true; // Conditions are optional
      case 'actions': return actions.length > 0;
      default: return true;
    }
  };

  return (
    <div className={styles.builder}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/admin/workflows')}>
          <ArrowLeft />
          Back to Workflows
        </button>
        <div className={styles.headerActions}>
          <button className={styles.testButton} onClick={handleTest} disabled={!selectedTrigger || actions.length === 0}>
            <Play />
            Test Workflow
          </button>
          <button className={styles.saveButton} onClick={handleSave} disabled={!canProceed()}>
            <Save />
            Save Workflow
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Panel - Builder Steps */}
        <div className={styles.builderPanel}>
          {/* Progress Steps */}
          <div className={styles.steps}>
            <div className={`${styles.stepItem} ${step === 'metadata' || name ? styles.active : ''}`} onClick={() => setStep('metadata')}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepLabel}>Workflow Info</div>
            </div>
            <div className={styles.stepDivider}></div>
            <div className={`${styles.stepItem} ${step === 'trigger' || selectedTrigger ? styles.active : ''}`} onClick={() => name && setStep('trigger')}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepLabel}>Trigger</div>
            </div>
            <div className={styles.stepDivider}></div>
            <div className={`${styles.stepItem} ${step === 'conditions' || conditions.length > 0 ? styles.active : ''}`} onClick={() => selectedTrigger && setStep('conditions')}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepLabel}>Conditions</div>
            </div>
            <div className={styles.stepDivider}></div>
            <div className={`${styles.stepItem} ${step === 'actions' || actions.length > 0 ? styles.active : ''}`} onClick={() => selectedTrigger && setStep('actions')}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepLabel}>Actions</div>
            </div>
          </div>

          {/* Step Content */}
          <div className={styles.stepContent}>
            {/* Metadata Step */}
            {step === 'metadata' && (
              <div className={styles.metadataForm}>
                <h2>Workflow Information</h2>
                <p className={styles.stepDescription}>Give your workflow a name and description</p>

                <div className={styles.formGroup}>
                  <label>Workflow Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Auto-Feature Quality Content"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this workflow does..."
                    className={styles.textarea}
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Select a category</option>
                    <option value="content_curation">Content Curation</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="moderation">Moderation</option>
                    <option value="engagement">Engagement</option>
                    <option value="user_management">User Management</option>
                  </select>
                </div>

                <button
                  className={styles.nextButton}
                  onClick={() => setStep('trigger')}
                  disabled={!canProceed()}
                >
                  Continue to Trigger
                  <ArrowRight />
                </button>
              </div>
            )}

            {/* Trigger Step */}
            {step === 'trigger' && (
              <div className={styles.triggerSelection}>
                <h2>Choose a Trigger</h2>
                <p className={styles.stepDescription}>What event should start this workflow?</p>

                {['Content', 'Users', 'Moderation', 'Events', 'Scheduled'].map(cat => {
                  const catTriggers = triggerOptions.filter(t => t.category === cat);
                  if (catTriggers.length === 0) return null;

                  return (
                    <div key={cat} className={styles.triggerCategory}>
                      <h3 className={styles.categoryTitle}>{cat}</h3>
                      <div className={styles.triggersGrid}>
                        {catTriggers.map(trigger => {
                          const Icon = trigger.icon;
                          return (
                            <div
                              key={trigger.id}
                              className={`${styles.triggerCard} ${selectedTrigger?.id === trigger.id ? styles.selected : ''}`}
                              onClick={() => setSelectedTrigger(trigger)}
                            >
                              <div className={styles.triggerIcon}>
                                <Icon />
                              </div>
                              <h4 className={styles.triggerLabel}>{trigger.label}</h4>
                              <p className={styles.triggerDescription}>{trigger.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <button
                  className={styles.nextButton}
                  onClick={() => setStep('conditions')}
                  disabled={!selectedTrigger}
                >
                  Continue to Conditions
                  <ArrowRight />
                </button>
              </div>
            )}

            {/* Conditions Step */}
            {step === 'conditions' && (
              <div className={styles.conditionsBuilder}>
                <h2>Add Conditions (Optional)</h2>
                <p className={styles.stepDescription}>Add filters to control when actions run</p>

                {conditions.map((condition) => (
                  <div key={condition.id} className={styles.conditionRow}>
                    <select
                      value={condition.field}
                      onChange={(e) => handleUpdateCondition(condition.id, { field: e.target.value })}
                      className={styles.select}
                    >
                      <option value="">Select field...</option>
                      {conditionOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>

                    {condition.field && (
                      <select
                        value={condition.operator}
                        onChange={(e) => handleUpdateCondition(condition.id, { operator: e.target.value })}
                        className={styles.select}
                      >
                        <option value="">Operator...</option>
                        {conditionOptions.find(o => o.id === condition.field)?.operators.map(op => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    )}

                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => handleUpdateCondition(condition.id, { value: e.target.value })}
                      placeholder="Value..."
                      className={styles.input}
                    />

                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveCondition(condition.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}

                <button className={styles.addButton} onClick={handleAddCondition}>
                  <Plus />
                  Add Condition
                </button>

                <div className={styles.navigationButtons}>
                  <button className={styles.skipButton} onClick={() => setStep('actions')}>
                    Skip Conditions
                  </button>
                  <button
                    className={styles.nextButton}
                    onClick={() => setStep('actions')}
                  >
                    Continue to Actions
                    <ArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Actions Step */}
            {step === 'actions' && (
              <div className={styles.actionsBuilder}>
                <h2>Choose Actions</h2>
                <p className={styles.stepDescription}>What should happen when conditions are met?</p>

                {/* Selected Actions */}
                {actions.length > 0 && (
                  <div className={styles.selectedActions}>
                    <h3>Selected Actions ({actions.length})</h3>
                    {actions.map((action) => {
                      const actionDef = actionOptions.find(a => a.id === action.type);
                      if (!actionDef) return null;
                      const Icon = actionDef.icon;

                      return (
                        <div key={action.id} className={styles.selectedAction}>
                          <div className={styles.actionHeader}>
                            <div className={styles.actionInfo}>
                              <Icon className={styles.actionIcon} />
                              <span>{actionDef.label}</span>
                            </div>
                            <button
                              className={styles.removeButton}
                              onClick={() => handleRemoveAction(action.id)}
                            >
                              <Trash2 />
                            </button>
                          </div>

                          {/* Action Configuration Fields */}
                          {actionDef.fields && actionDef.fields.map(field => (
                            <div key={field.name} className={styles.formGroup}>
                              <label>{field.placeholder}</label>
                              {field.type === 'select' ? (
                                <select
                                  value={action.config[field.name] || ''}
                                  onChange={(e) => handleUpdateActionConfig(action.id, field.name, e.target.value)}
                                  className={styles.select}
                                >
                                  <option value="">Select...</option>
                                  <option value="option1">Option 1</option>
                                  <option value="option2">Option 2</option>
                                </select>
                              ) : (
                                <input
                                  type={field.type}
                                  value={action.config[field.name] || ''}
                                  onChange={(e) => handleUpdateActionConfig(action.id, field.name, e.target.value)}
                                  placeholder={field.placeholder}
                                  className={styles.input}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Available Actions */}
                <h3 className={styles.availableTitle}>Available Actions</h3>
                {['Notifications', 'Content', 'Users', 'Moderation', 'Tasks'].map(cat => {
                  const catActions = actionOptions.filter(a => a.category === cat);
                  if (catActions.length === 0) return null;

                  return (
                    <div key={cat} className={styles.actionCategory}>
                      <h4 className={styles.categoryTitle}>{cat}</h4>
                      <div className={styles.actionsGrid}>
                        {catActions.map(action => {
                          const Icon = action.icon;
                          return (
                            <div
                              key={action.id}
                              className={styles.actionCard}
                              onClick={() => handleAddAction(action)}
                            >
                              <div className={styles.actionCardIcon}>
                                <Icon />
                              </div>
                              <h5 className={styles.actionCardLabel}>{action.label}</h5>
                              <p className={styles.actionCardDescription}>{action.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Visual Preview */}
        <div className={styles.previewPanel}>
          <h3 className={styles.previewTitle}>
            <Sparkles />
            Workflow Preview
          </h3>

          <div className={styles.flowPreview}>
            {/* Metadata */}
            {name && (
              <div className={styles.previewSection}>
                <h4 className={styles.workflowName}>{name}</h4>
                <p className={styles.workflowDescription}>{description}</p>
                {category && <span className={styles.workflowCategory}>{category.replace('_', ' ')}</span>}
              </div>
            )}

            {/* Trigger */}
            {selectedTrigger && (
              <div className={styles.flowStep}>
                <div className={styles.stepLabel}>
                  <Zap className={styles.stepIcon} />
                  When
                </div>
                <div className={styles.stepCard}>
                  {React.createElement(selectedTrigger.icon, { className: styles.cardIcon })}
                  <span>{selectedTrigger.label}</span>
                </div>
              </div>
            )}

            {/* Conditions */}
            {conditions.length > 0 && (
              <>
                <ArrowRight className={styles.flowArrow} />
                <div className={styles.flowStep}>
                  <div className={styles.stepLabel}>
                    <Target className={styles.stepIcon} />
                    If
                  </div>
                  <div className={styles.stepCard}>
                    {conditions.map((cond, idx) => {
                      const condDef = conditionOptions.find(c => c.id === cond.field);
                      return (
                        <div key={cond.id} className={styles.conditionPreview}>
                          {condDef?.label} {cond.operator} {cond.value}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <>
                <ArrowRight className={styles.flowArrow} />
                <div className={styles.flowStep}>
                  <div className={styles.stepLabel}>
                    <CheckCircle2 className={styles.stepIcon} />
                    Then
                  </div>
                  <div className={styles.stepCard}>
                    {actions.map((action) => {
                      const actionDef = actionOptions.find(a => a.id === action.type);
                      if (!actionDef) return null;
                      return (
                        <div key={action.id} className={styles.actionPreview}>
                          {React.createElement(actionDef.icon, { className: styles.cardIcon })}
                          <span>{actionDef.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {!selectedTrigger && (
              <div className={styles.emptyPreview}>
                <AlertCircle className={styles.emptyIcon} />
                <p>Build your workflow to see it visualized here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
