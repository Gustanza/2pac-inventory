<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ShopController;

Route::middleware('auth:sanctum')->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('shops', ShopController::class);
});

Route::post('/register', [UserController::class, 'store']);
Route::post('/login', [UserController::class, 'login']);

