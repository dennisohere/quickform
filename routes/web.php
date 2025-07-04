<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Survey management routes
    Route::resource('surveys', \App\Http\Controllers\SurveyController::class);
    Route::patch('surveys/{survey}/toggle-publish', [\App\Http\Controllers\SurveyController::class, 'togglePublish'])
        ->name('surveys.toggle-publish');
    Route::patch('surveys/{survey}/regenerate-token', [\App\Http\Controllers\SurveyController::class, 'regenerateToken'])
        ->name('surveys.regenerate-token');
    Route::get('surveys/{survey}/responses', [\App\Http\Controllers\SurveyController::class, 'responses'])
        ->name('surveys.responses');

    // Question management routes
    Route::resource('surveys.questions', \App\Http\Controllers\QuestionController::class)
        ->except(['index', 'show']);
    Route::patch('surveys/{survey}/questions/reorder', [\App\Http\Controllers\QuestionController::class, 'reorder'])
        ->name('surveys.questions.reorder');
});

// Public survey routes (no auth required)
Route::prefix('survey')->name('public.survey.')->group(function () {
    Route::get('{token}', [\App\Http\Controllers\PublicSurveyController::class, 'show'])->name('show');
    Route::post('{token}/start', [\App\Http\Controllers\PublicSurveyController::class, 'start'])->name('start');
    Route::get('{token}/response/{responseId}/question/{questionIndex}', [\App\Http\Controllers\PublicSurveyController::class, 'question'])
        ->name('question');
    Route::post('{token}/response/{responseId}/question/{questionIndex}/answer', [\App\Http\Controllers\PublicSurveyController::class, 'answer'])
        ->name('answer');
    Route::get('{token}/response/{responseId}/complete', [\App\Http\Controllers\PublicSurveyController::class, 'complete'])
        ->name('complete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
