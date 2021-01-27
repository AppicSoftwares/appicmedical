export class AppSettings {
	public static ENV = window['ENV'] || 'dev';

	public static dev = {
		liveurl2: 'https://l39qct0rh4.execute-api.us-west-2.amazonaws.com/beta/',
		liveurl: 'https://kstrdw6014.execute-api.us-east-1.amazonaws.com/beta/',
		API_ENDPOINT:
			'https://kstrdw6014.execute-api.us-east-1.amazonaws.com/beta/',
		ngrokurl: 'http://65952408.ngrok.io/',
		localurl: 'http://localhost:3000/',
		nodeserverurl: 'http://techbeeapi.xyz:3000/',
		userid: '5c9520fd11387c15b8b08ed4',
		usertype: 'patient',

		rxapiurl: 'https://qa.rxapi.net/1.1/',
		rxapi_uid: '8993E891-2913-4084-800C-8E4205C0EF2D',

		userxapi: 1,
        universalApi       : 'https://www.universal-tutorial.com/api/',
		membership: { free: 0, premium: 5 }
	};

	public static prod = {
		liveurl2: 'https://l39qct0rh4.execute-api.us-west-2.amazonaws.com/prod/',
		liveurl: 'https://kstrdw6014.execute-api.us-east-1.amazonaws.com/prod/',
		API_ENDPOINT:
			'https://kstrdw6014.execute-api.us-east-1.amazonaws.com/prod/',
		ngrokurl: 'http://65952408.ngrok.io/',
		localurl: 'http://localhost:3000/',
		nodeserverurl: 'http://techbeeapi.xyz:3000/',
		userid: '5c9520fd11387c15b8b08ed4',
		usertype: 'patient',

		rxapiurl: 'https://qa.rxapi.net/1.1/',
		rxapi_uid: '8993E891-2913-4084-800C-8E4205C0EF2D',
		userxapi: 1,
		universalApi       : 'https://www.universal-tutorial.com/api/',
		membership: { free: 0, premium: 5 }
	};

	public static qa = {
		liveurl2: 'https://l39qct0rh4.execute-api.us-west-2.amazonaws.com/qa/',
		liveurl: 'https://kstrdw6014.execute-api.us-east-1.amazonaws.com/qa/',
		API_ENDPOINT: 'https://kstrdw6014.execute-api.us-east-1.amazonaws.com/qa/',
		ngrokurl: 'http://65952408.ngrok.io/',
		localurl: 'http://localhost:3000/',
		nodeserverurl: 'http://techbeeapi.xyz:3000/',
		userid: '5c9520fd11387c15b8b08ed4',
		usertype: 'patient',

		rxapiurl: 'https://qa.rxapi.net/1.1/',
		rxapi_uid: '8993E891-2913-4084-800C-8E4205C0EF2D',
		userxapi: 1,
		universalApi       : 'https://www.universal-tutorial.com/api/',
		membership: { free: 0, premium: 5 }
	};

	public static liveurl2 = AppSettings[AppSettings.ENV].liveurl2;
	public static liveurl = AppSettings[AppSettings.ENV].liveurl;
	public static ngrokurl = AppSettings[AppSettings.ENV].ngrokurl;
	public static localurl = AppSettings[AppSettings.ENV].localurl;
	public static nodeserverurl = AppSettings[AppSettings.ENV].nodeserverurl;
	public static universalApi = AppSettings[AppSettings.ENV].universalApi;
	public static userid = AppSettings[AppSettings.ENV].userid;
	public static usertype = AppSettings[AppSettings.ENV].usertype;

	public static rxapiurl = AppSettings[AppSettings.ENV].rxapiurl;
	public static rxapi_uid = AppSettings[AppSettings.ENV].rxapi_uid;
	public static API_ENDPOINT = AppSettings[AppSettings.ENV].API_ENDPOINT;
	public static userxapi = AppSettings[AppSettings.ENV].userxapi;
	public static membership = AppSettings[AppSettings.ENV].membership;

	/*public resolveVars(env){
		   
			this.liveurl2 = this[env].liveurl2;
			this.liveurl = this[env].liveurl;
			this.ngrokurl = this[env].ngrokurl;
			this.localurl = this[env].localurl;
			this.nodeserverurl = this[env].nodeserverurl;
			this.userid = this[env].userid;
			this.usertype = this[env].usertype;
			this.rxapiurl = this[env].rxapiurl;
			this.rxapi_uid = this[env].rxapi_uid;
			this.API_ENDPOINT = this[env].API_ENDPOINT;
			this.userxapi = this[env].userxapi;
			this.membership = this[env].membership;
			
		 }*/
}
