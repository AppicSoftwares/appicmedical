
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

// --- SNIP ---
module.exports = {
  copyEnvContent: {
    src: [env_path],
    dest: '{{WWW}}'
  }
}
// --- SNIP ---