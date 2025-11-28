'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

type ScheduleType = 'now' | 'later';

export default function NewWebinarPage() {
    const router = useRouter();
    const [scheduleType, setScheduleType] = useState<ScheduleType>('now');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        spaceId: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: '60',
        enableChat: true,
        enableQA: true,
        enableRecording: false,
        requireRegistration: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real app, this would create the webinar via API
        console.log('Creating webinar:', { ...formData, scheduleType });

        // For now, redirect to webinars page
        // In a real app with live webinars, would redirect to /webinars/[id]/room
        router.push('/webinars');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <main className="webinar-create-page">
            <div className="webinar-create-container">
                {/* Header */}
                <header className="webinar-create-header">
                    <Link href="/webinars" className="webinar-create-back">
                        <Icon icon="arrowLeft" size={20} />
                        Back to Webinars
                    </Link>
                    <h1 className="webinar-create-title">Create Webinar</h1>
                    <p className="webinar-create-subtitle">
                        Set up your live or scheduled webinar
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="webinar-create-form">
                    {/* Schedule Type */}
                    <section className="webinar-create-section">
                        <h2 className="webinar-create-section-title">When?</h2>
                        <div className="webinar-schedule-options">
                            <button
                                type="button"
                                className={`webinar-schedule-option ${scheduleType === 'now' ? 'webinar-schedule-option--active' : ''}`}
                                onClick={() => setScheduleType('now')}
                            >
                                <Icon icon="video" size={24} />
                                <div className="webinar-schedule-option-content">
                                    <div className="webinar-schedule-option-title">Start Now</div>
                                    <div className="webinar-schedule-option-description">
                                        Begin your webinar immediately
                                    </div>
                                </div>
                            </button>
                            <button
                                type="button"
                                className={`webinar-schedule-option ${scheduleType === 'later' ? 'webinar-schedule-option--active' : ''}`}
                                onClick={() => setScheduleType('later')}
                            >
                                <Icon icon="calendar" size={24} />
                                <div className="webinar-schedule-option-content">
                                    <div className="webinar-schedule-option-title">Schedule for Later</div>
                                    <div className="webinar-schedule-option-description">
                                        Set a date and time for your webinar
                                    </div>
                                </div>
                            </button>
                        </div>

                        {scheduleType === 'later' && (
                            <div className="webinar-schedule-fields">
                                <div className="webinar-form-row">
                                    <div className="webinar-form-field">
                                        <label htmlFor="scheduledDate" className="webinar-form-label">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            id="scheduledDate"
                                            name="scheduledDate"
                                            value={formData.scheduledDate}
                                            onChange={handleChange}
                                            className="webinar-form-input"
                                            required={scheduleType === 'later'}
                                        />
                                    </div>
                                    <div className="webinar-form-field">
                                        <label htmlFor="scheduledTime" className="webinar-form-label">
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            id="scheduledTime"
                                            name="scheduledTime"
                                            value={formData.scheduledTime}
                                            onChange={handleChange}
                                            className="webinar-form-input"
                                            required={scheduleType === 'later'}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Basic Info */}
                    <section className="webinar-create-section">
                        <h2 className="webinar-create-section-title">Basic Information</h2>

                        <div className="webinar-form-field">
                            <label htmlFor="title" className="webinar-form-label">
                                Webinar Title <span className="webinar-form-required">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="webinar-form-input"
                                placeholder="e.g., Future of Urban Mobility"
                                required
                            />
                        </div>

                        <div className="webinar-form-field">
                            <label htmlFor="description" className="webinar-form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="webinar-form-textarea"
                                placeholder="Provide details about your webinar..."
                                rows={4}
                            />
                        </div>

                        <div className="webinar-form-row">
                            <div className="webinar-form-field">
                                <label htmlFor="spaceId" className="webinar-form-label">
                                    Space
                                </label>
                                <select
                                    id="spaceId"
                                    name="spaceId"
                                    value={formData.spaceId}
                                    onChange={handleChange}
                                    className="webinar-form-select"
                                >
                                    <option value="">Select a space (optional)</option>
                                    <option value="23">Electric Vehicle Innovation Hub</option>
                                    <option value="28">Sustainable Transport Alliance</option>
                                    <option value="15">Future Mobility Network</option>
                                </select>
                            </div>

                            <div className="webinar-form-field">
                                <label htmlFor="duration" className="webinar-form-label">
                                    Duration (minutes)
                                </label>
                                <select
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="webinar-form-select"
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Settings */}
                    <section className="webinar-create-section">
                        <h2 className="webinar-create-section-title">Settings</h2>

                        <div className="webinar-settings-grid">
                            <label className="webinar-setting-item">
                                <input
                                    type="checkbox"
                                    name="enableChat"
                                    checked={formData.enableChat}
                                    onChange={handleChange}
                                    className="webinar-setting-checkbox"
                                />
                                <div className="webinar-setting-content">
                                    <div className="webinar-setting-title">Enable Chat</div>
                                    <div className="webinar-setting-description">
                                        Allow attendees to chat during the webinar
                                    </div>
                                </div>
                            </label>

                            <label className="webinar-setting-item">
                                <input
                                    type="checkbox"
                                    name="enableQA"
                                    checked={formData.enableQA}
                                    onChange={handleChange}
                                    className="webinar-setting-checkbox"
                                />
                                <div className="webinar-setting-content">
                                    <div className="webinar-setting-title">Enable Q&A</div>
                                    <div className="webinar-setting-description">
                                        Allow attendees to ask questions
                                    </div>
                                </div>
                            </label>

                            <label className="webinar-setting-item">
                                <input
                                    type="checkbox"
                                    name="enableRecording"
                                    checked={formData.enableRecording}
                                    onChange={handleChange}
                                    className="webinar-setting-checkbox"
                                />
                                <div className="webinar-setting-content">
                                    <div className="webinar-setting-title">Record Webinar</div>
                                    <div className="webinar-setting-description">
                                        Save a recording for later viewing
                                    </div>
                                </div>
                            </label>

                            <label className="webinar-setting-item">
                                <input
                                    type="checkbox"
                                    name="requireRegistration"
                                    checked={formData.requireRegistration}
                                    onChange={handleChange}
                                    className="webinar-setting-checkbox"
                                />
                                <div className="webinar-setting-content">
                                    <div className="webinar-setting-title">Require Registration</div>
                                    <div className="webinar-setting-description">
                                        Attendees must register before joining
                                    </div>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="webinar-create-actions">
                        <Link href="/webinars" className="webinar-create-cancel">
                            Cancel
                        </Link>
                        <button type="submit" className="webinar-create-submit">
                            <Icon icon="video" size={20} />
                            {scheduleType === 'now' ? 'Start Webinar' : 'Schedule Webinar'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
