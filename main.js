var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){

  var list = '<ul>';            // data속 파일 리스트를 가져와서 ul 리스트를 구성
  var i = 0;
  while(i < filelist.length){
    list = list +`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if(pathname === '/'){   //지금 한 접속에 루트라면, 루트가 없는 경우라
    if(queryData.id === undefined){
      fs.readdir('./data', function(error, filelist){   //data 디렉토리에서 파일목록을 가져오고 끝나면 함수를 실행
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = tempateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
        response.writeHead(200);    //파일을 정상적으로 전송 했음을 답하는 값
        response.end(template);
      })
    } else{
      fs.readdir('./data', function(error, filelist){   //data 디렉토리에서 파일목록을 가져오고 끝나면 함수를 실행
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = tempateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);    //파일을 정상적으로 전송 했음을 답하는 값
          response.end(template);
        });
      });
    }
  }else{
    response.writeHead(404);      //파일을 정상적으로 전송 못 했음을 답하는 값
    response.end('Not found');
  }

});
app.listen(3000);
