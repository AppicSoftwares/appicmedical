
var env = process.env.APP_ENV;
var env_path;
console.log('ionic APP_ENV', env);

switch(env) {
  case 'dev':
    env_path = '{{SRC}}/env/dev/env.js';
    break;
 case 'prod':
   env_path = '{{SRC}}/env/prod/env.js';
   break;
 case 'qa':
   env_path = '{{SRC}}/env/qa/env.js';
   break;
 default:
   env_path = '{{SRC}}/env/dev/env.js';
   break;
};
module.exports = {
  copyMobiscrollCss: {
    src: ['{{ROOT}}/src/lib/mobiscroll/css/mobiscroll.angular.min.css', '{{ROOT}}/src/lib/mobiscroll-package/dist/css/mobiscroll.angular/min.css'],
    dest: '{{WWW}}/lib/mobiscroll/css/'
  },
  copyEnvContent: {
    src: [env_path],
    dest: '{{WWW}}'
  }
}