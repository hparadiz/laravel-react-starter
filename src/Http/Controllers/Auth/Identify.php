<?php

namespace App\Http\Controllers\Auth;

use App\Models\Individual;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Libraries\MailableBlade;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Request;

class Identify extends Controller
{
    public function identify(Request $request): Response
    {
        if ($Individual = Individual::where('Email', $request->get('email'))->first()) {
            if ($Individual->isActive()) {
                // user not registered yet
                if ($Individual->registration_date === null) {
                    if ($Individual->is_registration_confirmed === false) {
                        // let's verify their identity first
                        $Individual->email_verification_code = mt_rand(10000, 99999);
                        Mail::mailer('sendmail')->to($Individual->email)->send(new MailableBlade('verifyCode', ['code'=>$Individual->email_verification_code]));
                        $Individual->save();

                        return new Response([
                            'success' => true,
                            'identificationState' => 'verifyCodePrompt'
                        ]);
                    }
                } else {
                    // user already registered. show them a password prompt
                    return new Response([
                        'success' => true,
                        'identificationState' => 'passwordPrompt'
                    ]);
                }
            } else {
                return new Response([
                    'success' => false,
                    'errors' => [
                        'This individual has not been activated. Please contact support.'
                    ]
                ]);
            }
        } else {
            return new Response([
                'success' => false,
                'errors' => [
                    'This individual was not found. Please contact support.'
                ]
            ]);
        }
    }

    public function verifyIdentity(Request $request): Response
    {
        // check email
        if ($Individual = Individual::where('Email', $request->get('email'))->first()) {
            if ($Individual->email_verification_code === intval($request->get('code'))) {
                // email verification confirmed, ask for a password
                return new Response([
                    'success' => true,
                    'identificationState' => 'registerPassword'
                ]);
            } else {
                return new Response([
                    'success' => false,
                    'errors' => [
                        "The provided code is incorrect."
                    ]
                ]);
            }
        } else {
            // something weird happened. back to first step
            return new Response([
                'success' => false,
                'identificationState' => 'identityPrompt',
                'errors' => [
                    'This individual was not found.'
                ]
            ]);
        }
    }

    /**
     * Requires that Email, Code, Password, and Confirm are all provided
     *
     * @param Request $request
     * @return Response
     */
    public function registerPassword(Request $request): Response
    {
        if ($Individual = Individual::where('Email', $request->get('email'))->first()) {
            // previously provided code must match as well
            if ($Individual->email_verification_code !== intval($request->get('code'))) {
                return new Response([
                    'success' => false,
                    'errors' => [
                        "The provided code is incorrect."
                    ]
                ]);
            }

            if ($request->get('password') !== $request->get('confirm')) {
                return new Response([
                    'success' => false,
                    'errors' => [
                        "Passwords don't match."
                    ]
                ]);
            } else {
                // at this point they have set their password and we should just bring them right in but they will still need to do the tos
                // however single page app should prompt for this post login
                $Individual->password = password_hash($request->get('password'), PASSWORD_DEFAULT);
                $Individual->is_registration_confirmed = true;
                $Individual->registration_date = date('Y-m-d');
                $Individual->save();

                return $this->doLogin($Individual, $request);
            }
        } else {
            // something weird happened. back to first step
            return new Response([
                'success' => false,
                'identificationState' => 'identityPrompt',
                'errors' => [
                    "Something went wrong. Please contact support."
                ]
            ]);
        }
    }

    public function verifyPassword(Request $request): Response
    {
        if ($Individual = Individual::where('Email', $request->get('email'))->first()) {
            if (password_verify($request->get('password'), $Individual->password) === true) {
                return $this->doLogin($Individual, $request);
            } else {
                return new Response([
                    'success' => false,
                    'errors' => [
                        "That password is incorrect."
                    ]
                ]);
            }
        } else {
            // something weird happened. back to first step
            return new Response([
                'success' => false,
                'identificationState' => 'identityPrompt',
                'errors' => [
                    "Something went wrong. Please contact support."
                ]
            ]);
        }
    }

    // put someone in
    public function doLogin(Individual $Individual, Request $request): Response
    {
        $this->Session->UserID = $Individual->id;
        $this->Session->save();
        return new Response([
            'success' => true,
            'session' => $this->Session
        ]);
    }

    public function logout(Request $request): Response
    {
        $this->Session->UserID = null;
        $this->Session->save();
        return new Response([
            'success' => true,
            'session' => $this->Session
        ]);
    }
}
