<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Http\Request;

class Home extends Controller
{
    public function index(Request $request)
    {
        return view('index',
        [
            'sessionData' => json_encode(Session::getFromRequest())
        ]);
    }
}
