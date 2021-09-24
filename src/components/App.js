import { List } from "immutable";
import React from "react";
import { getPotentialsCustomer } from '../api/getCustomers';
import { send } from '../api/email';
import { MDBDataTableV5 } from 'mdbreact';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      selectedCustomers: [],
      selectedTemplate: null
    }
    this.templates = {
      promotion: {
        subject: "Natwest cuts Mortgage rates for X-Mas season",
        text: `Dear,\nOne of the UK's leading bank announced on Friday that it is cutting the mortgage load rates for upcoming festival season.\n\n\nRegards,\nNatwest Team`
      },
      congrats: {
        subject: "Congratulations on Your Promotion",
        text: `Dear,\nCongratulations on your promotion. I heard about well deserved promotion through linkedin.\nWe would also like to share a few options with you to earn on your additional savings:\n
          Flexi account with 5% interest rate*\n
          Platinum account with loads of benefits like travel and mobile insurance*\n\n\nRegards,\nNatwest Team\n\n\n*T&C apply.
          `
      }
    }
  }

  componentDidMount() {
    getPotentialsCustomer().then(customers => {
      this.setState({ customers });
    }
    );
  }

  sendEmail = () => {
    const selectedTemplate = this.templates[this.state.selectedTemplate];
    if (selectedTemplate) {
      const subject = selectedTemplate.subject;
      const text = selectedTemplate.text;
      const to = this.state.selectedCustomers.length > 0 ? this.state.selectedCustomers.join(',') : this.state.customers.map(c => c.email).join(',');
      send({ subject, text, to });
      alert("Email sent successfully!")
    }
  }

  selectCustomer = customer => {
    const customers = this.state.selectedCustomers;
    const index = customers.indexOf(customer.email);
    if (index > -1) {
      customers.splice(index, 1)
    } else {
      customers.push(customer.email);
    }
    // this.setState({selectedCustomers: customers})
    this.state.selectedCustomers = customers;
    console.log(this.state.selectedCustomers)
  }

  selectTemplate = e => {
    //this.setState({selectedTemplate: e.target.id})
    this.state.selectedTemplate = e.target.id;
  }

  renderTable = () => {

    const rows = this.state.customers.map(customer => ({ name: customer.name, position: customer.title, location: customer.city, email: customer.email }));
    const data = {
      columns: [
        {
          label: "Customer Name",
          field: "name",
          sort: "asc",
          width: 150
        }, {
          label: "Position",
          field: "position",
          sort: "asc",
          width: 150
        }, {
          label: "Location",
          field: "location",
          sort: "asc",
          width: 150
        }], rows: rows
    };
    return (
      <div className="container">
        <div className="row">
          <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
              <img
                src="https://www.natwestgroup.com/content/dam/natwestgroup_com/natwestgroup/nwg-logo2x.png"
                width="20%"
                height="20%"
              />
              <h3 style={{ color: "#411663" }}>Social Media FinTech</h3>
            </div>
          </nav>
        </div>

        <div className="card mt-4">
          <div className="card-header">
            Customer Engagement
          </div>
          <div className="card-body">
            <h5 className="card-title">Select customers</h5>

            <MDBDataTableV5
              hover
              entriesOptions={[5, 20, 25]}
              entries={5}
              pagesAmount={4}
              data={data}
              checkbox={true}
              headCheckboxID='hId'
              bodyCheckboxID='bId'
              getValueCheckBox={this.selectCustomer}
              getValueAllCheckBoxes={this.selectCustomer}
              multipleCheckboxes
            />

            <div className="row d-flex justify-content-center">
              <div className="col-5" style={{ display: 'inline-flex' }}>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" style={{ 'borderColor': 'rebeccapurple' }} type="radio" name="radioInline" id="promotion" onChange={this.selectTemplate} />
                  <label className="form-check-label" htmlFor="promotion">Offers</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" style={{ 'borderColor': 'rebeccapurple' }} type="radio" name="radioInline" id="congrats" onChange={this.selectTemplate} />
                  <label className="form-check-label" htmlFor="congratulations">Congratulate</label>
                </div>
                <button type="button" className="btn btn-success" style={{ 'backgroundColor': 'rebeccapurple' }} onClick={this.sendEmail} >Send email</button>
              </div>
            </div>

          </div>
        </div>
        <hr />

      </div>)

  }

  render() {
    return (
      this.state.customers &&
        this.state.customers.length > 0 ?
        this.renderTable() :
        <div>Loading customers....</div>);
  }
}

export default App;