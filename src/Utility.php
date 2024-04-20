<?php

namespace App;

class Utility
{
    public static function GetAWSCredentials()
    {
        return [
            'credentials' => [
                'key'	=> env('AWS_ACCESS_KEY_ID'),
                'secret' => ENV('AWS_SECRET_ACCESS_KEY'),
            ],
            'region' => 'us-west-2',
            'version' => 'latest',
        ];
    }
}
