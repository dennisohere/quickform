<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Response;
use App\Models\QuestionResponse;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Database\Seeder;

class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user or create one
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Create a sample survey
        $survey = Survey::create([
            'title' => 'Customer Satisfaction Survey',
            'description' => 'Help us improve our services by providing your feedback.',
            'is_published' => true,
            'share_token' => 'sample-survey-token-123',
            'created_by' => $user->id,
        ]);

        // Create questions
        $questions = [
            [
                'question_text' => 'How satisfied are you with our service?',
                'question_type' => 'radio',
                'options' => ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
                'is_required' => true,
                'order' => 1,
            ],
            [
                'question_text' => 'What aspects of our service could be improved?',
                'question_type' => 'textarea',
                'is_required' => false,
                'order' => 2,
            ],
            [
                'question_text' => 'Which features do you use most often?',
                'question_type' => 'checkbox',
                'options' => ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
                'is_required' => false,
                'order' => 3,
            ],
            [
                'question_text' => 'What is your age range?',
                'question_type' => 'select',
                'options' => ['18-24', '25-34', '35-44', '45-54', '55+'],
                'is_required' => true,
                'order' => 4,
            ],
            [
                'question_text' => 'How likely are you to recommend us to others?',
                'question_type' => 'number',
                'is_required' => true,
                'order' => 5,
            ],
        ];

        foreach ($questions as $questionData) {
            Question::create([
                'survey_id' => $survey->id,
                ...$questionData,
            ]);
        }

        // Create sample responses
        $responses = [
            [
                'respondent_name' => 'John Doe',
                'respondent_email' => 'john@example.com',
                'is_completed' => true,
                'completed_at' => now()->subDays(2),
            ],
            [
                'respondent_name' => 'Jane Smith',
                'respondent_email' => 'jane@example.com',
                'is_completed' => true,
                'completed_at' => now()->subDays(1),
            ],
            [
                'respondent_name' => 'Bob Johnson',
                'is_completed' => false,
            ],
        ];

        foreach ($responses as $responseData) {
            $response = Response::create([
                'survey_id' => $survey->id,
                ...$responseData,
            ]);

            // Create question responses for completed surveys
            if ($response->is_completed) {
                $surveyQuestions = $survey->questions()->orderBy('order')->get();
                
                $answers = [
                    ['Very Satisfied', 'The customer service team is very helpful.', 'Feature A,Feature C', '25-34', '9'],
                    ['Satisfied', 'Faster response times would be great.', 'Feature B,Feature D', '35-44', '8'],
                ];

                $answerIndex = $response->respondent_name === 'John Doe' ? 0 : 1;
                $answerSet = $answers[$answerIndex];

                foreach ($surveyQuestions as $index => $question) {
                    QuestionResponse::create([
                        'response_id' => $response->id,
                        'question_id' => $question->id,
                        'answer' => $answerSet[$index] ?? '',
                    ]);
                }
            }
        }
    }
}
