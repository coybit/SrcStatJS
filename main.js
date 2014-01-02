var sys = require('sys')
var childProcess = require('child_process');

var clocPath = '~/WebstormProjects/SrcStatJS/SrcStatJS/cloc-1.60.pl';
var gitScorePath = '~/WebstormProjects/SrcStatJS/SrcStatJS/git-score.py';
var projectsPath = [

    {name:'project1',
        path: '~/Documents/herokuprojects/project2'},

    {name:'project2',
        path: '~/Documents/xcodeprojects/project1'}
];



function puts(error, stdout, stderr) {

    if(error)
        return sys.puts(error);


    stdout.match(/SUM\:.+/g).forEach(function(m){
        var numbers =  m.match(/\d+/g);

        var file = parseInt(numbers[0]);
        var empty = parseInt(numbers[1]);
        var comment = parseInt(numbers[2]);
        var code = parseInt(numbers[3]);

        console.log(  empty+comment+code )
    })
}

function cloc() {
    for( var i=0; i<projectsPath.length; i++ ){

        var glog = function(p) {
            return (function(error,stdout,stderr) {
                sys.puts(p.name + ' at ' + p.path)
                puts(error,stdout,stderr);
            });
        }

        childProcess.exec('perl ' + clocPath + ' ' + projectsPath[i].path, glog(projectsPath[i]));
    }
}

function gitscore() {

    for( var i=0; i<projectsPath.length; i++) {
        var wd = projectsPath[i].path;
        wd = wd.replace('~','/Users/coybit/');

        childProcess.exec('python ' + gitScorePath, {cwd:wd}, (function(project){

                return function(err,stdout,stderr){

                sys.puts(project.name);

                if(err)
                    return sys.puts(err);

                var users = [];
                var lines = stdout.split('\n')
                lines.shift();  // Remove first line
                lines.pop();    // Remove last line

                lines.forEach(function(line) {
                    var user = line.split('\t')
                    users.push( {
                        name:user[0],
                        commit:user[1],
                        files:user[2],
                        delta:user[3],
                        plus:user[4],
                        minus:user[5]
                    });
                })

                sys.puts('.......................');
                users.forEach(function(user){
                    sys.puts(user.name + ' ... ' + user.commit );
                })
            };

        })(projectsPath[i]));
    }
}

gitscore();
cloc();