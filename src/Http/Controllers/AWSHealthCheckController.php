<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AWSHealthCheckController extends Controller
{
    public function healthCheck(Request $request)
    {
        // Check if AWS health check request headers are present
        if ($request->header('User-Agent') === 'ELB-HealthChecker/2.0') {
            return response()->json(['status' => 'ok'], 200);
        } else {
            return response()->json(['status' => 'not ok'], 404);
        }
    }
}
