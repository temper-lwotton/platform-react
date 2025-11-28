import { Document, DocumentComment, DocumentVersion, DocumentCollaborator } from './documents';

// Mock collaborators
export const mockCollaborators: DocumentCollaborator[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        photo: '/avatars/sarah.jpg',
        role: 'editor',
        lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@example.com',
        photo: '/avatars/mike.jpg',
        role: 'editor',
        lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: '3',
        name: 'Emma Williams',
        email: 'emma@example.com',
        photo: '/avatars/emma.jpg',
        role: 'viewer',
        lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        id: '4',
        name: 'James Peterson',
        email: 'james@example.com',
        photo: '/avatars/james.jpg',
        role: 'commenter',
        lastActive: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
];

// Mock versions
export const mockVersions: DocumentVersion[] = [
    {
        id: 'v1',
        version: 1,
        createdAt: '2025-11-20T10:00:00Z',
        createdBy: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            photo: '/avatars/sarah.jpg',
        },
        changes: 'Initial draft created',
        size: 1234,
    },
    {
        id: 'v2',
        version: 2,
        createdAt: '2025-11-22T14:30:00Z',
        createdBy: {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@example.com',
            photo: '/avatars/mike.jpg',
        },
        changes: 'Added section on implementation timeline',
        size: 2456,
    },
    {
        id: 'v3',
        version: 3,
        createdAt: '2025-11-25T09:15:00Z',
        createdBy: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            photo: '/avatars/sarah.jpg',
        },
        changes: 'Updated budget estimates and added charts',
        size: 3892,
    },
];

// Mock comments
export const mockComments: DocumentComment[] = [
    {
        id: 'c1',
        authorId: '2',
        authorName: 'Mike Chen',
        authorPhoto: '/avatars/mike.jpg',
        content: 'Should we include more detail about the environmental impact?',
        position: 450,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        resolved: false,
    },
    {
        id: 'c2',
        authorId: '4',
        authorName: 'James Peterson',
        authorPhoto: '/avatars/james.jpg',
        content: 'Great analysis on the cost breakdown!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        resolved: true,
    },
    {
        id: 'c3',
        authorId: '3',
        authorName: 'Emma Williams',
        authorPhoto: '/avatars/emma.jpg',
        content: 'The timeline seems a bit ambitious. Can we extend Phase 2 by a month?',
        position: 1200,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        resolved: false,
        replies: [
            {
                id: 'c3r1',
                authorId: '1',
                authorName: 'Sarah Johnson',
                authorPhoto: '/avatars/sarah.jpg',
                content: 'Good point. Let me revise the timeline.',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
                resolved: false,
            },
        ],
    },
];

