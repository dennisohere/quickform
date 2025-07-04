<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Response;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class DashboardController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Display the dashboard with statistics.
     */
    public function index(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        // Get statistics for the authenticated user
        $totalSurveys = Survey::where('created_by', $user->id)->count();
        $activeSurveys = Survey::where('created_by', $user->id)
            ->where('is_published', true)
            ->count();

        // Get total responses across all user's surveys
        $totalResponses = Response::whereHas('survey', function ($query) use ($user) {
            $query->where('created_by', $user->id);
        })->count();

        // Get recent surveys
        $recentSurveys = Survey::where('created_by', $user->id)
            ->withCount(['questions', 'responses'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalSurveys' => $totalSurveys,
                'activeSurveys' => $activeSurveys,
                'totalResponses' => $totalResponses,
            ],
            'recentSurveys' => $recentSurveys,
        ]);
    }
}
