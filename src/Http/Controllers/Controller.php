<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests;
    use ValidatesRequests;

    public Session $Session;

    public function __construct()
    {
        $Session = Session::getFromRequest();
        if (is_a($Session, Session::class)) {
            $this->Session = $Session;
        }
    }
}
