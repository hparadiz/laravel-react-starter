<?php

namespace App\Libraries\AWS;

use App\Utility;
use Aws\Ec2\Ec2Client;
use Aws\Exception\AwsException;

class EC2
{
    private static $ec2client;

    /**
     *
     * @return Ec2Client
     */
    public static function getClient()
    {
        if (!static::$ec2client) {
            static::$ec2client = new Ec2Client([
                'region' => 'us-west-2'
            ]);
        }
        return static::$ec2client;
    }

    /**
     * Gets instances by Tag
     *
     * @param string $key
     * @param string $value
     * @return array Instances
     */
    public static function getInstancesByTag($key, $value)
    {
        /**
         * @var \Aws\Result $instance
         * **/
        $result = static::getClient()->describeInstances();
        return $result->search(sprintf('Reservations[?not_null(Instances[?Tags[?Key==`%s` && Value == `%s`]])].Instances[*][]', $key, $value));
    }

    /**
     * Gets instances by Tag containing value
     *
     * @param string $key
     * @param string $value
     * @return array
     */
    public static function getInstancesByTagContains($key, $value)
    {
        /**
         * @var \Aws\Result $instance
         * **/
        $result = static::getClient()->describeInstances();
        return $result->search(sprintf('Reservations[?not_null(Instances[?Tags[?Key==`%s` && contains(Value,`%s`)]])].Instances[*][]', $key, $value));
    }

    /**
     * Gets instances
     *
     * @return array
     */
    public static function getAllInstances()
    {
        /**
         * @var \Aws\Result $instance
         * **/
        $result = static::getClient()->describeInstances();
        return $result->search('Reservations[*].Instances[*][]');
    }

    /**
     * Gets instances
     *
     * @param string $instanceId
     *
     * @return array Instance
     */
    public static function getInstanceByInstanceId($instanceId)
    {
        /**
         * @var \Aws\Result $instance
         * **/
        $result = static::getClient()->describeInstances();
        return $result->search(sprintf('Reservations[*].Instances[?InstanceId==`%s`][]|[0]', $instanceId));
    }
}
