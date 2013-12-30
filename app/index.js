'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var OptidocGenerator = module.exports = function OptidocGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(OptidocGenerator, yeoman.generators.Base);

OptidocGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'input',
    name: 'componentName',
    message: 'What is the name of the component you are documenting?'    
  },
  {
    type: 'input',
    name: 'componentType',
    message: 'What kind of component are you documenting?',
    choices: ['Directive', 'Controller', 'Service']
  },
  {
    type: 'input',
    name: 'purpose',
    message: 'What is the purpose of your component?'    
  }];

  this.prompt(prompts, function (props) {    
    this.componentName = props.componentName;
    this.componentType = props.componentType;
    this.purpose = props.purpose;
    cb();
  }.bind(this));
};

OptidocGenerator.prototype.app = function app() {
  //generate documentation directories, with image and bibliography sub directories  
  this.mkdir('docs');
  this.mkdir('docs/img');
  this.mkdir('docs/bib');
  var savetoDir = '';
  if (this.componentType == 'Directive') {
    savetoDir = 'docs/directives';
  } else if (this.componentType == 'Controller') {
    savetoDir = 'docs/controllers';
  } else {
    savetoDir = 'docs/services';
  }
  this.mkdir(savetoDir);
  this.copy('Opti_color_small.jpg', 'docs/img/Opti_color_small.jpg');


  var docTemplate = 
  ['\\documentclass[12pt,a4paper]{article}',
   '\\usepackage[utf8]{inputenc}',
   '\\usepackage{amsmath}',
   '\\usepackage{amsfonts}',
   '\\usepackage{amssymb}',
   '\\usepackage{makeidx}',
   '\\usepackage{graphicx}',
   '\\usepackage{titling}',
   '\\author{OptiRTC Developer Group}',
   '\\title{' + this.componentName + ' Component Specification}',
   '\\date{\today}',
   '\\begin{document}',   
   '\\includegraphics[width=4cm]{docs/img/Opti_color_small.png}',
   '\\newline',
   '\\newline',
   '\\{\\LARGE \\thetitle}',
   '\\newline',
   '\\newline',
   '{\\large \\theauthor}',
   '\\newline',
   '\\newline',
   'Compiled on: \\thedate',
   '\\section{Purpose/Responsibilities}',
   this.purpose,
   '\\section{Assumptions/Constraints}',
   '\\begin{itemize}',
   '\\item List assumptions and constraints here, one per item...',
   '\\end{itemize}',
   '\\section{Functionality/Tasks performed}',
   '\\begin{enumerate}',
   '\\item List functionality and tasks performed, one per item...',
   '\\end{enumerate}',
   '\\section{Interfaces (code and/or graphical)}',
   'Include images and service interface definitions here...'
   '\\section{Outputs}',
   '\\begin{enumerate}',
   '\\item List outputs here, one per item...',
   '\\end{enumerate}',
   '\\section{Dependencies}',
   '\\begin{itemize}',
   '\\item List dependencies here, one per item...',
   '\\end{itemize}',
   '\\section{Security}',
   '\\begin{itemize}',
   '\\item List security concerns here, one per item...',
   '\\end{itemize}',
   '\\end{document}'
  ].join('\n');

  if (this.)
  this.write('savetoDir' + '/' + this.componentName + '.tex', docTemplate);  
};

OptidocGenerator.prototype.projectfiles = function projectfiles() {
  /* consider building the latex files here to generate pdfs */
};
