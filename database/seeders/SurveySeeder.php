<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Survey;
use App\Models\Question;
use App\Models\Response;
use App\Models\QuestionResponse;
use Carbon\Carbon;
use Illuminate\Support\Str;

class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating survey seed data...');

        // Create surveys with different types and time periods
        $surveys = [
            [
                'title' => 'Customer Satisfaction Survey',
                'description' => 'Help us improve our services by providing your feedback',
                'status' => 'published',
                'require_respondent_name' => true,
                'require_respondent_email' => false,
                'created_at' => Carbon::now()->subMonths(18),
                'questions' => [
                    [
                        'text' => 'How satisfied are you with our service?',
                        'type' => 'radio',
                        'options' => ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
                        'required' => true
                    ],
                    [
                        'text' => 'Which features do you use most?',
                        'type' => 'checkbox',
                        'options' => ['Mobile App', 'Web Dashboard', 'Email Notifications', 'API Access', 'Reports'],
                        'required' => false
                    ],
                    [
                        'text' => 'How likely are you to recommend us?',
                        'type' => 'radio',
                        'options' => ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'],
                        'required' => true
                    ],
                    [
                        'text' => 'What is your primary use case?',
                        'type' => 'select',
                        'options' => ['Personal', 'Small Business', 'Enterprise', 'Education', 'Other'],
                        'required' => true
                    ],
                    [
                        'text' => 'When did you first start using our service?',
                        'type' => 'date',
                        'required' => false
                    ],
                    [
                        'text' => 'Additional comments or suggestions:',
                        'type' => 'text',
                        'required' => false
                    ]
                ]
            ],
            [
                'title' => 'Employee Engagement Survey',
                'description' => 'Annual survey to measure employee satisfaction and engagement',
                'status' => 'published',
                'require_respondent_name' => false,
                'require_respondent_email' => true,
                'created_at' => Carbon::now()->subMonths(12),
                'questions' => [
                    [
                        'text' => 'How would you rate your overall job satisfaction?',
                        'type' => 'radio',
                        'options' => ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'],
                        'required' => true
                    ],
                    [
                        'text' => 'Which benefits are most important to you?',
                        'type' => 'checkbox',
                        'options' => ['Health Insurance', 'Retirement Plan', 'Flexible Hours', 'Remote Work', 'Professional Development'],
                        'required' => false
                    ],
                    [
                        'text' => 'How well do you feel your work is recognized?',
                        'type' => 'radio',
                        'options' => ['Very Well', 'Well', 'Somewhat', 'Poorly', 'Not at All'],
                        'required' => true
                    ],
                    [
                        'text' => 'What department do you work in?',
                        'type' => 'select',
                        'options' => ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'],
                        'required' => true
                    ],
                    [
                        'text' => 'How long have you been with the company?',
                        'type' => 'select',
                        'options' => ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'More than 10 years'],
                        'required' => true
                    ]
                ]
            ],
            [
                'title' => 'Product Feedback Survey',
                'description' => 'Share your thoughts on our latest product features',
                'status' => 'published',
                'require_respondent_name' => true,
                'require_respondent_email' => true,
                'created_at' => Carbon::now()->subMonths(6),
                'questions' => [
                    [
                        'text' => 'Which product features do you find most useful?',
                        'type' => 'checkbox',
                        'options' => ['Dashboard Analytics', 'Mobile App', 'API Integration', 'Custom Reports', 'Team Collaboration'],
                        'required' => true
                    ],
                    [
                        'text' => 'How easy is it to use our product?',
                        'type' => 'radio',
                        'options' => ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'],
                        'required' => true
                    ],
                    [
                        'text' => 'What type of user are you?',
                        'type' => 'select',
                        'options' => ['Individual', 'Small Team', 'Large Organization', 'Developer', 'Administrator'],
                        'required' => true
                    ],
                    [
                        'text' => 'When did you last use the product?',
                        'type' => 'date',
                        'required' => false
                    ],
                    [
                        'text' => 'What would you like to see improved?',
                        'type' => 'text',
                        'required' => false
                    ]
                ]
            ],
            [
                'title' => 'Event Feedback Survey',
                'description' => 'Help us improve future events by sharing your experience',
                'status' => 'published',
                'require_respondent_name' => false,
                'require_respondent_email' => false,
                'created_at' => Carbon::now()->subMonths(3),
                'questions' => [
                    [
                        'text' => 'How would you rate the overall event?',
                        'type' => 'radio',
                        'options' => ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
                        'required' => true
                    ],
                    [
                        'text' => 'Which sessions did you attend?',
                        'type' => 'checkbox',
                        'options' => ['Keynote', 'Technical Workshops', 'Networking', 'Panel Discussion', 'Q&A Session'],
                        'required' => false
                    ],
                    [
                        'text' => 'How did you hear about this event?',
                        'type' => 'select',
                        'options' => ['Email', 'Social Media', 'Website', 'Word of Mouth', 'Advertisement'],
                        'required' => true
                    ],
                    [
                        'text' => 'Would you attend future events?',
                        'type' => 'radio',
                        'options' => ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'],
                        'required' => true
                    ]
                ]
            ],
            [
                'title' => 'Website Usability Survey',
                'description' => 'Help us improve our website by sharing your experience',
                'status' => 'draft',
                'require_respondent_name' => false,
                'require_respondent_email' => false,
                'created_at' => Carbon::now()->subMonths(1),
                'questions' => [
                    [
                        'text' => 'How easy is it to navigate our website?',
                        'type' => 'radio',
                        'options' => ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'],
                        'required' => true
                    ],
                    [
                        'text' => 'Which pages do you visit most?',
                        'type' => 'checkbox',
                        'options' => ['Home', 'Products', 'About', 'Contact', 'Blog', 'Support'],
                        'required' => false
                    ],
                    [
                        'text' => 'What device do you primarily use?',
                        'type' => 'select',
                        'options' => ['Desktop', 'Mobile', 'Tablet', 'Other'],
                        'required' => true
                    ]
                ]
            ]
        ];

        // Get the first user or create one for created_by field
        $user = \App\Models\User::first();
        if (!$user) {
            $user = \App\Models\User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        foreach ($surveys as $surveyData) {
            $survey = Survey::create([
                'id' => Str::uuid(),
                'title' => $surveyData['title'],
                'description' => $surveyData['description'],
                'is_published' => $surveyData['status'] === 'published',
                'share_token' => Str::random(32),
                'require_respondent_name' => $surveyData['require_respondent_name'],
                'require_respondent_email' => $surveyData['require_respondent_email'],
                'created_by' => $user->id,
                'created_at' => $surveyData['created_at'],
                'updated_at' => $surveyData['created_at']
            ]);

            // Create questions for this survey
            foreach ($surveyData['questions'] as $index => $questionData) {
                $question = Question::create([
                    'id' => Str::uuid(),
                    'survey_id' => $survey->id,
                    'question_text' => $questionData['text'],
                    'question_type' => $questionData['type'],
                    'options' => isset($questionData['options']) ? json_encode($questionData['options']) : null,
                    'is_required' => $questionData['required'],
                    'order' => $index + 1
                ]);
            }

            // Generate responses for published surveys
            if ($survey->is_published) {
                $this->generateResponses($survey, $surveyData['created_at']);
            }
        }

        $this->command->info('Survey seed data created successfully!');
    }

    private function generateResponses(Survey $survey, Carbon $surveyCreatedAt)
    {
        $questions = $survey->questions;
        $numResponses = rand(15, 50); // Random number of responses per survey

        for ($i = 0; $i < $numResponses; $i++) {
            // Generate response date within the last 2 years from survey creation
            $responseDate = $surveyCreatedAt->copy()->addDays(rand(1, 730)); // Up to 2 years after creation
            
            $response = Response::create([
                'id' => Str::uuid(),
                'survey_id' => $survey->id,
                'respondent_name' => $survey->require_respondent_name ? fake()->name() : null,
                'respondent_email' => $survey->require_respondent_email ? fake()->email() : null,
                'created_at' => $responseDate,
                'updated_at' => $responseDate
            ]);

            // Generate question responses
            foreach ($questions as $question) {
                $this->generateQuestionResponse($question, $response, $responseDate);
            }
        }
    }

    private function generateQuestionResponse(Question $question, Response $response, Carbon $responseDate)
    {
        $answer = null;

        switch ($question->question_type) {
            case 'radio':
            case 'select':
                $options = json_decode($question->options, true);
                $answer = $options[array_rand($options)];
                break;

            case 'checkbox':
                $options = json_decode($question->options, true);
                $numSelected = rand(1, min(3, count($options)));
                $selectedOptions = array_rand($options, $numSelected);
                if (!is_array($selectedOptions)) {
                    $selectedOptions = [$selectedOptions];
                }
                $answer = json_encode(array_map(function($index) use ($options) {
                    return $options[$index];
                }, $selectedOptions));
                break;

            case 'date':
                // Generate a date within the last 5 years
                $answer = Carbon::now()->subDays(rand(1, 1825))->format('Y-m-d');
                break;

            case 'text':
                $answers = [
                    'Great experience overall!',
                    'Could be better.',
                    'Very satisfied with the service.',
                    'Needs improvement in some areas.',
                    'Excellent quality and support.',
                    'Good but room for improvement.',
                    'Highly recommend!',
                    'Average experience.',
                    'Outstanding service and features.',
                    'Meets expectations.'
                ];
                $answer = $answers[array_rand($answers)];
                break;

            default:
                $answer = 'Sample answer';
        }

        QuestionResponse::create([
            'id' => Str::uuid(),
            'response_id' => $response->id,
            'question_id' => $question->id,
            'answer' => $answer,
            'created_at' => $responseDate,
            'updated_at' => $responseDate
        ]);
    }
}
