<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Response;
use App\Models\QuestionResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicSurveyController extends Controller
{
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

        return Inertia::render('PublicSurvey/Show', [
            'survey' => $survey,
        ]);
    }

    /**
     * Start a new response session.
     */
    public function start(Request $request, string $token)
    {
        $survey = Survey::where('share_token', $token)
            ->where('is_published', true)
            ->firstOrFail();

        $validated = $request->validate([
            'respondent_name' => 'nullable|string|max:255',
            'respondent_email' => 'nullable|email|max:255',
        ]);

        $response = $survey->responses()->create($validated);

        return redirect()->route('public.survey.question', [
            'token' => $token,
            'responseId' => $response->id,
            'questionIndex' => 0,
        ]);
    }

    /**
     * Display a specific question for response.
     */
    public function question(string $token, string $responseId, int $questionIndex)
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
        
        if ($questionIndex >= $questions->count()) {
            return redirect()->route('public.survey.complete', [
                'token' => $token,
                'responseId' => $responseId,
            ]);
        }

        $currentQuestion = $questions[$questionIndex];

        return Inertia::render('PublicSurvey/Question', [
            'survey' => $survey,
            'response' => $response,
            'currentQuestion' => $currentQuestion,
            'questionIndex' => $questionIndex,
            'totalQuestions' => $questions->count(),
        ]);
    }

    /**
     * Store the answer for the current question and move to next.
     */
    public function answer(Request $request, string $token, string $responseId, int $questionIndex)
    {
        $survey = Survey::where('share_token', $token)
            ->where('is_published', true)
            ->firstOrFail();

        $response = Response::where('id', $responseId)
            ->where('survey_id', $survey->id)
            ->firstOrFail();

        $questions = $survey->questions()->orderBy('order')->get();
        $currentQuestion = $questions[$questionIndex];

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

        $nextQuestionIndex = $questionIndex + 1;

        if ($nextQuestionIndex >= $questions->count()) {
            // Mark response as completed
            $response->markAsCompleted();

            return redirect()->route('public.survey.complete', [
                'token' => $token,
                'responseId' => $responseId,
            ]);
        }

        return redirect()->route('public.survey.question', [
            'token' => $token,
            'responseId' => $responseId,
            'questionIndex' => $nextQuestionIndex,
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

        return Inertia::render('PublicSurvey/Complete', [
            'survey' => $survey,
            'response' => $response,
        ]);
    }
}
