<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;

class HealthController extends Controller
{
    public function check()
    {
        $status = [
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'version' => config('app.version', '1.0.0'),
            'environment' => config('app.env'),
            'checks' => []
        ];

        // Database check
        try {
            DB::connection()->getPdo();
            $status['checks']['database'] = 'healthy';
        } catch (\Exception $e) {
            $status['checks']['database'] = 'unhealthy';
            $status['status'] = 'unhealthy';
        }

        // Redis check
        try {
            Redis::ping();
            $status['checks']['redis'] = 'healthy';
        } catch (\Exception $e) {
            $status['checks']['redis'] = 'unhealthy';
            $status['status'] = 'unhealthy';
        }

        // Cache check
        try {
            Cache::put('health_check', 'ok', 60);
            $status['checks']['cache'] = 'healthy';
        } catch (\Exception $e) {
            $status['checks']['cache'] = 'unhealthy';
            $status['status'] = 'unhealthy';
        }

        // Storage check
        try {
            $storagePath = storage_path();
            if (is_writable($storagePath)) {
                $status['checks']['storage'] = 'healthy';
            } else {
                $status['checks']['storage'] = 'unhealthy';
                $status['status'] = 'unhealthy';
            }
        } catch (\Exception $e) {
            $status['checks']['storage'] = 'unhealthy';
            $status['status'] = 'unhealthy';
        }

        $httpStatus = $status['status'] === 'healthy' ? 200 : 503;

        return response()->json($status, $httpStatus);
    }

    public function simple()
    {
        return response('healthy', 200)->header('Content-Type', 'text/plain');
    }
} 