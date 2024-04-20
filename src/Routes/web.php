<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CustomSessions;
use App\Http\Controllers\AWSHealthCheckController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::prefix('/')->middleware([ CustomSessions::class ])->group(function () {
    Route::any('/', [\App\Http\Controllers\Home::class,'index']);
    Route::prefix('/v1')->group(function () {
        Route::prefix('/auth')->group(function () {
            Route::any('/identify', [\App\Http\Controllers\Auth\Identify::class,'identify']); // person puts in email. we check if they are in the system here and provide next step as a password prompt or something else (oauth, etc)
            Route::any('/verify-identity', [\App\Http\Controllers\Auth\Identify::class,'verifyIdentity']); // email code
            Route::any('/verify-password', [\App\Http\Controllers\Auth\Identify::class,'verifyPassword']);
            Route::any('/register', [\App\Http\Controllers\Auth\Identify::class,'registerPassword']);
            Route::any('/logout', [\App\Http\Controllers\Auth\Identify::class,'logout']);
        });
    });
});




Route::get('/aws/healthcheck', [AWSHealthCheckController::class, 'healthCheck']);
