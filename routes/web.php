<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\WeatherController;

/*Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');*/

Route::get('/', [WeatherController::class, 'index'])->name('home');
Route::get('/weather/data', [WeatherController::class, 'fetch'])->name('weather.fetch');
Route::get('/weather/search', [WeatherController::class, 'search'])->name('weather.search');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
