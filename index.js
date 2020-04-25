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

    var _removeExtension = function( filename ) {
        var filename_split = filename.split( '.' );
        if( filename_split.length === 1 ) {
            return filename;
        }
        filename_split.pop(); // Remove the last thing, which is the extension
        return filename_split.join( '.' );
    };

    /**
     * Loads all modules from directory, returns object
     * @param root_directory Relative path to root_directory where modules should be loaded from
     * @param options object [{}] - Optional argument containing options
     * @param options.exclude [["index.js", /\..* /]] File names to exclude from import
     * @param options.caller_directory [callsite()[ 1 ].getFileName] The directory to use as the root directory for the import (The __dirname of the person calling this method)
     * @returns {*} Object containing modules key: module name, value: module
     */
    exports.load = function( root_directory, options ) {
        options = options || {};
        _.defaults( options, {
            exclude: [ 'index.js', /^\..*/ ],
            caller_directory: path.dirname( callsite()[ 1 ].getFileName() )
        } );

        var root_directory_resolved = path.resolve( options.caller_directory, root_directory );

        var file_names = fs
            .readdirSync( path.resolve( options.caller_directory, root_directory ) );

        return _.chain( file_names )
            .filter( function( name ) { // Check that it doesn't match any of the excludes
                return _.every( options.exclude, function( exclude ) {
                    return !name.match( exclude ); // Does not match
                } );
            } )
            .map( function( name ) { // Import the file
                // Get full absolute path to the module
                var name_without_extension = _removeExtension( name );
                var root_directory_resolved_file = path.resolve( root_directory_resolved, name_without_extension );

                // Get it's relative path to here, prepend with ./ so that require() will understand it
                var relative = './' + path.relative( __dirname, root_directory_resolved_file );

                // Require the module
                return [ name_without_extension, require( relative ) ]; // Return both, so we can reduce it back into an object
            } )
            .reduce( function( full, part ) {
                if( !full ) full = {};
                full[ part[ 0 ] ] = part[ 1 ];
                return full;
            }, {} ) // start with empty object
            .value();
    };

    /**
     * Loads all modules from directory, returns object
     * @param root_directory Relative path to root_directory where modules should be loaded from
     * @param options [{}] See .load() for more information
     * @returns {Object} Object containing modules w/key as module_name
     */
    exports.loadObject = function( root_directory, options ) {
        options = options || {};
        _.defaults( options, {
            caller_directory: path.dirname( callsite()[ 1 ].getFileName() ) // Set this here, because when we call load we fuck up the stack
        } );

        // Load the modules
        return exports.load( root_directory, options );
    };

    /**
     * Loads all modules from directory, returns array
     * @param root_directory Relative path to root_directory where modules should be loaded from
     * @param options [{}] See .load() for more information
     * @returns {Array} Array containing modules
     */
    exports.loadArray = function( root_directory, options ) {
        options = options || {};
        _.defaults( options, {
            caller_directory: path.dirname( callsite()[ 1 ].getFileName() ) // Set this here, because when we call load we fuck up the stack
        } );

        var loaded = exports.loadObject( root_directory, options );

        // Use map to convert the object into a value array
        return _.map( loaded, function( item ) {
            return item
        } );
    };
})();