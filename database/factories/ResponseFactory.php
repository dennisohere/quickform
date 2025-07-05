<?php

namespace Database\Factories;

use App\Models\Survey;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Response>
 */
class ResponseFactory extends Factory
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
            'respondent_name' => fake()->optional(0.7)->name(),
            'respondent_email' => fake()->optional(0.5)->safeEmail(),
            'is_completed' => fake()->boolean(80),
            'completed_at' => fake()->optional(0.8)->dateTimeBetween('-1 week', 'now'),
        ];
    }

    /**
     * Indicate that the response is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_completed' => true,
            'completed_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ]);
    }

    /**
     * Indicate that the response is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_completed' => false,
            'completed_at' => null,
        ]);
    }
} 