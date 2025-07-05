<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Send pending notifications every hour
        $schedule->command('notifications:send')
                ->hourly()
                ->withoutOverlapping();

        // Send daily digest at 9 AM
        $schedule->command('notifications:send --digest')
                ->dailyAt('09:00')
                ->withoutOverlapping();

        // Send reminder notifications daily at 10 AM
        $schedule->command('notifications:reminders')
                ->dailyAt('10:00')
                ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
} 