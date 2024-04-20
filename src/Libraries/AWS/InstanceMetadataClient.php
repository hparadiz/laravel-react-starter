<?php

namespace App\Libraries\AWS;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Aws\Credentials\InstanceProfileProvider;

class InstanceMetadataClient
{
    public function getInstanceId()
    {
        $data = $this->fetchInstanceMetadata();
        return $data;
    }

    public function fetchInstanceMetadata()
    {
        $token = $this->getToken();
        try {
            $client = new Client([
                'base_uri' => 'http://169.254.169.254',
                'timeout' => 0.5,
                'headers' => [
                    'X-AWS-EC2-Metadata-Token'=>$token
                ]
            ]);

            $response = $client->request('GET', '/latest/meta-data/instance-id');

            return $response->getBody()->getContents();
        } catch (RequestException $e) {
            echo 'Error: ' . $e->getMessage();
        }
    }

    public function getToken()
    {
        try {
            $client = new Client([
                'base_uri' => 'http://169.254.169.254',
                'timeout' => 0.5,
                'headers' => [
                    'X-aws-ec2-metadata-token-ttl-seconds'=>21600
                ]
            ]);

            $response = $client->request('PUT', '/latest/api/token');

            $contents = $response->getBody()->getContents();
            return $contents;
        } catch (RequestException $e) {
            echo 'Error: ' . $e->getMessage();
        }
    }
}
