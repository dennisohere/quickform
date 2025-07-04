<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $surveys = auth()->user()->surveys()
            ->withCount(['questions', 'responses'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Surveys/Index', [
            'surveys' => $surveys,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Surveys/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $survey = auth()->user()->surveys()->create($validated);

        return redirect()->route('surveys.show', $survey)
            ->with('success', 'Survey created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Survey $survey)
    {
        $this->authorize('view', $survey);

        $survey->load(['questions' => function ($query) {
            $query->orderBy('order');
        }, 'responses']);

        return Inertia::render('Surveys/Show', [
            'survey' => $survey,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Survey $survey)
    {
        $this->authorize('update', $survey);

        return Inertia::render('Surveys/Edit', [
            'survey' => $survey,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Survey $survey)
    {
        $this->authorize('update', $survey);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $survey->update($validated);

        return redirect()->route('surveys.show', $survey)
            ->with('success', 'Survey updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey)
    {
        $this->authorize('delete', $survey);

        $survey->delete();

        return redirect()->route('surveys.index')
            ->with('success', 'Survey deleted successfully!');
    }

    /**
     * Toggle the published status of a survey.
     */
    public function togglePublish(Survey $survey)
    {
        $this->authorize('update', $survey);

        $survey->update(['is_published' => !$survey->is_published]);

        if ($survey->is_published && !$survey->share_token) {
            $survey->generateShareToken();
        }

        return back()->with('success', 
            $survey->is_published ? 'Survey published successfully!' : 'Survey unpublished successfully!'
        );
    }

    /**
     * Generate a new share token for the survey.
     */
    public function regenerateToken(Survey $survey)
    {
        $this->authorize('update', $survey);

        $survey->generateShareToken();

        return back()->with('success', 'Share token regenerated successfully!');
    }

    /**
     * Display survey responses.
     */
    public function responses(Survey $survey)
    {
        $this->authorize('view', $survey);

        $survey->load(['responses.questionResponses.question']);

        return Inertia::render('Surveys/Responses', [
            'survey' => $survey,
        ]);
    }
}
