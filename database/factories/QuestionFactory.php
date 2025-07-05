<?php

namespace Database\Factories;

use App\Models\Survey;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'survey_id' => Survey::factory(),
            'question_text' => fake()->sentence() . '?',
            'question_type' => fake()->randomElement(['text', 'textarea', 'radio', 'select', 'checkbox', 'email', 'number', 'date']),
            'options' => fake()->randomElement([
                null,
                ['Option 1', 'Option 2', 'Option 3'],
                ['Yes', 'No'],
                ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
            ]),
            'is_required' => fake()->boolean(70),
            'order' => fake()->numberBetween(1, 10),
        ];
    }

    /**
     * Indicate that the question is required.
     */
    public function required(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_required' => true,
        ]);
    }

    /**
     * Indicate that the question is optional.
     */
    public function optional(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_required' => false,
        ]);
    }
} 