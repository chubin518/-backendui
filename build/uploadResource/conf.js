module.exports = {
  USER_TOKEN: "",
  ASSET_KEY: "",
  BUCKET_NAME: "",
  UPLOAD_URL: "",
  PROJECT_UK: "",
  GLUI_VERSION_KEY: "",
  /**
   * 获取当前的环境变量
   */
  get_Env() {
    let env = "";
    switch (process.env.NODE_ENV) {
      case 'production':
        env = "product";
        break;
      case 'testing':
        env = "qa";
        break;
      case 'stage':
        env = "stage";
        break;
      default:
        env = "test";
        break;
    }
    return env;
  }
};
