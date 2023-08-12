const emailDiv = document.querySelector('#email');
const messagesDiv = document.querySelector('#messages');

let email;

const refreshMessages = async () => {
	try {
		const res = await fetch('/api/messages');
		const messages = await res.json();

		console.log(messages);

		if (messages.length > 0) {
			document.getElementById("nomessages").remove();
		}

		for (let msg of messages) {
			const div = document.createElement('div');
			div.innerHTML = `<li class="list-group-item"><a href="#" onclick="getMessage('${msg.id}')">${msg.subject}</a></li>`;

			messagesDiv.appendChild(div);
		}
	} catch (err) {
		alert("An error occurred, please generate a new email address")
	}
}

const generateEmail = async () => {
	emailDiv.setAttribute("value", "");
	emailDiv.setAttribute("placeholder", "Gererating email, please wait...");
	const res = await fetch('/api/generate');
	const data = await res.json();
	email = data.email;
	emailDiv.setAttribute("value", email)
	localStorage.setItem('email', email)
	location.reload()
}

if (localStorage.getItem("email")) {
	// Display the email
	emailDiv.setAttribute("value", localStorage.getItem("email"))

	// Display the messages
	refreshMessages();
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

	navigator.clipboard.writeText(localStorage.getItem("email"));

	alert("Email copied to clipboard!");
}