<?php

namespace App\Console\Commands;

use App\Services\NotificationService;
use Illuminate\Console\Command;

class SendNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send {--digest : Send daily digest instead of individual notifications}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send pending email notifications';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService): int
    {
        if ($this->option('digest')) {
            $this->info('Sending daily digest notifications...');
            $this->sendDailyDigest($notificationService);
        } else {
            $this->info('Sending individual notifications...');
            $this->sendIndividualNotifications($notificationService);
        }

        return Command::SUCCESS;
    }

    private function sendIndividualNotifications(NotificationService $notificationService): void
    {
        $pendingCount = \App\Models\Notification::whereNull('sent_at')->count();
        
        if ($pendingCount === 0) {
            $this->info('No pending notifications to send.');
            return;
        }

        $this->info("Found {$pendingCount} pending notifications.");
        
        $bar = $this->output->createProgressBar($pendingCount);
        $bar->start();

        $notificationService->sendPendingNotifications();

        $bar->finish();
        $this->newLine();
        $this->info('All notifications sent successfully!');
    }

    private function sendDailyDigest(NotificationService $notificationService): void
    {
        $users = \App\Models\User::all();
        $sentCount = 0;

        $bar = $this->output->createProgressBar($users->count());
        $bar->start();

        foreach ($users as $user) {
            try {
                $notificationService->sendDailyDigest($user);
                $sentCount++;
            } catch (\Exception $e) {
                $this->error("Failed to send digest to {$user->email}: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Daily digest sent to {$sentCount} users.");
    }
}
