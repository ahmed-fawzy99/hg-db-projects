<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    private $DAYS_FILTER = 13;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Projects/AllProjects', [
            'projects' => Project::get(),
        ]);
    }
    public function lateProjects()
    {
        return Inertia::render('Projects/LateNoneProjects', [
            'projects' => Project::whereRaw('(initial_review_notes_delivery_to_coord_unit_date - finances_payment_date) > ?', [$this->DAYS_FILTER])
                ->orWhereNull('initial_review_notes_delivery_to_coord_unit_date')
                ->orderBy('initial_review_notes_delivery_to_coord_unit_date', 'asc')
                ->get(),
        ]);
    }
    public function okProjects()
    {
        return Inertia::render('Projects/OkProjects', [
            'projects' => Project::whereRaw('(initial_review_notes_delivery_to_coord_unit_date - finances_payment_date) <= ?', [$this->DAYS_FILTER])
                ->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Projects/CreateProject');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateProjectRequest $request)
    {

        $project = Project::create($request->except('review_letter'));
        if (isset($request->validated()['review_letter'])) {
            $project->addMedia($request->validated()['review_letter'])->toMediaCollection('review_letter');
        }
        return redirect()->route('show-project', ['id' => $project->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $project = Project::findOrFail($request->id);
        return Inertia::render('Projects/ProjectView', [
            'project' => $project,
            'review_letter' => str_replace(env('APP_URL'), '', $project->getFirstMedia('review_letter')->getUrl()),
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        $project = Project::findOrFail($request->id);
        return Inertia::render('Projects/EditProject', [
            'project' => $project,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request)
    {
        $project = Project::findOrFail($request->id);
        $project->update($request->except('review_letter'));
        if (isset($request->validated()['review_letter'])) {
            $project->clearMediaCollection('review_letter');
            $project->addMedia($request->validated()['review_letter'])->toMediaCollection('review_letter');
        }
        return redirect()->route('show-project', ['id' => $project->id]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $project = Project::findOrFail($request->id);
        $project->delete();
        return redirect()->route('dashboard');
    }
}
