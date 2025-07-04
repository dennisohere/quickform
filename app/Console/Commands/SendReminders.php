<?php

namespace App\Console\Commands;

use App\Models\Survey;
use App\Services\NotificationService;
use Illuminate\Console\Command;

class SendReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:reminders {--type=all : Type of reminders to send (all, unpublished, no-responses)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder notifications for surveys that need attention';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService): int
    {
        $type = $this->option('type');
        
        $this->info("Sending {$type} reminder notifications...");

        $remindersSent = 0;

        if ($type === 'all' || $type === 'unpublished') {
            $remindersSent += $this->sendUnpublishedReminders($notificationService);
        }

        if ($type === 'all' || $type === 'no-responses') {
            $remindersSent += $this->sendNoResponsesReminders($notificationService);
        }

        $this->info("Sent {$remindersSent} reminder notifications.");

        return Command::SUCCESS;
    }

    private function sendUnpublishedReminders(NotificationService $notificationService): int
    {
        $unpublishedSurveys = Survey::where('is_published', false)
            ->where('created_at', '<=', now()->subDays(3)) // Surveys created more than 3 days ago
            ->with('user')
            ->get();

        $sentCount = 0;

        foreach ($unpublishedSurveys as $survey) {
            $notification = $notificationService->createReminderNotification(
                $survey->user,
                $survey,
                'Your survey is still unpublished and ready to be shared'
            );

            $notificationService->sendEmailNotification($notification);
            $sentCount++;
        }

        if ($sentCount > 0) {
            $this->info("Sent {$sentCount} unpublished survey reminders.");
        }

        return $sentCount;
    }

    private function sendNoResponsesReminders(NotificationService $notificationService): int
    {
        $surveysWithNoResponses = Survey::where('is_published', true)
            ->whereHas('questions')
            ->whereDoesntHave('responses')
            ->where('created_at', '<=', now()->subDays(7)) // Surveys published more than 7 days ago
            ->with('user')
            ->get();

        $sentCount = 0;

        foreach ($surveysWithNoResponses as $survey) {
            $notification = $notificationService->createReminderNotification(
                $survey->user,
                $survey,
                'Your published survey has not received any responses yet'
            );

            $notificationService->sendEmailNotification($notification);
            $sentCount++;
        }

        if ($sentCount > 0) {
            $this->info("Sent {$sentCount} no-responses reminders.");
        }

        return $sentCount;
    }
}
