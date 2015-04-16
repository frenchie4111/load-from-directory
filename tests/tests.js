/**
 * This file is licensed under the MIT license
 *
 * Authors:
 *     - Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    'use strict';

    var assert = require( 'chai' ).assert,
        load_modules = require( '../index' );

    describe( 'load', function() {
        it( 'should exist', function() {
            assert.isDefined( load_modules.load );
        } );

        describe( 'load', function() {
            it( 'Should load modules into object', function() {
                var modules = load_modules.load( 'test_folder' );
                assert.isObject( modules );
                assert.property( modules, 'module' );
                assert.isFunction( modules[ 'module' ].method );
                assert.equal( modules[ 'module' ].method(), 'method_response' );
            } );
        } );

        describe( 'loadArray', function() {
            it( 'should load modules in test directory', function() {
                var modules = load_modules.loadArray( 'test_folder' );
                assert.equal( modules.length, 1, 'Should have imported one module' );
                assert.property( modules[ 0 ], 'method', 'Should have method' );
                assert.equal( modules[ 0 ].method(), 'method_response', 'Should respond' );
            } );

            it( 'should load modules in test directory', function() {
                var modules = load_modules.loadArray( 'test_folder' );
                assert.equal( modules.length, 1, 'Should have imported one module' );
                assert.property( modules[ 0 ], 'method', 'Should have method' );
                assert.equal( modules[ 0 ].method(), 'method_response', 'Should respond' );
            } );

            it( 'should ignore dotfiles by default', function() {
                var modules = load_modules.loadArray( 'test_folder_ignore' );
                assert.equal( modules.length, 1, 'Should have imported one module' );
                assert.property( modules[ 0 ], 'method', 'Should have method' );
                assert.equal( modules[ 0 ].method(), 'method_response', 'Should respond' );
            } );

            it( 'should ignore more things if specified', function() {
                var modules = load_modules.loadArray( 'test_folder_ignore', {
                    exclude: [ /.*/ ] // Ignore everything
                } );
                assert.equal( modules.length, 0, 'Should have imported one module' );
            } );
        } );
    } )
})();