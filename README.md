# load-from-directory
Loads all nodejs modules from the given directory into an array

## Usage

Filetree:

- index.js
- test_directory/
    - test.js

test.js:
```javascript
module.exports = 'test_string_in_file'
```

index.js:

```javascript
var load_from_directory = require( 'load_from_directory' );
var loaded = load_from_directory.load( 'test_directory' );
console.log( loaded );
```

Output:

```javascript
{
    "test": "test_string_in_file"
}
```
