<?php

namespace App\Models;

use App\Casts\BinaryCast;
use App\Models\SessionKey;
use App\Models\LoginAttempt;
use Illuminate\Support\Facades\App;
use Illuminate\Database\Eloquent\Model;

/**
 * This class is a replacement for built in PHP Sessions using Model as the data store.
 *
 * Forked from https://github.com/Divergence/framework/blob/release/src/Models/Auth/Session.php
 *
 * @author Henry Paradiz
 *
 * @property SessionKey $SessionKey
 * @property LoginAttempt $LastLogin Last login attempt
 *
 */
class Session extends Model
{
    // Session configurables
    public static $cookieName = 's';
    public static $cookieDomain = null;
    public static $cookiePath = '/';
    public static $cookieSecure = false;
    public static $cookieExpires = false;
    public static $timeout = 14400; // 4 hours //3600;

    protected $table = 'sessions';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'Handle',
        'LastRequest',
        'LastIP',
        'UserID',
        'Type',
        'AuthSourceID',
        'AssertionValidUntil',
        'PendingUserID'
    ];

    protected $casts = [
        'LastIP' => BinaryCast::class,
    ];

    public function toArray()
    {
        $attributes = parent::toArray();
        $attributes['LastIP'] = $this->getLastIPAttribute($attributes['LastIP']);
        $attributes['Individual'] = $this->Individual;
        return $attributes;
    }

    /**
     * Get the individual that owns the session.
     */
    public function Individual()
    {
        return $this->belongsTo(Individual::class, 'UserID', 'id');
    }

    public function getLastIPAttribute($value)
    {
        return inet_ntop($value);
    }

    /**
     * Checks for situations where we do not want to use Sessions
     *
     * @return bool
     */
    public static function ignoreCheck()
    {
        // Fitbit
        if ($_SERVER['REQUEST_URI'] === '/access/fitbit/subscription.php') {
            return true;
        }
        return false;
    }

    /**
     * Gets the Session based on an existing Cookie or Request parameter.
     *
     * @param boolean $create Create if not existing
     * @return static Current Session
     */
    public static function getFromRequest($create = true)
    {
        if (static::ignoreCheck()) {
            return;
        }

        $isMobile = false; //Utility::IsUsingOurMobileApp();

        $sessionData = [
            'LastIP' => inet_pton($_SERVER['REMOTE_ADDR']),
            'LastRequest' => date('Y-m-d H:i:s'), //time(),
            'Type' => $isMobile ? 'mobile' : 'web',
        ];

        // try to load from json post body
        if (!$_REQUEST) {
            $jsonBody = static::getJSONFromRequest();
            if (!empty($jsonBody[static::$cookieName])) {
                if ($Session = static::getByHandle($jsonBody[static::$cookieName])) {
                    // update session & check expiration
                    $Session = $Session->updateSession($sessionData);
                }
            }
            if (!empty($jsonBody['cookies'])) {
                $_COOKIE = array_merge($_COOKIE, $jsonBody['cookies']);
            }
        }

        // try to load from cookie
        if (empty($Session) && !empty($_COOKIE[static::$cookieName])) {
            if ($Session = static::getByHandle($_COOKIE[static::$cookieName])) {
                // update session & check expiration
                return $Session->updateSession($sessionData);
            }
        }


        // try to load from any request method
        if (empty($Session) && !empty($_REQUEST[static::$cookieName])) {
            if ($Session = static::getByHandle($_REQUEST[static::$cookieName])) {
                // update session & check expiration
                return $Session->updateSession($sessionData);
            }
        }

        if (!empty($Session)) {
            // session found
            return $Session;
        } elseif ($create) {
            // create session
            $Session = static::create($sessionData, true);
            return $Session->updateSession($sessionData);
        } else {
            // no session available
            return false;
        }
    }

    public function updateSession($sessionData)
    {
        // check timestamp
        if (strtotime($this->LastRequest) < (time() - static::$timeout) && $this->Type == "web") {
            //$this->terminate();
            //return false;

            // TODO: this needs to be rewritten to Return a new Session object
        } else {
            // update session
            $this->fill($sessionData);
            $this->updated_at = date('Y-m-d H:i:s');
            if (!$this->created_at) {
                $this->created_at = date('Y-m-d H:i:s');
            }
            $this->setCookies();
            if (function_exists('fastcgi_finish_request')) {
                App::registerShutdownFunction(\Closure::bind(function () {
                    /**
                     * WARNING
                     *	Possible race condition where if one thread removes an UserID another thread will save the Session that exists in memory overwriting the logout or login
                     *	We only update LastRequest & LastIP by the Primary Key which we already have.
                     */
                    Session::where('id', $this->id)->update([
                        'LastRequest' => $this->LastRequest,
                        'LastIP' => $this->LastIP
                    ]);
                }, $this), 'Session');
            } else {
                $this->save();
            }
        }
        return $this;
    }

    public function setCookies()
    {
        setcookie(
            static::$cookieName,
            $this->Handle,
            static::$cookieExpires ? (time() + static::$cookieExpires) : 0,
            static::$cookiePath,
            static::$cookieDomain,
            static::$cookieSecure
        );
    }

    public static function getByHandle($handle)
    {
        return static::firstWhere('Handle', $handle);
    }

    public static function getBySessionID($sessionID)
    {
        return static::find($sessionID);
    }

    public function save(array $options = [])
    {
        // set handle
        if (!$this->Handle) {
            $this->Handle = static::generateUniqueHandle();
        }

        // call parent
        return parent::save($options);
    }

    public function terminate()
    {
        setcookie(static::$cookieName, '', time() - 3600);
        unset($_COOKIE[static::$cookieName]);

        $this->delete();
    }



    public static function generateUniqueHandle()
    {
        do {
            $handle = md5(mt_rand(0, mt_getrandmax()));
        } while (static::getByHandle($handle));

        return $handle;
    }

    /**
     * Pulls in JSON request data
     *
     * @param string $subkey If given checks for something inside the request data and returns that instead of the whole thing.
     * @return object|false
     */
    public static function getJSONFromRequest($subkey=null)
    {
        $inputStream = 'php://input';

        if (!$requestText = file_get_contents($inputStream)) {
            return false;
        }

        $data = json_decode($requestText, true);

        return $subkey ? $data[$subkey] : $data;
    }
}
