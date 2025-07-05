# Notification System

The QuickForm application includes a comprehensive email notification system that keeps survey creators informed about their survey activity.

## Features

### 1. Survey Response Notifications

- **Triggered**: When someone starts responding to a survey (answers the first question)
- **Content**: Informs the survey creator about new responses
- **Action**: Links to survey analytics

### 2. Survey Completion Notifications

- **Triggered**: When someone completes a survey
- **Content**: Informs the survey creator about completed responses
- **Action**: Links to survey analytics

### 3. Reminder Notifications

- **Unpublished Surveys**: Reminds creators about unpublished surveys older than 3 days
- **No Responses**: Reminds creators about published surveys with no responses after 7 days
- **Action**: Links to the survey management page

### 4. Daily Digest

- **Schedule**: Sent daily at 9:00 AM
- **Content**: Summary of all survey activity from the past 24 hours
- **Action**: Links to analytics dashboard

## Configuration

### Mail Settings

Update your `.env` file with your mail provider settings:

```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=noreply@yourapp.com
MAIL_FROM_NAME="Your App Name"
```

### Queue Settings

The system uses Laravel queues for background processing:

```env
QUEUE_CONNECTION=database
```

## Scheduled Tasks

The following tasks are automatically scheduled:

- **Hourly**: Send pending notifications
- **Daily at 9:00 AM**: Send daily digest
- **Daily at 10:00 AM**: Send reminder notifications

### Setting up Cron Jobs

Add this to your server's crontab to run scheduled tasks:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## Manual Commands

### Send Pending Notifications

```bash
php artisan notifications:send
```

### Send Daily Digest

```bash
php artisan notifications:send --digest
```

### Send Reminders

```bash
php artisan notifications:reminders
```

### Send Specific Reminder Types

```bash
php artisan notifications:reminders --type=unpublished
php artisan notifications:reminders --type=no-responses
```

## Queue Processing

To process queued notifications, run:

```bash
php artisan queue:work
```

For production, use a process manager like Supervisor to keep the queue worker running.

## Email Templates

### Individual Notifications (`resources/views/emails/notification.blade.php`)

- Clean, professional design
- Survey-specific information
- Direct action buttons
- Responsive layout

### Daily Digest (`resources/views/emails/daily-digest.blade.php`)

- Summary of all activity
- Organized by notification type
- Links to analytics dashboard

## Database Schema

### Notifications Table

- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users
- `type` (string): Notification type (survey_response, survey_completion, reminder)
- `title` (string): Notification title
- `message` (text): Notification message
- `data` (JSON): Additional context data
- `sent_at` (timestamp): When email was sent
- `read_at` (timestamp): When notification was read
- `created_at` (timestamp): When notification was created
- `updated_at` (timestamp): Last update

## Testing

Run the notification tests:

```bash
php artisan test --filter=NotificationTest
```

## Troubleshooting

### Notifications Not Sending

1. Check mail configuration in `.env`
2. Verify queue worker is running: `php artisan queue:work`
3. Check failed jobs: `php artisan queue:failed`
4. Review logs: `tail -f storage/logs/laravel.log`

### Scheduled Tasks Not Running

1. Verify cron job is set up correctly
2. Check if `schedule:run` command works manually
3. Ensure proper permissions on the application directory

### Queue Jobs Failing

1. Check failed jobs table: `php artisan queue:failed`
2. Retry failed jobs: `php artisan queue:retry all`
3. Review job logs for specific error messages