// Mock documents
export const mockDocuments: Document[] = [
    {
        id: '1',
        title: 'Urban Mobility Strategy 2025-2030',
        content: `# Urban Mobility Strategy 2025-2030

## Executive Summary

This comprehensive strategy outlines our vision for transforming urban transportation in major metropolitan areas over the next five years. Our focus is on creating sustainable, accessible, and efficient mobility solutions that reduce carbon emissions while improving quality of life for all residents.

## Key Objectives

1. **Reduce Carbon Emissions**: Achieve 40% reduction in transport-related emissions by 2030
2. **Improve Accessibility**: Ensure 95% of residents have access to public transport within 10 minutes
3. **Enhance Safety**: Reduce traffic accidents by 30%
4. **Promote Active Transport**: Increase cycling and walking by 50%

## Implementation Timeline

### Phase 1: Foundation (2025-2026)
- Infrastructure assessment and planning
- Stakeholder engagement and consultation
- Initial pilot programs in 3 districts

### Phase 2: Expansion (2027-2028)
- Roll out bike-sharing programs city-wide
- Upgrade public transport systems
- Implement smart traffic management

### Phase 3: Integration (2029-2030)
- Full system integration
- Performance monitoring and optimization
- Continuous improvement initiatives

## Budget Allocation

Total estimated budget: $450M over 5 years
- Infrastructure: 45%
- Technology: 25%
- Public Transport: 20%
- Community Programs: 10%`,
        excerpt: 'A comprehensive strategy for transforming urban transportation with a focus on sustainability and accessibility.',
        authorId: '1',
        authorName: 'Sarah Johnson',
        authorPhoto: '/avatars/sarah.jpg',
        spaceId: '23',
        spaceName: 'Tech Community',
        status: 'published',
        visibility: 'members',
        createdAt: '2025-11-20T10:00:00Z',
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        publishedAt: '2025-11-25T09:00:00Z',
        collaborators: mockCollaborators.slice(0, 3),
        tags: ['strategy', 'transport', 'sustainability'],
        wordCount: 245,
        versions: mockVersions,
        comments: mockComments,
        stats: {
            views: 234,
            edits: 47,
            comments: 12,
            activeCollaborators: 3,
        },
    },
    {
        id: '2',
        title: 'EV Charging Infrastructure Proposal',
        content: `# EV Charging Infrastructure Proposal

## Overview

This document outlines a comprehensive plan for deploying electric vehicle charging infrastructure across the metropolitan area.

## Current Situation

- Only 150 public charging stations currently available
- Average wait time: 45 minutes
- Limited coverage in suburban areas

## Proposed Solution

Deploy 2,000 new charging stations over 24 months with strategic placement based on:
- Population density
- Traffic patterns
- Existing infrastructure
- Future development plans`,
        excerpt: 'Comprehensive plan for deploying EV charging infrastructure across the metropolitan area.',
        authorId: '4',
        authorName: 'James Peterson',
        authorPhoto: '/avatars/james.jpg',
        spaceId: '28',
        spaceName: 'Innovation Hub',
        status: 'published',
        visibility: 'public',
        createdAt: '2025-11-18T14:00:00Z',
        updatedAt: '2025-11-26T11:30:00Z',
        publishedAt: '2025-11-19T09:00:00Z',
        collaborators: [mockCollaborators[3], mockCollaborators[1]],
        tags: ['infrastructure', 'EV', 'planning'],
        wordCount: 156,
        versions: mockVersions.slice(0, 2),
        stats: {
            views: 456,
            edits: 23,
            comments: 8,
            activeCollaborators: 2,
        },
    },
    {
        id: '3',
        title: 'Community Transport Survey Results',
        content: `# Community Transport Survey Results

## Survey Overview

We conducted a comprehensive survey of 5,000 residents to understand their transportation needs and preferences.

## Key Findings

### Current Usage Patterns
- 45% use private vehicles daily
- 30% rely on public transport
- 15% use cycling/walking
- 10% use ride-sharing services

### Pain Points
1. Limited public transport coverage
2. Long wait times
3. Safety concerns for cyclists
4. Lack of integrated payment systems`,
        excerpt: 'Results from our comprehensive community transport survey of 5,000 residents.',
        authorId: '3',
        authorName: 'Emma Williams',
        authorPhoto: '/avatars/emma.jpg',
        spaceId: '23',
        spaceName: 'Tech Community',
        status: 'draft',
        visibility: 'members',
        createdAt: '2025-11-26T09:00:00Z',
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        collaborators: [mockCollaborators[2], mockCollaborators[0]],
        tags: ['research', 'survey', 'community'],
        wordCount: 128,
        versions: mockVersions.slice(0, 1),
        stats: {
            views: 89,
            edits: 15,
            comments: 5,
            activeCollaborators: 2,
        },
    },
    {
        id: '4',
        title: 'Bike Lane Safety Guidelines',
        content: `# Bike Lane Safety Guidelines

## Introduction

These guidelines establish best practices for designing and maintaining safe cycling infrastructure.

## Design Principles

1. **Separation**: Physical barriers between bike lanes and vehicle traffic
2. **Visibility**: Clear markings and signage
3. **Continuity**: Uninterrupted routes across the network
4. **Accessibility**: Smooth surfaces and proper width

## Maintenance Standards

- Weekly inspections
- Immediate repair of hazards
- Seasonal cleaning programs
- Snow removal within 24 hours`,
        excerpt: 'Best practices for designing and maintaining safe cycling infrastructure.',
        authorId: '2',
        authorName: 'Mike Chen',
        authorPhoto: '/avatars/mike.jpg',
        spaceId: '28',
        spaceName: 'Innovation Hub',
        status: 'published',
        visibility: 'public',
        createdAt: '2025-11-15T10:00:00Z',
        updatedAt: '2025-11-24T15:45:00Z',
        publishedAt: '2025-11-16T08:00:00Z',
        collaborators: [mockCollaborators[1]],
        tags: ['safety', 'cycling', 'infrastructure'],
        wordCount: 142,
        versions: mockVersions.slice(0, 2),
        stats: {
            views: 678,
            edits: 31,
            comments: 18,
            activeCollaborators: 1,
        },
    },
    {
        id: '5',
        title: 'Meeting Notes - Nov 28 Planning Session',
        content: `# Planning Session - November 28, 2025

## Attendees
- Sarah Johnson
- Mike Chen
- Emma Williams
- James Peterson

## Agenda Items

### 1. Q1 2026 Initiatives Review
- Discussed progress on bike-sharing program
- Reviewed budget allocation
- Identified resource needs

### 2. Community Feedback
- Positive response to new bus routes
- Concerns about parking availability
- Requests for extended service hours

### 3. Action Items
- [ ] Sarah: Finalize Q1 budget proposal
- [ ] Mike: Schedule community town hall
- [ ] Emma: Complete survey analysis
- [ ] James: Review infrastructure bids`,
        excerpt: 'Notes from our November 28 planning session covering Q1 initiatives and community feedback.',
        authorId: '1',
        authorName: 'Sarah Johnson',
        authorPhoto: '/avatars/sarah.jpg',
        spaceId: '23',
        spaceName: 'Tech Community',
        status: 'draft',
        visibility: 'private',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        collaborators: mockCollaborators,
        tags: ['meeting-notes', 'planning'],
        wordCount: 98,
        versions: mockVersions.slice(0, 1),
        stats: {
            views: 12,
            edits: 8,
            comments: 3,
            activeCollaborators: 4,
        },
    },
];

// Helper function to get document by ID
export function getDocumentById(id: string): Document | undefined {
    return mockDocuments.find(d => d.id === id);
}

// Helper function to filter documents
export function filterDocuments(filter: 'all' | 'published' | 'draft' | 'archived'): Document[] {
    if (filter === 'all') return mockDocuments;
    return mockDocuments.filter(d => d.status === filter);
}

// Helper function to search documents
export function searchDocuments(query: string): Document[] {
    const lowerQuery = query.toLowerCase();
    return mockDocuments.filter(d =>
        d.title.toLowerCase().includes(lowerQuery) ||
        d.content.toLowerCase().includes(lowerQuery) ||
        d.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}
