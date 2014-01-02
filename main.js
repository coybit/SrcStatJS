var sys = require('sys')
var childProcess = require('child_process');

var clocPath = '~/WebstormProjects/SrcStatJS/SrcStatJS/cloc-1.60.pl';
var gitScorePath = '~/WebstormProjects/SrcStatJS/SrcStatJS/git-score.py';
var projectsPath = [
    {name:'project1',
     path: '~/Documents/herokuprojects/project1'},

    {name:'project2',
     path: '~/Documents/xcodeprojects/project2'}
];
var debugLevel = 2;


function dlog(msg,level) {

    if(level<=debugLevel)
        sys.puts(msg);
}

function gitScoreOutputAnalyzer(err,stdout,stderr){

    if(err)
        return dlog(err,1);

    var users = [];
    var lines = stdout.split('\n').slice(1,-1); // Split to lines and remove first and last lines

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

    users.forEach(function(user){
        dlog(user.name + ' ... ' + user.commit , 2);
    })
}

function clocOutputAnalyzer(error, stdout, stderr) {

    if(error)
        return dlog(error,1);
    else
        dlog(stdout,3);

    var languages = [];

    stdout.split('\n').slice(8).forEach(function(line){

        if(line==undefined || line.length==0 || line.indexOf('---')!=-1)
            return;

        // Valid Line Format: [Language] [Files] [Blank] [Comment] [Code][EOL]

        var parts = line.match(/((\w|\+|\/|\:)+(\s|$))+/g);
        var language = {
            name: parts[0],
            files: parseInt(parts[1]),
            blank: parseInt(parts[2]),
            comment: parseInt(parts[3]),
            code: parseInt(parts[4])
        }

        languages.push(language);

        dlog(language.name + '...' + (language.code+language.comment+language.blank), 2);
    });
}

/*
Extracting information about the used languages and LOC for each one
 */
function cloc() {
    for( var i=0; i<projectsPath.length; i++ ){

        childProcess.exec('perl ' + clocPath + ' ' + projectsPath[i].path, (function(project){
            return (function(error,stdout,stderr) {

                dlog(project.name + ' at ' + project.path,2)

                clocOutputAnalyzer(error,stdout,stderr);

            });
        }) (projectsPath[i]));
    }
}

/*
Extracting information about user contribution in each repository
 */
function gitscore() {

    for( var i=0; i<projectsPath.length; i++) {
        var wd = projectsPath[i].path;
        wd = wd.replace('~','/Users/coybit/');

        childProcess.exec('python ' + gitScorePath, {cwd:wd}, (function(project){
            return (function(error,stdout,stderr) {

                dlog(project.name + ' at ' + project.path,2);

                gitScoreOutputAnalyzer(error,stdout,stderr);

            });
        })(projectsPath[i]));
    }
}

gitscore();
cloc();