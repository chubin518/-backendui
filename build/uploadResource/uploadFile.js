

const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const axios = require('axios')
const conf = require("./conf");

/**
 * 获取文件上传header
 * @param {*} form 
 */
function get_upload_header(form) {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        reject(err);
      }
      let header = Object.assign({
        'Content-Length': length,
        'user-token': conf.USER_TOKEN,
        'asset-key': conf.ASSET_KEY
      }, form.getHeaders());
      resolve(header);
    });
  })
}

/**
 * 遍历获取目录下的文件
 * @param {*} dirPath 
 */
function get_upload_file(dirPath) {
  let fileResult = [];
  let lstFile = fs.readdirSync(dirPath);
  if (!lstFile || lstFile.length <= 0) {
    return fileResult;
  }
  lstFile.forEach(fileName => {
    let filePath = path.join(dirPath, fileName); //获取当前文件绝对路径
    //根据文件路径获取文件信息，返回一个fs.Stats对象
    let stats = fs.statSync(filePath);
    if (stats.isFile()) {
      fileResult.push({
        dirPath: dirPath,
        name: fileName,
        filePath: filePath
      });
    }
    if (stats.isDirectory()) {
      let subList = get_upload_file(filePath);
      fileResult = fileResult.concat(subList);
    }
  });
  return fileResult;
}

/**
 * 上传文件至狮子座
 * @param {*} filePath 
 * @param {*} key 
 */
function file_upload(filePath, key) {
  return new Promise((resolve, reject) => {
    let file = path.parse(filePath);
    let data = fs.createReadStream(filePath);
    let form = new FormData();
    form.append("bucket_name", conf.BUCKET_NAME);
    form.append("key", key.toLowerCase());
    form.append("file", data, file.name.toLowerCase() + file.ext);
    get_upload_header(form)
      .then(result => {
        return axios.post(conf.UPLOAD_URL, form, {
          headers: result
        });
      }).then(result => {
        resolve(result.data);
      }).catch(err => {
        reject(err);
      });
  });
}


module.exports = {
  /**
   * 根据打包的静态文件目录上传文件至狮子座
   * @param {*} dirPath 
   */
  uploadResource(dirPath) {
    let result = {
      code: 0,
      msg: [],
      result: [],
      type: []
    };
    let lstFile = get_upload_file(dirPath);

    lstFile.forEach(async (file) => {
      let fileDir = file.dirPath.replace(dirPath, '').replace(/\\/g, '/');
      if (fileDir && fileDir[0] == '/') {
        fileDir = fileDir.substring(1);
      }
      let fileKey = `/${conf.BUCKET_NAME}/${conf.get_Env()}/${(fileDir ? `${fileDir}/` : '')}`;
      let res = await file_upload(file.filePath, fileKey);
      if (res && res.code == 0) {
        result.msg.push(res.msg)
        result.result.push(res.result)
        result.type.push(res.type)
      } else {
        result.code = 100;
        result.msg.push(res.msg)
        result.result.push(res.result)
        result.type.push(res.type)
        console.error(`${file.filePath}上传至${fileKey}失败`);
      }
    });
    return result;
  }
};
