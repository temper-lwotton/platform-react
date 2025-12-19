'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Radio,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Send,
  Eye,
  Calendar,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import styles from './BroadcastsList.module.scss';

// Mock data - will be replaced with API calls
const mockBroadcasts = [
  {
    id: 1,
    name: 'Welcome Series - Week 1',
    subject: 'Welcome to our community!',
    status: 'sent',
    recipients: 1245,
    openRate: 42.5,
    clickRate: 12.3,
    sentAt: new Date('2024-12-01'),
    createdAt: new Date('2024-11-28'),
  },
  {
    id: 2,
    name: 'Product Launch Announcement',
    subject: 'Introducing our newest feature',
    status: 'scheduled',
    recipients: 3421,
    scheduledFor: new Date('2024-12-15'),
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 3,
    name: 'Monthly Newsletter - December',
    subject: 'Your December Update',
    status: 'draft',
    recipients: 0,
    createdAt: new Date('2024-12-11'),
  },
];

type BroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';

export function BroadcastsList() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BroadcastStatus | ''>('');
  const [selectedBroadcasts, setSelectedBroadcasts] = useState<number[]>([]);

  // Filter broadcasts based on search and status
  const filteredBroadcasts = mockBroadcasts.filter((broadcast) => {
    const matchesSearch =
      search === '' ||
      broadcast.name.toLowerCase().includes(search.toLowerCase()) ||
      broadcast.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === '' || broadcast.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this broadcast?')) {
      console.log('Delete broadcast:', id);
      // TODO: Implement delete
    }
  };

  const handleDuplicate = (id: number) => {
    console.log('Duplicate broadcast:', id);
    // TODO: Implement duplicate
  };

  const toggleBroadcastSelection = (id: number) => {
    setSelectedBroadcasts((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const toggleAllBroadcasts = () => {
    if (selectedBroadcasts.length === filteredBroadcasts.length) {
      setSelectedBroadcasts([]);
    } else {
      setSelectedBroadcasts(filteredBroadcasts.map((b) => b.id));
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'sent':
        return styles.sent;
      case 'scheduled':
        return styles.scheduled;
      case 'sending':
        return styles.sending;
      case 'draft':
        return styles.draft;
      case 'paused':
        return styles.paused;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Broadcasts</h1>
          <p className={styles.subtitle}>Create and manage email campaigns</p>
        </div>
        <Link href="/admin/broadcasts/new" className={styles.createButton}>
          <Plus className={styles.buttonIcon} />
          Create Broadcast
        </Link>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Send className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Sent</div>
            <div className={styles.statValue}>1</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Scheduled</div>
            <div className={styles.statValue}>1</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg. Recipients</div>
            <div className={styles.statValue}>2,333</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Eye className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Avg. Open Rate</div>
            <div className={styles.statValue}>42.5%</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search broadcasts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as BroadcastStatus | '')}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="sending">Sending</option>
          <option value="sent">Sent</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedBroadcasts.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.bulkCount}>{selectedBroadcasts.length} selected</span>
          <button
            onClick={() => console.log('Bulk delete')}
            className={styles.bulkDeleteButton}
          >
            <Trash2 className={styles.buttonIcon} />
            Delete Selected
          </button>
        </div>
      )}

      {/* Broadcasts Table */}
      {filteredBroadcasts.length === 0 ? (
        <div className={styles.empty}>
          <Radio className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No broadcasts found</h3>
          <p className={styles.emptyText}>Create your first email campaign to get started</p>
          <Link href="/admin/broadcasts/new" className={styles.emptyButton}>
            <Plus className={styles.buttonIcon} />
            Create Broadcast
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedBroadcasts.length === filteredBroadcasts.length}
                      onChange={toggleAllBroadcasts}
                      className={styles.checkbox}
                    />
                  </th>
                  <th>Campaign Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Recipients</th>
                  <th>Performance</th>
                  <th>Date</th>
                  <th className={styles.actionsCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBroadcasts.map((broadcast) => (
                  <tr key={broadcast.id} className={styles.tableRow}>
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={selectedBroadcasts.includes(broadcast.id)}
                        onChange={() => toggleBroadcastSelection(broadcast.id)}
                        className={styles.checkbox}
                      />
                    </td>
                    <td>
                      <Link
                        href={`/admin/broadcasts/${broadcast.id}/edit`}
                        className={styles.broadcastName}
                      >
                        {broadcast.name}
                      </Link>
                    </td>
                    <td className={styles.subject}>{broadcast.subject}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                          broadcast.status
                        )}`}
                      >
                        {broadcast.status.charAt(0).toUpperCase() + broadcast.status.slice(1)}
                      </span>
                    </td>
                    <td className={styles.recipients}>
                      {broadcast.recipients > 0 ? broadcast.recipients.toLocaleString() : '-'}
                    </td>
                    <td className={styles.performance}>
                      {broadcast.status === 'sent' ? (
                        <div className={styles.performanceStats}>
                          <span className={styles.performanceStat}>
                            {broadcast.openRate}% opens
                          </span>
                          <span className={styles.performanceStat}>
                            {broadcast.clickRate}% clicks
                          </span>
                        </div>
                      ) : (
                        <span className={styles.noPerformance}>-</span>
                      )}
                    </td>
                    <td className={styles.date}>
                      {broadcast.status === 'sent' && broadcast.sentAt ? (
                        <span>Sent {format(broadcast.sentAt, 'MMM d, yyyy')}</span>
                      ) : broadcast.status === 'scheduled' && broadcast.scheduledFor ? (
                        <span>
                          <Calendar className={styles.dateIcon} />
                          {format(broadcast.scheduledFor, 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span>{format(broadcast.createdAt, 'MMM d, yyyy')}</span>
                      )}
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/broadcasts/${broadcast.id}/edit`}
                          className={styles.actionButton}
                          title="Edit"
                        >
                          <Edit className={styles.actionIcon} />
                        </Link>
                        {broadcast.status === 'sent' && (
                          <Link
                            href={`/admin/broadcasts/${broadcast.id}/report`}
                            className={styles.actionButton}
                            title="View Report"
                          >
                            <Eye className={styles.actionIcon} />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDuplicate(broadcast.id)}
                          className={styles.actionButton}
                          title="Duplicate"
                        >
                          <Copy className={styles.actionIcon} />
                        </button>
                        {broadcast.status === 'draft' && (
                          <button
                            onClick={() => handleDelete(broadcast.id)}
                            className={`${styles.actionButton} ${styles.danger}`}
                            title="Delete"
                          >
                            <Trash2 className={styles.actionIcon} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
