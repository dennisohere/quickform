<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $notification->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name') }}</h1>
    </div>

    <div class="content">
        <h2>{{ $notification->title }}</h2>
        
        <p>Hello {{ $user->name }},</p>
        
        <p>{{ $notification->message }}</p>

        @if($notification->type === 'survey_response')
            <p>You can view the responses and analytics for this survey by clicking the button below.</p>
            <a href="{{ url('/analytics/survey/' . $notification->data['survey_id']) }}" class="button">
                View Survey Analytics
            </a>
        @elseif($notification->type === 'survey_completion')
            <p>You can view the completed response and analytics for this survey by clicking the button below.</p>
            <a href="{{ url('/analytics/survey/' . $notification->data['survey_id']) }}" class="button">
                View Survey Analytics
            </a>
        @elseif($notification->type === 'reminder')
            <p>Please take action on this survey by clicking the button below.</p>
            <a href="{{ url('/surveys/' . $notification->data['survey_id']) }}" class="button">
                View Survey
            </a>
        @endif
    </div>

    <div class="footer">
        <p>This email was sent from {{ config('app.name') }}.</p>
        <p>If you no longer wish to receive these notifications, please contact support.</p>
    </div>
</body>
</html> 