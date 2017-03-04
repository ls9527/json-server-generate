var fs = require('fs');  
var pathHold = require("path")
var uuid = require('node-uuid');
var contentPath = './static';
/* 
 
递归处理文件,文件夹 
 
path 路径 
floor 层数 
handleFile 文件,文件夹处理函数 
 
*/  
  
function walk(path,finishedFunc) {  
    handleFile(path);   
    var fileList = fs.readdirSync(path);
    fileList.forEach(function(item) {  
    var tmpPath = path + '/' + item;  
    var stats = fs.statSync(tmpPath);
    if (stats.isDirectory()) {  
                            walk(tmpPath, handleFile);  
                        } else {  
                            handleFile(tmpPath);  
                        }  
   });
}

var resultData = {};
var routeData = {};
function handleFile(path) {  
    var blankStr = '';  
	var stats = fs.statSync(path);
  
    if (stats.isDirectory()) {  
                console.log('+' + blankStr + path);  
            } else {  
                console.log('-' + blankStr + path);
                var absolutePath = pathHold.resolve(blankStr + path);
                
                var keyName = path;//pathHold.basename(absolutePath);
                keyName = keyName.substr(1,keyName.length-1);
                if(keyName.indexOf(".")>0){
					keyName = keyName.substring(contentPath.length-1,keyName.lastIndexOf("."));
                }

                result = fs.readFileSync(absolutePath,"utf-8");
                result = JSON.parse(result);

                //keyName 就是服务器希望访问的路径, 然后通过随机一个uuid 生成和keyName 对应的路由表
                var url = uuid.v1();
                resultData[url] = result;
                routeData[keyName] = "/"+url;
            }  
  
  
}   
  
 
  walk(contentPath);  

fs.writeFile("route.json",JSON.stringify(routeData));
fs.writeFile("db.json",JSON.stringify(resultData))
