import {List} from 'immutable';
import axios from 'axios';

export const getPotentialsCustomer = () => {
    let customers;
    return axios.get("http://localhost:8080/customers/", {
        headers: {
            'Content-Type': 'application/json'
        }
       })
    .then( response => {
    console.log("Customers: ", response) 
    //customers = new List(response.data);
    return response.data;
});
}