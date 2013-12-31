'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
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

  console.log('\n');
  console.log('Welcome to OptiDoc, the first step in documenting OptiRTC components.');
  console.log('\n');

  var prompts = [{
    type: 'input',
    name: 'componentName',
    message: 'What is the name of the component you are documenting?'    
  },
  {
    type: 'list',
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
  this.mkdir('img');  
  this.copy('_package.json', 'package.json');  
  
  if (!fs.existsSync(this.destinationRoot() + '\\bib\\Bibliography.bib')) {
    console.log('initializing bibliography file');
    this.mkdir('bib');
    this.copy('_templateBibliography.bib', 'bib/Bibliography.bib');
    this.copy('Opti_color_small.png', 'img/Opti_color_small.png');
  }
  
  //assign output to directory of component type
  var savetoDir = '';
  if (this.componentType == 'Directive') {
    savetoDir = 'directives';
  } else if (this.componentType == 'Controller') {
    savetoDir = 'controllers';
  } else {
    savetoDir = 'services';
  }
  this.mkdir(savetoDir);  

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
   '\\date{\\today}',
   '\\begin{document}',   
   '\\includegraphics[width=4cm]{../img/Opti_color_small.png}',
   '\\newline',
   '\\newline',
   '{\\LARGE \\thetitle}',
   '\\newline',
   '\\newline',
   '\\theauthor \\cite{optirtcaboutus}',
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
   'Include images of GUIs and list service interface definitions here...',
   '\\section{Outputs}',
   '\\begin{enumerate}',
   '\\item N/A.',
   '\\end{enumerate}',
   '\\section{Dependencies}',
   '\\begin{itemize}',
   '\\item None.',
   '\\end{itemize}',
   '\\section{Security}',
   '\\begin{itemize}',
   '\\item None.',
   '\\end{itemize}',
   '\\bibliography{../bib/Bibliography}',
   '\\bibliographystyle{plain}',
   '\\end{document}'
  ].join('\n');
  
  this.write(savetoDir + '/' + this.componentName + '.tex', docTemplate);  
};

OptidocGenerator.prototype.projectfiles = function projectfiles() {
  /* consider building the latex files here to generate pdfs */
};
