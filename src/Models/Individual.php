<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Individual extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'is_active',
        'last_tos_agreement_at',
        'registration_date',
        'is_registration_confirmed',
        'date_of_birth',
        'phone',
        'email_verification_code'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'email_verification_code',
        'registration_date',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['full_name'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',

        /** As the TOS changes a new login could prompt a new TOS agreement confirmation. */
        'last_tos_agreement_at' => 'datetime',

        /** The registration date/time */
        'registration_date' => 'datetime',

        /** Did the user confirm ownership of their email */
        'is_registration_confirmed' => 'boolean',

        'date_of_birth' => 'date',
        'gender' => 'int',
        'email_verification_code' => 'int',
    ];

    /**
     * Get the individual's full name.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return $this->attributes['first_name'] . ' ' . $this->attributes['last_name'];
    }

    public function isActive()
    {
        return $this->is_active;
    }
}
