<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PublicSurveyController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SurveyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Health check endpoints for deployment monitoring
Route::get('/health', [App\Http\Controllers\HealthController::class, 'simple']);
Route::get('/health/detailed', [App\Http\Controllers\HealthController::class, 'check']);

// Public survey routes
Route::prefix('survey')->name('survey.')->group(function () {
    Route::get('/{survey:slug}', [PublicSurveyController::class, 'show'])->name('show');
    Route::get('/{survey:slug}/question/{question}', [PublicSurveyController::class, 'question'])->name('question');
    Route::post('/{survey:slug}/question/{question}', [PublicSurveyController::class, 'answer'])->name('answer');
    Route::get('/{survey:slug}/complete', [PublicSurveyController::class, 'complete'])->name('complete');
});

// Admin routes (require authentication)
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Surveys
    Route::resource('surveys', SurveyController::class);
    Route::get('surveys/{survey}/responses', [SurveyController::class, 'responses'])->name('surveys.responses');

    // Questions (survey-specific)
    Route::resource('surveys.questions', QuestionController::class)->except(['index', 'show']);

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('analytics/survey/{survey}', [AnalyticsController::class, 'survey'])->name('analytics.survey');

    // Notifications
    Route::get('notifications', [NotificationsController::class, 'index'])->name('notifications.index');
});

// Welcome page (landing page)
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
