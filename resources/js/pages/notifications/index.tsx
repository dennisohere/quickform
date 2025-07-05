import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
}

interface Props {
  notifications: {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Notifications',
    href: '/notifications',
  },
];

export default function NotificationsIndex({ notifications }: Props) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'survey_response':
        return <Bell className="w-5 h-5 text-primary" />;
      case 'survey_completion':
        return <Check className="w-5 h-5 text-success" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-warning" />;
      default:
        return <Bell className="w-5 h-5 text-base-content" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'survey_response':
      case 'survey_completion':
        return route('admin.analytics.survey', { survey: notification.data.survey_id });
      case 'reminder':
        return route('admin.surveys.show', { survey: notification.data.survey_id });
      default:
        return '#';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <button className="d-btn d-btn-ghost d-btn-sm">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          
          {notifications.data.some(n => !n.read_at) && (
            <Link href="/notifications/mark-all-read" method="patch" as="button" className="d-btn d-btn-outline d-btn-sm">
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Link>
          )}
        </div>

        <div className="d-card bg-base-100 shadow-xl">
          <div className="d-card-body">
            {notifications.data.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-base-content/70">You're all caught up! Check back later for new updates.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.data.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.read_at 
                        ? 'bg-base-100 border-base-300' 
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-medium ${notification.read_at ? 'text-base-content/70' : 'text-base-content'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-base-content/50">
                              {formatDate(notification.created_at)}
                            </span>
                            {!notification.read_at && (
                              <Link 
                                href={`/notifications/${notification.id}/read`} 
                                method="patch" 
                                as="button"
                                className="d-btn d-btn-ghost d-btn-xs"
                              >
                                <Check className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                        
                        <p className={`text-sm ${notification.read_at ? 'text-base-content/70' : 'text-base-content'}`}>
                          {notification.message}
                        </p>
                        
                        {notification.data.survey_id && (
                          <div className="mt-3">
                            <Link 
                              href={getNotificationLink(notification)}
                              className="d-btn d-btn-outline d-btn-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {notifications.last_page > 1 && (
          <div className="flex justify-center">
            <div className="d-join">
              {Array.from({ length: notifications.last_page }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/notifications?page=${page}`}
                  className={`d-join-item d-btn d-btn-sm ${
                    page === notifications.current_page ? 'd-btn-active' : ''
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 