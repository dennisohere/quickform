<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class QuestionController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new question.
     */
    public function create(Survey $survey)
    {
        $this->authorize('update', $survey);

        return Inertia::render('questions/create', [
            'surveyId' => $survey->id,
            'surveyTitle' => $survey->title,
        ]);
    }

    /**
     * Store a newly created question.
     */
    public function store(Request $request, Survey $survey)
    {
        $this->authorize('update', $survey);

        $validated = $request->validate([
            'question_text' => 'required|string|max:1000',
            'question_type' => 'required|in:text,textarea,radio,checkbox,select,number,email,date',
            'options' => 'nullable|array',
            'options.*' => 'string|max:255',
            'is_required' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        // Set order if not provided
        if (!isset($validated['order'])) {
            $validated['order'] = $survey->questions()->max('order') + 1;
        }

        $survey->questions()->create($validated);

        return redirect()->route('surveys.show', $survey)
            ->with('success', 'Question added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit(Survey $survey, Question $question)
    {
        $this->authorize('update', $survey);

        return Inertia::render('questions/edit', [
            'survey' => $survey,
            'question' => $question,
        ]);
    }

    /**
     * Update the specified question.
     */
    public function update(Request $request, Survey $survey, Question $question)
    {
        $this->authorize('update', $survey);

        $validated = $request->validate([
            'question_text' => 'required|string|max:1000',
            'question_type' => 'required|in:text,textarea,radio,checkbox,select,number,email,date',
            'options' => 'nullable|array',
            'options.*' => 'string|max:255',
            'is_required' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        $question->update($validated);

        return redirect()->route('surveys.show', $survey)
            ->with('success', 'Question updated successfully!');
    }

    /**
     * Remove the specified question.
     */
    public function destroy(Survey $survey, Question $question)
    {
        $this->authorize('update', $survey);

        $question->delete();

        // Reorder remaining questions
        $questions = $survey->questions()->orderBy('order')->get();
        foreach ($questions as $index => $q) {
            $q->update(['order' => $index]);
        }

        return redirect()->route('surveys.show', $survey)
            ->with('success', 'Question deleted successfully!');
    }

    /**
     * Reorder questions.
     */
    public function reorder(Request $request, Survey $survey)
    {
        $this->authorize('update', $survey);

        $validated = $request->validate([
            'questions' => 'required|array',
            'questions.*.id' => 'required|exists:questions,id',
            'questions.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['questions'] as $questionData) {
            Question::where('id', $questionData['id'])
                ->where('survey_id', $survey->id)
                ->update(['order' => $questionData['order']]);
        }

        return response()->json(['message' => 'Questions reordered successfully']);
    }
}
