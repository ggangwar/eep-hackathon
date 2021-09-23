import axios from 'axios';

export const send = (email) => {
    axios.post("http://localhost:8080/email/", email)
    .then(response => console.log("mail sent", response));
}