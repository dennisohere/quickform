# QuickForm - Survey Application

A modern survey application built with Laravel, React, and DaisyUI that allows admins to create and publish surveys for public responses.

## Features

### Admin Features

- **Survey Management**: Create, edit, and delete surveys
- **Question Types**: Support for multiple question types:
    - Short text
    - Long text (textarea)
    - Multiple choice (single answer)
    - Multiple choice (multiple answers)
    - Dropdown selection
    - Number input
    - Email input
    - Date picker
- **Survey Publishing**: Publish/unpublish surveys with shareable links
- **Response Management**: View and analyze survey responses
- **Real-time Statistics**: Dashboard with survey and response counts

### Public Features

- **One Question at a Time**: Respondents see only one question per page
- **Progress Tracking**: Visual progress bar showing completion status
- **Responsive Design**: Works on desktop and mobile devices
- **Anonymous Responses**: Optional name and email collection

## Technology Stack

- **Backend**: Laravel 12 with PHP 8.2+
- **Frontend**: React 19 with TypeScript
- **UI Framework**: DaisyUI with Tailwind CSS
- **Database**: SQLite (default) or MySQL/PostgreSQL
- **Authentication**: Laravel Breeze with Inertia.js

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd quickform
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Database setup**

    ```bash
    php artisan migrate
    php artisan db:seed
    ```

6. **Build assets**

    ```bash
    npm run build
    ```

7. **Start the development server**
    ```bash
    php artisan serve
    ```

## Usage

### Admin Access

1. Visit `http://localhost:8000/register` to create an admin account
2. Login and access the dashboard
3. Create your first survey
4. Add questions using various question types
5. Publish the survey to get a shareable link

### Public Survey Access

1. Share the survey link with respondents
2. Respondents can optionally provide their name and email
3. Each question is presented one at a time
4. Progress is tracked throughout the survey
5. Respondents receive a completion confirmation

## Database Structure

The application uses UUID primary keys for all tables:

- **users**: Admin users who create surveys
- **surveys**: Survey metadata and settings
- **questions**: Survey questions with type and options
- **responses**: Individual survey responses
- **question_responses**: Individual answers to questions

## API Endpoints

### Admin Routes (Authenticated)

- `GET /surveys` - List all surveys
- `GET /surveys/create` - Create survey form
- `POST /surveys` - Store new survey
- `GET /surveys/{id}` - View survey details
- `GET /surveys/{id}/edit` - Edit survey form
- `PUT /surveys/{id}` - Update survey
- `DELETE /surveys/{id}` - Delete survey
- `PATCH /surveys/{id}/toggle-publish` - Publish/unpublish survey
- `GET /surveys/{id}/responses` - View survey responses

### Question Management

- `GET /surveys/{id}/questions/create` - Add question form
- `POST /surveys/{id}/questions` - Store new question
- `GET /surveys/{id}/questions/{question}/edit` - Edit question form
- `PUT /surveys/{id}/questions/{question}` - Update question
- `DELETE /surveys/{id}/questions/{question}` - Delete question

### Public Routes (No Authentication)

- `GET /survey/{token}` - View public survey
- `POST /survey/{token}/start` - Start survey response
- `GET /survey/{token}/response/{responseId}/question/{index}` - View question
- `POST /survey/{token}/response/{responseId}/question/{index}/answer` - Submit answer
- `GET /survey/{token}/response/{responseId}/complete` - Survey completion

## Sample Data

The application includes sample data for demonstration:

- Sample survey: "Customer Satisfaction Survey"
- 5 different question types
- Sample responses from test users

To reset and reseed the database:

```bash
php artisan migrate:fresh --seed
```

## Development

### Running in Development Mode

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite development server
npm run dev
```

### Testing

```bash
php artisan test
```

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## Deployment

1. Set up your production environment
2. Configure your database
3. Set `APP_ENV=production` in your `.env`
4. Run `npm run build` to compile assets
5. Set up your web server to point to the `public` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## Support

For support and questions, please open an issue in the repository.
