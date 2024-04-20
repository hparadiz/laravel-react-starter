<?php
namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class BinaryCast implements CastsAttributes
{
    protected function getCast($value)
    {
        return hex2bin($value);
    }

    protected function setCast($value)
    {
        return bin2hex($value);
    }

    /**
     * @inheritDoc
     */
    public function get($model, $key, $value, array $attributes)
    {

        return $this->getCast($value);

        return $value;
    }

    /**
     * @inheritDoc
     */
    public function set($model, $key, $value, array $attributes)
    {
        return $this->setCast($value);
    }
}