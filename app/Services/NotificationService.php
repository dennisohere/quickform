<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function createSurveyResponseNotification(User $user, Survey $survey, int $responseCount): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'survey_response',
            'title' => 'New Survey Response',
            'message' => "You received {$responseCount} new response(s) for your survey '{$survey->title}'.",
            'data' => [
                'survey_id' => $survey->id,
                'survey_title' => $survey->title,
                'response_count' => $responseCount,
            ],
        ]);
    }

    public function createSurveyCompletionNotification(User $user, Survey $survey, string $respondentName): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'survey_completion',
            'title' => 'Survey Completed',
            'message' => "Someone completed your survey '{$survey->title}'.",
            'data' => [
                'survey_id' => $survey->id,
                'survey_title' => $survey->title,
                'respondent_name' => $respondentName,
            ],
        ]);
    }

    public function createReminderNotification(User $user, Survey $survey, string $reason): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'reminder',
            'title' => 'Survey Reminder',
            'message' => "Reminder: {$reason} for your survey '{$survey->title}'.",
            'data' => [
                'survey_id' => $survey->id,
                'survey_title' => $survey->title,
                'reason' => $reason,
            ],
        ]);
    }

    public function sendEmailNotification(Notification $notification): void
    {
        $user = $notification->user;
        
        Mail::send('emails.notification', [
            'notification' => $notification,
            'user' => $user,
        ], function ($message) use ($user, $notification) {
            $message->to($user->email, $user->name)
                   ->subject($notification->title);
        });

        $notification->markAsSent();
    }

    public function queueEmailNotification(Notification $notification): void
    {
        \App\Jobs\SendNotificationEmail::dispatch($notification);
    }

    public function sendPendingNotifications(): void
    {
        $pendingNotifications = Notification::whereNull('sent_at')
            ->with('user')
            ->get();

        foreach ($pendingNotifications as $notification) {
            $this->sendEmailNotification($notification);
        }
    }

    public function sendDailyDigest(User $user): void
    {
        $yesterday = now()->subDay();
        $notifications = $user->notifications()
            ->where('created_at', '>=', $yesterday)
            ->where('type', '!=', 'reminder') // Don't include reminders in digest
            ->get();

        if ($notifications->isEmpty()) {
            return;
        }

        Mail::send('emails.daily-digest', [
            'user' => $user,
            'notifications' => $notifications,
        ], function ($message) use ($user) {
            $message->to($user->email, $user->name)
                   ->subject('Your Daily Survey Digest');
        });
    }
}
