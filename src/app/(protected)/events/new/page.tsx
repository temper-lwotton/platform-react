'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Separator from '@radix-ui/react-separator';
import Link from 'next/link';
import { createEventWithPhoto } from '@/lib/events';
import { getCurrentUserId, fetchCurrentUser } from '@/lib/auth';
import { getSpace, Space } from '@/lib/spaces';
import { LexicalEditor } from '@/components/ui/LexicalEditor';

export default function NewGlobalEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // UI state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentUserId(getCurrentUserId());
  }, []);

  // Fetch current user with their spaces
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
    enabled: isClient && !!currentUserId,
  });

  // Get space IDs from user data
  const userSpaceIds = userData
    ? [...userData.adminSpaces, ...userData.memberSpaces].map(s => String(s.id))
    : [];

  // Fetch full details for each space
  const spaceQueries = useQuery({
    queryKey: ['user-spaces', userSpaceIds],
    queryFn: async () => {
      if (userSpaceIds.length === 0) return [];
      const spaces = await Promise.all(
        userSpaceIds.map(id => getSpace(id))
      );
      return spaces;
    },
    enabled: userSpaceIds.length > 0,
  });

  const userSpaces = spaceQueries.data || [];
  const spacesLoading = userLoading || spaceQueries.isLoading;

  // Find selected space for display
  const selectedSpace = userSpaces.find(s => String(s.id) === selectedSpaceId);

  // Helper to get member count
  const getMemberCount = (space: Space) => {
    return space.members.length + space.admins.length;
  };

  // Handle space selection
  const handleSpaceSelect = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    setIsPopoverOpen(false);
  };

  const handleEditorChange = (plainText: string, html: string) => {
    setContent(plainText);
    setHtmlContent(html);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // Helper function to convert datetime-local to ISO 8601
  const toISO8601 = (dateTimeLocal: string): string => {
    const date = new Date(dateTimeLocal);
    return date.toISOString();
  };

  const createMutation = useMutation({
    mutationFn: () => {
      const jsonContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: content ? [{ type: 'text', text: content }] : [],
          },
        ],
      };

      const payload: any = {
        title: title.trim(),
        space: Number(selectedSpaceId),
        startDateTime: toISO8601(startDateTime),
        endDateTime: toISO8601(endDateTime),
        htmlContent: htmlContent || `<p>${content.trim()}</p>`,
        jsonContent,
        isOnline,
      };

      if (!isOnline && location.trim()) {
        payload.location = location.trim();
      }

      if (link.trim()) {
        payload.link = link.trim();
      }

      // Use createEventWithPhoto to handle photo upload
      return createEventWithPhoto(payload, photoFile || undefined);
    },
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['space-events', selectedSpaceId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      router.push(`/events/${newEvent.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      createMutation.mutate();
    }
  };

  // Form validation
  const isFormValid =
    title.trim() &&
    (htmlContent || content.trim()) &&
    startDateTime &&
    endDateTime &&
    selectedSpaceId &&
    currentUserId &&
    (!isOnline ? location.trim() : true);

  // Helper to format datetime-local input value
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set default start time to tomorrow at 10:00 AM
  useEffect(() => {
    if (!startDateTime) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      setStartDateTime(formatDateForInput(tomorrow));

      const endTime = new Date(tomorrow);
      endTime.setHours(endTime.getHours() + 2);
      setEndDateTime(formatDateForInput(endTime));
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="new-event-page">
      <Link href="/events" className="event-back-link">
        ← Back to Events
      </Link>

      <h1 className="new-event-title">Create a New Event</h1>

      <form className="new-event-form" onSubmit={handleSubmit}>
        {/* Space Selection */}
        <div className="form-field">
          <Label.Root className="form-label">
            Space <span className="form-required">*</span>
          </Label.Root>
          <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="space-selector-trigger"
                disabled={spacesLoading}
                aria-label="Select space"
              >
                {selectedSpace ? (
                  <div className="space-selector-trigger-content">
                    <div className="space-selector-trigger-title">
                      {selectedSpace.title}
                    </div>
                    <div className="space-selector-trigger-meta">
                      {selectedSpace.subtitle && (
                        <span>{selectedSpace.subtitle}</span>
                      )}
                      {selectedSpace.subtitle && <span className="space-meta-separator">•</span>}
                      <span>{getMemberCount(selectedSpace)} members</span>
                    </div>
                  </div>
                ) : (
                  <span className="space-selector-placeholder">Select a space...</span>
                )}
                <span className="space-selector-icon">▼</span>
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className="space-selector-content"
                align="start"
                sideOffset={8}
              >
                <RadioGroup.Root
                  value={selectedSpaceId}
                  onValueChange={handleSpaceSelect}
                >
                  {spacesLoading ? (
                    <div className="space-selector-loading">Loading spaces...</div>
                  ) : userSpaces.length === 0 ? (
                    <div className="space-selector-empty">No spaces available</div>
                  ) : (
                    userSpaces.map((space) => {
                      const memberCount = getMemberCount(space);
                      return (
                        <label
                          key={space.id}
                          className="space-selector-item"
                          htmlFor={`space-${space.id}`}
                        >
                          <RadioGroup.Item
                            value={String(space.id)}
                            id={`space-${space.id}`}
                            className="space-radio"
                          >
                            <RadioGroup.Indicator className="space-radio-indicator" />
                          </RadioGroup.Item>
                          <div className="space-info">
                            <div className="space-info-title">
                              {space.title}
                            </div>
                            <div className="space-info-meta">
                              {space.subtitle && (
                                <span>{space.subtitle}</span>
                              )}
                              {space.subtitle && <span className="space-meta-separator">•</span>}
                              <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })
                  )}
                </RadioGroup.Root>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <p className="form-help-text">
            Choose which space this event belongs to
          </p>
        </div>

        {/* Title */}
        <div className="form-field">
          <Label.Root htmlFor="title" className="form-label">
            Event Title <span className="form-required">*</span>
          </Label.Root>
          <input
            id="title"
            type="text"
            className="form-input"
            placeholder="Enter event title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={createMutation.isPending}
            required
          />
        </div>

        {/* Event Photo */}
        <div className="form-field">
          <Label.Root htmlFor="photo" className="form-label">
            Event Photo
          </Label.Root>
          {photoPreview ? (
            <div className="photo-preview-container">
              <img src={photoPreview} alt="Event preview" className="photo-preview" />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="photo-remove-button"
                disabled={createMutation.isPending}
              >
                Remove Photo
              </button>
            </div>
          ) : (
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handlePhotoChange}
              disabled={createMutation.isPending}
            />
          )}
          <p className="form-help-text">
            Upload a photo for your event (optional)
          </p>
        </div>

        {/* Date and Time */}
        <Separator.Root className="form-separator" />
        <h2 className="form-section-title">Date & Time</h2>

        <div className="form-row">
          <div className="form-field form-field--half">
            <Label.Root htmlFor="startDateTime" className="form-label">
              Start Date & Time <span className="form-required">*</span>
            </Label.Root>
            <input
              id="startDateTime"
              type="datetime-local"
              className="form-input"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              disabled={createMutation.isPending}
              required
            />
          </div>

          <div className="form-field form-field--half">
            <Label.Root htmlFor="endDateTime" className="form-label">
              End Date & Time <span className="form-required">*</span>
            </Label.Root>
            <input
              id="endDateTime"
              type="datetime-local"
              className="form-input"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              disabled={createMutation.isPending}
              required
              min={startDateTime}
            />
          </div>
        </div>

        {/* Location */}
        <Separator.Root className="form-separator" />
        <h2 className="form-section-title">Location</h2>

        <div className="form-field">
          <div className="form-checkbox-wrapper">
            <Checkbox.Root
              id="isOnline"
              className="form-checkbox"
              checked={isOnline}
              onCheckedChange={(checked) => setIsOnline(checked === true)}
              disabled={createMutation.isPending}
            >
              <Checkbox.Indicator className="form-checkbox-indicator">
                ✓
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Label.Root htmlFor="isOnline" className="form-checkbox-label">
              This is an online event
            </Label.Root>
          </div>
        </div>

        {!isOnline && (
          <div className="form-field">
            <Label.Root htmlFor="location" className="form-label">
              Physical Location <span className="form-required">*</span>
            </Label.Root>
            <input
              id="location"
              type="text"
              className="form-input"
              placeholder="Enter venue address or location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={createMutation.isPending}
              required={!isOnline}
            />
            <p className="form-help-text">
              Provide the full address or location details for attendees
            </p>
          </div>
        )}

        {/* Event Link */}
        <div className="form-field">
          <Label.Root htmlFor="link" className="form-label">
            Event Link
          </Label.Root>
          <input
            id="link"
            type="url"
            className="form-input"
            placeholder="https://example.com/event"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={createMutation.isPending}
          />
          <p className="form-help-text">
            {isOnline
              ? 'Meeting link, Zoom URL, or event registration page'
              : 'Event website, registration page, or additional information'}
          </p>
        </div>

        {/* Description */}
        <Separator.Root className="form-separator" />
        <h2 className="form-section-title">Event Description</h2>

        <div className="form-field">
          <Label.Root htmlFor="description" className="form-label">
            Description <span className="form-required">*</span>
          </Label.Root>
          <div className="form-editor-wrapper">
            <LexicalEditor
              value={content}
              onChange={handleEditorChange}
              placeholder="Describe your event... What will attendees learn or experience?"
              disabled={createMutation.isPending}
              mode="advanced"
            />
          </div>
          <p className="form-help-text">
            Provide details about the event, agenda, speakers, and what attendees can expect
          </p>
        </div>

        {/* Error Display */}
        {createMutation.isError && (
          <div className="form-error-box">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Failed to create event. Please try again.'}
          </div>
        )}

        {/* Form Actions */}
        <div className="new-event-actions">
          <Link href="/events" className="new-event-cancel">
            Cancel
          </Link>
          <button
            type="submit"
            className="form-button new-event-submit"
            disabled={!isFormValid || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
