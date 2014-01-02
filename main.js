var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    //sys.puts(stdout)
    //sys.puts(stderr)
    //console.log(stdout.split(' ').join('.'))

    stdout.match(/SUM\:.+/g).forEach(function(m){
        var numbers =  m.match(/\d+/g);

        var file = parseInt(numbers[0]);
        var empty = parseInt(numbers[1]);
        var comment = parseInt(numbers[2]);
        var code = parseInt(numbers[3]);

        console.log(  empty+comment+code )
    })
}

var clocPath = 'cloc-1.60.pl';

var projectsPath = [

    {name:'project1',
    path: '~/Documents/cloc/herokuprojects'},

    {name:'project2',
    path: '~/Documents/cloc/xcodeprojects'}
    ];

for( var i=0; i<projectsPath.length; i++ ){

    exec('perl ' + clocPath + ' ' + projectsPath[i].path, puts);
}