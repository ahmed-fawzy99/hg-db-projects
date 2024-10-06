<?php

use App\Http\Controllers\ProfileController;
use App\Models\Project;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});


Route::group(['middleware' => 'auth'], function () {
    Route::get('/all', [\App\Http\Controllers\ProjectController::class, 'index'])->name('dashboard');
    Route::get('/late-projects', [\App\Http\Controllers\ProjectController::class, 'lateProjects'])->name('late-projects');
    Route::get('/ok-projects', [\App\Http\Controllers\ProjectController::class, 'okProjects'])->name('ok-projects');


});

Route::group(['middleware' => ['auth', \App\Http\Middleware\isAdmin::class]], function () {
    Route::get('/create-project', [\App\Http\Controllers\ProjectController::class, 'create'])->name('create-project');
    Route::post('/create-project', [\App\Http\Controllers\ProjectController::class, 'store'])->name('store-project');
    Route::get('/edit-project', [\App\Http\Controllers\ProjectController::class, 'edit'])->name('edit-project');
    Route::put('/edit-project', [\App\Http\Controllers\ProjectController::class, 'update'])->name('update-project');
    Route::delete('/delete-project', [\App\Http\Controllers\ProjectController::class, 'destroy'])->name('delete-project');

    Route::resource('users', \App\Http\Controllers\UserController::class)->middleware(\App\Http\Middleware\isAdmin::class);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
