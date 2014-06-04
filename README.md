# png-reporter

> Do the element dimension comparison test and generate a png report based on that

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install png-reporter --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('png-reporter');
```

## The "png_reporter" task

### Overview
In your project's Gruntfile, add a section named `png_reporter` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  png_reporter: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.expectUrl
Type: `String`
Example value: `'http://localhost:8000/app'`

A url to compare with.

#### options.expectactionFile
Type: `String`
Example value: `'test/fixtures/expected.json'`

An expectation object to compare with

NOTE: if expectactionFile value is empty, expectUrl is taken instead, and will generate an expectaion file 

#### options.assertUrl
Type: `String`
Example value: `'http://localhost:8000/app'`

The url to check. This is a mandatory option

### Usage Examples

#### Options with Expectation File
In this example, we are giving an expectation file to compare with.

```js
grunt.initConfig({
  png_reporter: {
    options: {
      assertUrl: 'http://localhost:8000/app',
      expectationFile: 'test/fixtures/expected.json'
    }
  },
})
```

#### Options with Expectation File
In this example, we are giving a url to compare with

```js
grunt.initConfig({
  png_reporter: {
    options: {
      expectUrl: 'http://theapplication.com',
      assertUrl: 'http://localhost:8000/app'
    }
  },
})
```

## Release History


## License
Copyright (c) 2014 Jinto Jose. Licensed under the MIT license.
