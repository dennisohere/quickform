<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Response;
use App\Models\QuestionResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Display overall analytics dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Overall statistics
        $totalSurveys = $user->surveys()->count();
        $publishedSurveys = $user->surveys()->where('is_published', true)->count();
        $totalResponses = $user->surveys()->withCount('responses')->get()->sum('responses_count');
        $totalQuestions = $user->surveys()->withCount('questions')->get()->sum('questions_count');
        
        // Recent activity
        $recentResponses = Response::whereHas('survey', function ($query) use ($user) {
            $query->where('created_by', $user->id);
        })
        ->with(['survey:id,title'])
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get();
        
        // Response trends (last 30 days)
        $responseTrends = Response::whereHas('survey', function ($query) use ($user) {
            $query->where('created_by', $user->id);
        })
        ->where('created_at', '>=', Carbon::now()->subDays(30))
        ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
        ->groupBy('date')
        ->orderBy('date')
        ->get();
        
        // Survey performance
        $surveyPerformance = $user->surveys()
            ->withCount(['questions', 'responses'])
            ->orderBy('responses_count', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('analytics/index', [
            'stats' => [
                'totalSurveys' => $totalSurveys,
                'publishedSurveys' => $publishedSurveys,
                'totalResponses' => $totalResponses,
                'totalQuestions' => $totalQuestions,
            ],
            'recentResponses' => $recentResponses,
            'responseTrends' => $responseTrends,
            'surveyPerformance' => $surveyPerformance,
        ]);
    }

    /**
     * Display analytics for a specific survey.
     */
    public function survey(Survey $survey)
    {
        $this->authorize('view', $survey);

        // Basic survey stats
        $totalResponses = $survey->responses()->count();
        $completedResponses = $survey->responses()->where('is_completed', true)->count();
        $completionRate = $totalResponses > 0 ? round(($completedResponses / $totalResponses) * 100, 1) : 0;
        
        // Response trends (last 30 days)
        $responseTrends = $survey->responses()
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        // Question analytics
        $questionAnalytics = $survey->questions()
            ->withCount('questionResponses')
            ->with(['questionResponses' => function ($query) {
                $query->select('question_id', 'answer');
            }])
            ->get()
            ->map(function ($question) {
                $answers = $question->questionResponses->pluck('answer')->filter();
                $totalAnswers = $answers->count();
                
                $analytics = [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'question_type' => $question->question_type,
                    'total_answers' => $totalAnswers,
                    'response_rate' => $question->questionResponses_count > 0 ? round(($totalAnswers / $question->questionResponses_count) * 100, 1) : 0,
                ];
                
                // Add type-specific analytics
                if (in_array($question->question_type, ['radio', 'select', 'checkbox'])) {
                    $options = $question->options ?? [];
                    $optionCounts = [];
                    $questionType = $question->question_type; // Store the question type in a local variable
                    
                    foreach ($options as $option) {
                        $count = $answers->filter(function ($answer) use ($option, $questionType) {
                            if ($questionType === 'checkbox') {
                                return in_array($option, json_decode($answer, true) ?? []);
                            }
                            return $answer === $option;
                        })->count();
                        
                        $optionCounts[$option] = $count;
                    }
                    
                    $analytics['option_counts'] = $optionCounts;
                }
                
                return $analytics;
            });
        
        // Respondent demographics (if name/email are collected)
        $respondentStats = [
            'withName' => $survey->responses()->whereNotNull('respondent_name')->count(),
            'withEmail' => $survey->responses()->whereNotNull('respondent_email')->count(),
            'anonymous' => $survey->responses()->whereNull('respondent_name')->whereNull('respondent_email')->count(),
        ];
        
        // Recent responses
        $recentResponses = $survey->responses()
            ->with('questionResponses.question')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $data = [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'is_published' => $survey->is_published,
                'created_at' => $survey->created_at,
                'questions_count' => $survey->questions->count(),
            ],
            'stats' => [
                'totalResponses' => $totalResponses,
                'completedResponses' => $completedResponses,
                'completionRate' => $completionRate,
                'respondentStats' => $respondentStats,
            ],
            'responseTrends' => $responseTrends->toArray(),
            'questionAnalytics' => $questionAnalytics->toArray(),
            'recentResponses' => $recentResponses->toArray(),
        ];

        return Inertia::render('analytics/survey', $data);
    }
}
