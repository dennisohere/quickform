<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Daily Survey Digest</title>
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
        .notification-item {
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #007bff;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .notification-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .notification-message {
            color: #666;
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
        <h1>{{ config('app.name') }} - Daily Digest</h1>
        <p>{{ now()->format('l, F j, Y') }}</p>
    </div>

    <div class="content">
        <h2>Your Survey Activity Summary</h2>
        
        <p>Hello {{ $user->name }},</p>
        
        <p>Here's a summary of your survey activity from the past 24 hours:</p>

        @if($notifications->isEmpty())
            <p>No new activity to report.</p>
        @else
            @foreach($notifications as $notification)
                <div class="notification-item">
                    <div class="notification-title">{{ $notification->title }}</div>
                    <div class="notification-message">{{ $notification->message }}</div>
                </div>
            @endforeach
        @endif

        <a href="{{ url('/analytics') }}" class="button">
            View All Analytics
        </a>
    </div>

    <div class="footer">
        <p>This email was sent from {{ config('app.name') }}.</p>
        <p>If you no longer wish to receive these digests, please contact support.</p>
    </div>
</body>
</html> 