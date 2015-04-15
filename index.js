/**
 * This file is licensed under the MIT license
 *
 * Authors:
 *     - Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    'use strict';

    var fs = require( 'fs' ),
        path = require( 'path' ),
        _ = require( 'underscore' ),
        callsite = require( 'callsite' );

    /**
     * Loads all modules from directory, returns array
     * @param root_directory Relative path to root_directory where modules should be loaded from
     * @param options object containing options
     * @param options.exclude (Default=["index.js", /\..* /])File names to exclude from import
     * @returns {Array}
     */
    module.exports.load = function( root_directory, options ) {
        options = options || {};
        _.defaults( options, {
            exclude: [ 'index.js', /^\..*/ ]
        } );

        var caller_directory = path.dirname( callsite()[ 1 ].getFileName() );
        var root_directory_resolved = path.resolve( caller_directory, root_directory );

        var file_names = fs
            .readdirSync( path.resolve( caller_directory, root_directory ) );

        return _.chain( file_names )
            .filter( function( name ) { // Check that it doesn't match any of the excludes
                return _.every( options.exclude, function( exclude ) {
                    return !name.match( exclude ); // Does not match
                } );
            } )
            .map( function( name ) { // Import the file
                // Get full absolute path to the module
                var root_directory_resolved_file = path.resolve( root_directory_resolved, name );

                // Get it's relative path to here, prepend with ./ so that require() will understand it
                var relative = './' + path.relative( __dirname, root_directory_resolved_file );

                // Require the module
                return require( relative );
            } )
            .value();
    };
})();