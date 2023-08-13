const emailDiv = document.querySelector('#email');
const messagesDiv = document.querySelector('#messages');

let email;

const refreshMessages = async () => {
		const res = await fetch('/api/messages');
		const messages = await res.json();

		console.log(messages);
		localStorage.setItem('numOfMessages', messages.length)

		// if (messages.length > 0 && document.body.contains(document.getElementById("nomessages"))) {
		// 	document.getElementById("nomessages").remove();
		// }

		messagesDiv.innerHTML = '';

		for (let msg of messages) {
			const div = document.createElement('div');
			div.innerHTML = `<li class="list-group-item"><a href="#" onclick="getMessage('${msg.id}')">${msg.subject}</a></li>`;
	
			messagesDiv.appendChild(div);
		}

		if (messages.length === 0) {
			let nomessages = document.createElement('div')
			nomessages.innerHTML = `<li class="list-group-item" id="nomessages">No new messages</li>`

			messagesDiv.appendChild(nomessages);
		}


}

const generateEmail = async () => {
	emailDiv.setAttribute("value", "");
	emailDiv.setAttribute("placeholder", "Gererating email, please wait...");
	const res = await fetch('/api/generate');
	const data = await res.json();
	email = data.email;

	const res2 = await fetch('/api/token');
	const token = await res2.json();

	emailDiv.setAttribute("value", email)
	localStorage.setItem('token', token)
	localStorage.setItem('numOfMessages', 0)
	location.reload()
}

const loginWithToken = async () => {
	const res = await fetch(`/api/login/${localStorage.getItem("token")}`);
	const data = await res.json();

	emailDiv.setAttribute("value", data.data.address)
	refreshMessages();
}

if (localStorage.getItem("token")) {
	loginWithToken();
} else {
	generateEmail();
}
document.querySelector('#generate').addEventListener('click', async () => {
	generateEmail();
});

document.querySelector('#refresh').addEventListener('click', async () => {
	refreshMessages();
});

const getMessage = async (messageId) => {
	document.getElementById("messageTab").style.display = 'none';
	document.getElementById("messageViewer").style.display = 'block';
	const res = await fetch('/api/message/' + messageId);
	const data = await res.json();

	console.log(data)

	document.getElementById("emailTitle").textContent = data.subject;
	document.getElementById("senderName").textContent = data.from.name;
	document.getElementById("senderEmail").textContent = data.from.address;

	var iframe = document.getElementById("content");
	var frameDoc = iframe.document;
	if (iframe.contentWindow) {
		frameDoc = iframe.contentWindow.document;
	}

	frameDoc.open();
	frameDoc.writeln(data.html);
	frameDoc.close();
}

function back() {
	document.getElementById("messageTab").style.display = 'block';
	document.getElementById("messageViewer").style.display = 'none';
}

function copyEmail() {
	x = emailDiv.getAttribute("value");
	navigator.clipboard.writeText(x);

	alert("Email copied to clipboard!");
}

setInterval(async () => {
	refreshMessages();
}, 2500)