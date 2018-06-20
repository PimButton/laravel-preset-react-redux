<?php
namespace LeiNelissen\ReactReduxPreset;

use Illuminate\Support\ServiceProvider;
use Illuminate\Foundation\Console\PresetCommand;

class ReactReduxPresetServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        PresetCommand::macro('react-redux', function ($command) {
            ReactReduxPreset::install(false);
            $command->info('React-Redux scaffolding installed successfully.');
            $command->comment('Please run "npm install && npm run dev" to compile your fresh scaffolding.');
        });

        // PresetCommand::macro('react-redux-auth', function ($command) { //optional
        //     ReactReduxPreset::install(true);
        //     $command->info('React-Redux scaffolding with Auth views installed successfully.');
        //     $command->comment('Please run "npm install && npm run dev" to compile your fresh scaffolding.');
        // });
    }
}
