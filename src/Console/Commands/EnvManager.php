<?php

namespace App\Console\Commands;

use Aws\Ssm\SsmClient;
use App\Libraries\AWS\EC2;
use Illuminate\Console\Command;
use App\Libraries\AWS\InstanceMetadataClient;

class EnvManager extends Command
{
    protected $signature = 'env:write';
    protected $description = 'Update .env file';

    public function handle()
    {
        $parameterName = 'starter-app';

        $client = new SsmClient([
            'region' => 'us-west-2',
            'version' => 'latest',
        ]);

        $result = $client->getParameters([
            'Names' => [$parameterName],
            'WithDecryption' => true, // If the parameters are encrypted
        ]);

        $parameters = $result['Parameters'];

        foreach ($parameters as $parameter) {
            $key = basename($parameter['Name']); // Extract parameter name
            $value = $parameter['Value'];
            $this->updateEnv(json_decode($value, true));
        }

        $this->info('Parameters pulled and updated successfully.');
    }

    /**
     * If name contains the phrase prod or cron production is true
     *
     * @param string $Name
     * @return boolean
     */
    public function isProductionByName($Name)
    {
        if (is_int(stripos($Name, 'webapp')) || is_int(stripos($Name, 'cron')) || is_int(stripos($Name, 'JobRunner')) || is_int(stripos($Name, 'FitSync'))) {
            return true;
        } else {
            return false;
        }
    }

    public function detectEnvironment()
    {
        $metaDataClient = new InstanceMetadataClient();

        try {
            $instanceId = $metaDataClient->getInstanceId();
        } catch (\Exception $e) {
            $instanceId = false;
        }


        if ($instanceId === false) {
            $user = get_current_user();
            $local = true;
            $app['name'] = 'dev-local-'.$user.'-'.(PHP_OS==='Darwin' ? 'OSX' : PHP_OS);
            $app['APP_ENV'] = 'local';
            $app['LOG_LEVEL'] = 'debug';
            $production = false;
            $this->info('Detected <options=bold>Local</> environment.');
        } else {
            $this->info('Detected EC2 environment Instance <options=bold>'.$instanceId.'</>.');
            $instance = EC2::getInstanceByInstanceId($instanceId);
            $Tags = $instance['Tags'];
            foreach ($Tags as $Tag) {
                if ($Tag['Key'] == 'Name') {
                    $production = $instance['Production'] = static::isProductionByName($Tag['Value']);
                    $app['name'] = $Tag['Value'];
                }
            }
            $app['LOG_LEVEL'] = 'error';
            $app['APP_ENV'] = $production ? 'production' : 'local';
            $app['APP_DEBUG'] = $production ? 'false' : 'true';
        }

        $this->info('Using name <options=bold>'.$app['name'].'</>');
        if ($production) {
            $this->info('Found <options=bold>production</> environment');
        } else {
            $this->info('Found <options=bold>dev</> environment');
        }

        return $app;
    }

    public function parse_env_file($filename)
    {
        $env_data = [];
        $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            // Ignore comments and lines without '='
            if (strpos(trim($line), '=') !== false && strpos(trim($line), '#') !== 0) {
                list($key, $value) = explode('=', $line, 2);
                $env_data[trim($key)] = trim($value);
            }
        }

        return $env_data;
    }

    public function updateEnv($json)
    {
        $envTemplateFile = base_path('.env.example');
        $this->info('Using .env.example as a template.');
        $envOverride = $this->parse_env_file('.env.local-override');
        $envFile = base_path('.env');

        $detected = $this->detectEnvironment();

        if (file_exists($envTemplateFile)) {
            $envContents = file_get_contents($envTemplateFile);

            foreach ($json as $key=>$value) {
                // Key exists, update value
                if (strpos($envContents, $key) !== false) {
                    $this->info(sprintf('Writing %s from AWS Parameter Storage', $key));
                    $envContents = preg_replace("/{$key}=.*/", "{$key}={$value}", $envContents);
                } else {
                    // Key doesn't exist, append it
                    //$envContents .= "\n{$key}={$value}";
                }
            }

            foreach ($detected as $key=>$value) {
                if (strpos($envContents, $key) !== false) {
                    $this->info(sprintf('Writing %s from Automatic Environment Detection', $key));
                    $envContents = preg_replace("/{$key}=.*/", "{$key}={$value}", $envContents);
                } else {
                    // Key doesn't exist, append it
                    //$envContents .= "\n{$key}={$value}";
                }
            }

            foreach ($envOverride as $key=>$value) {
                if (strpos($envContents, $key) !== false) {
                    $this->info(sprintf('Writing %s from .env.local-override', $key));
                    $envContents = preg_replace("/{$key}=.*/", "{$key}={$value}", $envContents);
                } else {
                    // Key doesn't exist, append it
                    //$envContents .= "\n{$key}={$value}";
                }
            }


            $this->info('Writing .env');
            file_put_contents($envFile, $envContents);
        }
    }
}
