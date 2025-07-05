<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Response;
use App\Models\QuestionResponse;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class PublicSurveyController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;
    /**
     * Display the survey for public response.
     */
    public function show(string $token)
    {
        $survey = Survey::where('share_token', $token)
            ->where('is_published', true)
            ->with(['questions' => function ($query) {
                $query->orderBy('order');
            }])
            ->firstOrFail();

        return Inertia::render('public-survey/show', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'questions_count' => $survey->questions->count(),
                'require_respondent_name' => $survey->require_respondent_name,
                'require_respondent_email' => $survey->require_respondent_email,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Start a new response session.
     */
    public function start(Request $request, string $token)
    {
        $survey = Survey::where('share_token', $token)
            ->where('is_published', true)
            ->with(['questions' => function ($query) {
                $query->orderBy('order');
            }])
            ->firstOrFail();

        $validationRules = [];
        
        if ($survey->require_respondent_name) {
            $validationRules['respondent_name'] = 'required|string|max:255';
        } else {
            $validationRules['respondent_name'] = 'nullable|string|max:255';
        }
        
        if ($survey->require_respondent_email) {
            $validationRules['respondent_email'] = 'required|email|max:255';
        } else {
            $validationRules['respondent_email'] = 'nullable|email|max:255';
        }

        $validated = $request->validate($validationRules);

        $response = $survey->responses()->create($validated);

        // Get the first question ID
        $firstQuestion = $survey->questions->first();
        
        if (!$firstQuestion) {
            return redirect()->route('public.survey.complete', [
                'token' => $token,
                'responseId' => $response->id,
            ]);
        }

        return redirect()->route('public.survey.question', [
            'token' => $token,
            'responseId' => $response->id,
            'questionId' => $firstQuestion->id,
        ]);
    }

    /**
     * Display a specific question for response.
     */
    public function question(string $token, string $responseId, string $questionId)
    {
        $survey = Survey::where('share_token', $token)
            ->where('is_published', true)
            ->with(['questions' => function ($query) {
                $query->orderBy('order');
            }])
            ->firstOrFail();

        $response = Response::where('id', $responseId)
            ->where('survey_id', $survey->id)
            ->firstOrFail();

        $questions = $survey->questions;
        $currentQuestion = $questions->where('id', $questionId)->first();
        
        if (!$currentQuestion) {
            return redirect()->route('public.survey.complete', [
                'token' => $token,
                'responseId' => $responseId,
            ]);
        }

        // Find the current question index for progress calculation
        $currentIndex = $questions->search(function ($question) use ($questionId) {
            return $question->id === $questionId;
        });

        // Get previous and next question IDs for navigation
        $previousQuestion = $currentIndex > 0 ? $questions->get($currentIndex - 1) : null;
        $nextQuestion = $currentIndex < $questions->count() - 1 ? $questions->get($currentIndex + 1) : null;

        // Get the previous answer for this question if it exists
        $previousAnswer = $response->questionResponses()
            ->where('question_id', $currentQuestion->id)
            ->first();

        return Inertia::render('public-survey/question', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'questions_count' => $questions->count(),
            ],
            'question' => $currentQuestion,
            'questionIndex' => $currentIndex,
            'responseId' => $response->id,
            'token' => $token,
            'previousAnswer' => $previousAnswer?->answer,
            'navigation' => [
                'previousQuestionId' => $previousQuestion?->id,
                'nextQuestionId' => $nextQuestion?->id,
                'isLastQuestion' => $currentIndex === $questions->count() - 1,
            ],
        ]);
    }

    /**
     * Store the answer for the current question and move to next.
     */
    public function answer(Request $request, string $token, string $responseId, string $questionId)
    {
        $survey = Survey::where('share_token', $token)
            ->where('is_published', true)
            ->with(['questions' => function ($query) {
                $query->orderBy('order');
            }, 'creator'])
            ->firstOrFail();

        $response = Response::where('id', $responseId)
            ->where('survey_id', $survey->id)
            ->firstOrFail();

        $questions = $survey->questions;
        $currentQuestion = $questions->where('id', $questionId)->first();

        if (!$currentQuestion) {
            return redirect()->route('public.survey.complete', [
                'token' => $token,
                'responseId' => $responseId,
            ]);
        }

        $validated = $request->validate([
            'answer' => $currentQuestion->is_required ? 'required' : 'nullable',
        ]);

        // Store or update the answer
        QuestionResponse::updateOrCreate(
            [
                'response_id' => $response->id,
                'question_id' => $currentQuestion->id,
            ],
            [
                'answer' => $validated['answer'] ?? '',
            ]
        );

        // Find the next question
        $currentIndex = $questions->search(function ($question) use ($questionId) {
            return $question->id === $questionId;
        });

        $nextQuestion = $questions->get($currentIndex + 1);

        // Send notification for new response (only on first question)
        if ($currentIndex === 0) {
            $notificationService = app(NotificationService::class);
            $notification = $notificationService->createSurveyResponseNotification(
                $survey->creator,
                $survey,
                1
            );
            $notificationService->queueEmailNotification($notification);
        }

        if (!$nextQuestion) {
            // Mark response as completed
            $response->markAsCompleted();

            // Send notification for survey completion
            $notificationService = app(NotificationService::class);
            $notification = $notificationService->createSurveyCompletionNotification(
                $survey->creator,
                $survey,
                $response->respondent_name ?? 'Anonymous'
            );
            $notificationService->queueEmailNotification($notification);

            return redirect()->route('public.survey.complete', [
                'token' => $token,
                'responseId' => $responseId,
            ]);
        }

        return redirect()->route('public.survey.question', [
            'token' => $token,
            'responseId' => $responseId,
            'questionId' => $nextQuestion->id,
        ]);
    }

    /**
     * Show completion page.
     */
    public function complete(string $token, string $responseId)
    {
        $survey = Survey::where('share_token', $token)
            ->where('is_published', true)
            ->firstOrFail();

        $response = Response::where('id', $responseId)
            ->where('survey_id', $survey->id)
            ->firstOrFail();

        return Inertia::render('public-survey/complete', [
            'survey' => $survey,
        ]);
    }
}
