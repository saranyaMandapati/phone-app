import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import './App.css';

class App extends Component {
  state = {
    phoneData: null,
    selectedCustNum: null
  };
  componentDidMount() {
    fetch('http://localhost:8080', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ phoneData: data.customers });
      });
  }
  getCustomerPhoneNumbers = event => {
    const id = event.target.value;
    event.persist();
    this.setState(prevState => {
      if (event.target.value !== 'select') {
        const selectedCust = prevState.phoneData.find(item => item.id == id);
        return { selectedCustNum: selectedCust };
      } else {
        return { selectedCustNum: null };
      }
    });
  };

  activateNumber = (evt, id, mid) => {
    const phoneData = { id: id, mid: mid };
    const config = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(phoneData)
    };
    fetch('http://localhost:8080/activate', config)
      // fetch('/searchapi.json')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ phoneData: data.customers, selectedCustNum: null });
      });
  };

  render() {
    const columns = [
      {
        name: 'id',
        label: 'Id'
      },
      {
        name: 'name',
        label: 'Name'
      },
      {
        name: 'phoneNumbers',
        label: 'PhoneNumbers',
        options: {
          customBodyRender: (value, tableMeta, updateValue) =>
            value &&
            value.map((x, i) => {
              return !x.isActivated ? (
                <span key={i} style={{ color: 'red' }}>
                  {"'" + x.phone + "'\xa0\xa0"}
                </span>
              ) : (
                <span key={i}>{"'" + x.phone + "'\xa0\xa0"}</span>
              );
            })
        }
      }
    ];
    const { phoneData, selectedCustNum } = this.state;
    const options = {
      filter: false,
      print: false,
      download: false,
      viewColumns: false
    };
    let data;
    if (phoneData) {
      data = phoneData.map(x => {
        return {
          id: x.id,
          name: x.name,
          phoneNumbers: x.phoneNumbers
        };
      });
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1>Phone Numbers App</h1>
          <p style={{ color: 'red', fontSize: '12px' }}>
            *Non-activated numbers are displayed in red
          </p>
          {phoneData ? (
            <>
              <span className="phone-retreive">
                Retreive Customer PhoneNumber
              </span>
              <select
                id="phone-select-label"
                onChange={evt => {
                  this.getCustomerPhoneNumbers(evt);
                }}
                value="select"
              >
                <option key="none" value={'select'}>
                  Select
                </option>
                {data.map(customer => {
                  return (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  );
                })}
              </select>
              {selectedCustNum && (
                <ul>
                  {selectedCustNum.phoneNumbers.map(x => {
                    return x.isActivated ? (
                      <li key={x.mid}>{x.phone}</li>
                    ) : (
                      <li key={x.mid} style={{ color: 'red' }}>
                        {x.phone}
                        <button
                          style={{ marginLeft: '7px' }}
                          onClick={evt =>
                            this.activateNumber(evt, selectedCustNum.id, x.mid)
                          }
                        >
                          Activate
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <MUIDataTable data={data} columns={columns} options={options} />
            </>
          ) : null}
        </header>
      </div>
    );
  }
}

export default App;
