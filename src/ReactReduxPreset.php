<?php
namespace LeiNelissen\ReactReduxPreset;

use Artisan;
use Illuminate\Support\Arr;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Console\Presets\Preset;

class ReactReduxPreset extends Preset
{
    /**
     * Install the preset.
     *
     * @return void
     */
    public static function install($withAuth = false)
    {
        static::updatePackages();
        static::updateWebpackConfiguration();
        static::updateSass();
        static::updateBootstrapping();
        static::updateWelcomePage();
        static::removeNodeModules();
    }

    /**
     * Update the "package.json" file.
     *
     * @return void
     */
    protected static function updatePackages($dev = true)
    {
        if (! file_exists(base_path('package.json'))) {
            return;
        }
        
        $packages = json_decode(file_get_contents(base_path('package.json')), true);
        
        $dependencies = static::updatePackageArray(
            $packages
        );

        $packages['dependencies'] = $dependencies['dependencies'];
        $packages['devDependencies'] = $dependencies['devDependencies'];

        ksort($packages['dependencies']);
        ksort($packages['devDependencies']);

        file_put_contents(
            base_path('package.json'),
            json_encode($packages, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT).PHP_EOL
        );
    }

    /**
     * Update the given package array.
     *
     * @param  array  $packages
     * @return array
     */
    protected static function updatePackageArray(array $packages)
    {
        // packages to add to the package.json
        $packagesToAdd = [
            'axios' => '^0.18',
            'history' => '^4.7.2',
            'localforage' => '^1.7.1',
            'lodash' => '^4.17.4',
            'normalizr' => '^3.2.4',
            'pluralize' => '^7.0.0',
            'react' => '^16.2.0',
            'react-dom' => '^16.2.0',
            'react-redux' => '^5.0.7',
            'react-router' => '^4.3.1',
            'react-router-redux' => '^5.0.0-alpha.9',
            'react-select' => '^2.0.0-beta.6',
            'redux' => '^4.0.0',
            'redux-act' => '^1.7.4',
            'redux-logger' => '^3.0.6',
            'redux-persist' => '^5.10.0',
            'redux-thunk' => '^2.3.0'
        ];

        // packages to add as dev dependency to the package.json
        $packagesToAddDev = [
            'babel-eslint' => '^8.2.3',
            'babel-preset-react' => '^6.23.0',
            'cross-env' => '^5.1',
            'eslint' => '^4.19.1',
            'eslint-plugin-react' => '^7.9.1',
            'laravel-mix' => '^2.0',
            'laravel-mix-react-css-modules' => '^1.2.0'
        ];

        // packages to remove from the package.json
        $packagesToRemove = ['vue', 'jquery', 'bootstrap', 'popper.js', 'lodash', 'axios'];

        return [
            'dependencies' => $packagesToAdd,
            'devDependencies' => $packagesToAddDev + Arr::except($packages['devDependencies'], $packagesToRemove),
        ];    
    }

    /**
     * Update the Sass files for the application.
     *
     * @return void
     */
    protected static function updateSass()
    {
        // delete sass folder
        (new Filesystem)->deleteDirectory(
            resource_path('assets/sass')
        );
    }

    /**
     * Update the bootstrapping files.
     *
     * @return void
     */
    protected static function updateBootstrapping()
    {
        // remove existing assets folder
        (new Filesystem)->deleteDirectory(
            resource_path('assets/js')
        );

        // copy new assets structure
        (new Filesystem)->copyDirectory(__DIR__.'/react-redux-stubs/assets', resource_path('assets'));
    }

    /**
     * Update the default welcome page file.
     *
     * @return void
     */
    protected static function updateWelcomePage()
    {
        // remove default welcome page
        (new Filesystem)->delete(
            resource_path('views/welcome.blade.php')
        );

        // copy new one from your stubs folder
        copy(__DIR__.'/react-redux-stubs/views/react.blade.php', resource_path('views/welcome.blade.php'));
    }

    /**
     * Copy Auth view templates.
     *
     * @return void
     */
    // protected static function addAuthTemplates()
    // {
    //     // Add Home controller
    //     copy(__DIR__.'/stubs-stubs/Controllers/ReactController.php', app_path('Http/Controllers/ReactController.php'));

    //     // Add Auth routes in 'routes/web.php'
    //     $auth_route_entry = "Auth::routes();\n\nRoute::get('/', 'ReactController@index')->name('react');\n\n";
    //     file_put_contents('./routes/web.php', $auth_route_entry, FILE_APPEND);

    //     // Copy Skeleton auth views from the stubs folder
    //     (new Filesystem)->copyDirectory(__DIR__.'/foundation-stubs/views', resource_path('views'));
    // }

    /**
     * Update the Webpack configuration.
     *
     * @return void
     */
    protected static function updateWebpackConfiguration()
    {
        copy(__DIR__.'/react-redux-stubs/webpack.mix.js', base_path('webpack.mix.js'));
        copy(__DIR__.'/react-redux-stubs/.eslintrc.js', base_path('.eslintrc'));
    }
}
