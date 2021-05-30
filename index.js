// require the discord.js module
const Discord = require('discord.js');

/*require the config.json file
const config = require('./config.json');*/

//ES6
//const { prefix, token } = require('./config.json');

// require axios
const axios = require('axios');


// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// variable du fichier config.json
const fs =require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));



// login to Discord with your app's token
client.login(config.token);



//Rendu zip du projet config + token avec dockerfile


/*
**Fonction qui remplace la valeur du préfix
**
**
*/


/*async function changePrefix(message, pref) {
	prefix = pref;
	await message.channel.send("Prefix changed to "+prefix);
}*/

/*
**Fonction qui retourne une blague aléatoire
**params: prends en paramètre un message
**post-conditions: retourne la blague aléatoire dans le message
*/
async function chuckNorrisRandomJoke(message) {
		chuck = await axios.get("http://api.icndb.com/jokes/random")
		.then(response => {
		if (response.data.type === "success") {
			message.channel.send(response.data.value.joke.split("&quot;"));
		}else {
			message.channel.send("Il y a eu une erreur");
		}
		})
		.catch(error => console.log(error));
		
		
}


/*
**Fonction qui compte le nombre de blagues de l'api Chuck Norris
**params: prends en paramètre un message
**post-conditions: retourne le nombre de blague dans le message
*/
async function chuckNorrisNombreDeBlagues(message) {
	nombre = await axios.get("http://api.icndb.com/jokes/count")
	.then(response => {
		if (response.data.type === "success") {
			message.channel.send(response.data.value);
		}else {
			message.channel.send("Il y a eu une erreur");
		}
	})
	.catch(error => console.log(error));	
}



/*
**Fonction qui retourne une blague aléatoire de la catégorie saisie par l'utilisateur
**params: prends en paramètre un message
**post-conditions: retourne la blague dans le message
*/
async function chuckNorrisCategorie(message,cat) {
	nombre = await axios.get("http://api.icndb.com/jokes/random?limitTo="+cat)
	.then(response => {
		if (response.data.type === "success") {
			message.channel.send(response.data.value.joke);
		}else {
			message.channel.send("Cette catégorie n'existe pas");
		}
	})
	.catch(error => console.log(error));	
	
}	

/*
**Fonction qui retourne les catégories disponibles dans l'api
**params: prends en paramètre un message
**post-conditions: retourne les catégories dans le message
*/
async function chuckNorrisCategories(message) {
	nombre = await axios.get("http://api.icndb.com/categories")
	.then(response => {
		if (response.data.type === "success") {
			message.channel.send(response.data.value);
		}else {
			message.channel.send("Il y a eu une erreur");
		}
	})
	.catch(error => console.log(error));	
	
}	

/*
**Fonction qui retourne une blague aléatoire de la catégorie saisie par l'utilisateur
**params: prends en paramètre un message
**post-conditions: retourne la blague dans le message
*/
async function chuckNorrisJokeId(message,id) {
	nombre = await axios.get("http://api.icndb.com/jokes/"+id)
	.then(response => {
		if (response.data.type === "success") {
			message.channel.send(response.data.value.joke);
		}else {
			message.channel.send("Il y a eu une erreur");
		}
	})
	.catch(error => console.log(error));	
	
}	




//Listening for message
client.on('message', message => {

	var config = JSON.parse(fs.readFileSync('./config.json'));


	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	//console.log(message.content);
	if (message.content === config.prefix+'ping') {
		// send back "Pong." to the channel the message was sent in
		const latency = Date.now() - message.createdTimestamp;
		message.channel.send('Pong.\n Latence: '+latency+' ms');

	/*Si l'utilisateur saisi %joke*/
	} else if (command === 'joke'){
		/*Si il n'y a pas d'arguments*/
		if(!args.length){
			chuckNorrisRandomJoke(message);
		}else{
			/* S'il y a un id */
			if(parseInt(args)){
				chuckNorrisJokeId(message,args[0]);
			/*Sinon s'il y a une [catégorie]*/
			}else{
				chuckNorrisCategorie(message,args[0]);
			}	
		}
		
		
	/*Si l'utilisateur saisi %jokeCount*/
	}else if (message.content === config.prefix+'jokeCount') {
		chuckNorrisNombreDeBlagues(message);
	
	/* Si l'utilisateur saisi %jokeCategories */
	}else if (message.content === config.prefix+'jokeCategories') {

		chuckNorrisCategories(message);

	}else if (command === 'prefix') {
		
		
		let jsonData = require('./config.json');
			
		var res = JSON.stringify(jsonData, function remplace(cle, valeur) {
			if (cle === "prefix") {
			  return args[0];
			}
			return valeur;
		});

		fs.writeFileSync("config.json",res);
		

		message.channel.send("Prefix changed to"+args[0]);
		
	}
	
	
	
	
});


