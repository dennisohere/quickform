<?php

use App\Models\Survey;
use App\Models\User;
use App\Models\Response;
use App\Models\Question;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

test('notification is created when survey response is started', function () {
    Mail::fake();

    $user = User::factory()->create();
    $survey = Survey::factory()->create(['created_by' => $user->id]);
    $question = Question::factory()->create(['survey_id' => $survey->id]);
    
    $response = Response::factory()->create(['survey_id' => $survey->id]);

    $notificationService = app(NotificationService::class);
    $notification = $notificationService->createSurveyResponseNotification($user, $survey, 1);

    expect($notification)->toBeInstanceOf(\App\Models\Notification::class);
    expect($notification->type)->toBe('survey_response');
    expect($notification->user_id)->toBe($user->id);
    expect($notification->data['survey_id'])->toBe($survey->id);
});

test('notification is created when survey is completed', function () {
    Mail::fake();

    $user = User::factory()->create();
    $survey = Survey::factory()->create(['created_by' => $user->id]);
    
    $notificationService = app(NotificationService::class);
    $notification = $notificationService->createSurveyCompletionNotification($user, $survey, 'John Doe');

    expect($notification)->toBeInstanceOf(\App\Models\Notification::class);
    expect($notification->type)->toBe('survey_completion');
    expect($notification->user_id)->toBe($user->id);
    expect($notification->data['respondent_name'])->toBe('John Doe');
});

test('email notification can be sent', function () {
    Mail::fake();

    $user = User::factory()->create();
    $survey = Survey::factory()->create(['created_by' => $user->id]);
    
    $notificationService = app(NotificationService::class);
    $notification = $notificationService->createSurveyResponseNotification($user, $survey, 1);
    
    $notificationService->sendEmailNotification($notification);

    Mail::assertSent(\Illuminate\Mail\Mailable::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });

    expect($notification->fresh()->sent_at)->not->toBeNull();
});

test('notification can be marked as read', function () {
    $user = User::factory()->create();
    $survey = Survey::factory()->create(['created_by' => $user->id]);
    
    $notificationService = app(NotificationService::class);
    $notification = $notificationService->createSurveyResponseNotification($user, $survey, 1);
    
    expect($notification->isRead())->toBeFalse();
    
    $notification->markAsRead();
    
    expect($notification->fresh()->isRead())->toBeTrue();
}); 