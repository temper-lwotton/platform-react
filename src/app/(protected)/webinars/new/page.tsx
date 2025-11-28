'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Input, Textarea, Checkbox, Button } from '@/components/ui/primitives';
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
                                    <Input
                                        type="date"
                                        id="scheduledDate"
                                        name="scheduledDate"
                                        label="Date"
                                        value={formData.scheduledDate}
                                        onChange={handleChange}
                                        required={scheduleType === 'later'}
                                        fullWidth
                                    />
                                    <Input
                                        type="time"
                                        id="scheduledTime"
                                        name="scheduledTime"
                                        label="Time"
                                        value={formData.scheduledTime}
                                        onChange={handleChange}
                                        required={scheduleType === 'later'}
                                        fullWidth
                                    />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Basic Info */}
                    <section className="webinar-create-section">
                        <h2 className="webinar-create-section-title">Basic Information</h2>

                        <Input
                            type="text"
                            id="title"
                            name="title"
                            label="Webinar Title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Future of Urban Mobility"
                            required
                            fullWidth
                        />

                        <Textarea
                            id="description"
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide details about your webinar..."
                            rows={4}
                            fullWidth
                        />

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
                            <Checkbox
                                name="enableChat"
                                checked={formData.enableChat}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableChat: checked as boolean }))}
                                label="Enable Chat"
                                helperText="Allow attendees to chat during the webinar"
                            />

                            <Checkbox
                                name="enableQA"
                                checked={formData.enableQA}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableQA: checked as boolean }))}
                                label="Enable Q&A"
                                helperText="Allow attendees to ask questions"
                            />

                            <Checkbox
                                name="enableRecording"
                                checked={formData.enableRecording}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableRecording: checked as boolean }))}
                                label="Record Webinar"
                                helperText="Save a recording for later viewing"
                            />

                            <Checkbox
                                name="requireRegistration"
                                checked={formData.requireRegistration}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requireRegistration: checked as boolean }))}
                                label="Require Registration"
                                helperText="Attendees must register before joining"
                            />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="webinar-create-actions">
                        <Link href="/webinars" className="webinar-create-cancel">
                            Cancel
                        </Link>
                        <Button type="submit" variant="primary" size="lg">
                            <Icon icon="video" size={20} />
                            {scheduleType === 'now' ? 'Start Webinar' : 'Schedule Webinar'}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
