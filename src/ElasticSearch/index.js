import React from 'react';
import './index.css';

import ReactTable from 'react-table';
import 'react-table/react-table.css';


import HttpServices from './Service'

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.handleChange(e);
    }

    onSearch(e) {
        e.preventDefault();
        this.props.onSearch();
    }

    render() {
        const time = this.props.time;
        const className = this.props.className;
        return (
            <form onSubmit={this.onSearch} className="search-bar">
                <input text="" placeholder="time" name="time" value={time}
                    onChange={this.handleChange} />
                <input text="" placeholder="class name" name="className" value={className}
                    onChange={this.handleChange} />
                <button type="submit" className="btn-primary">Search</button>
            </form>
        );
    }
}

class DataTable extends React.Component {
    render() {

        const columns = [{
            Header: 'Log Type',
            accessor: 'logType' // String-based value accessors!
        }, {
            Header: 'Time Stamp',
            accessor: 'timeStamp',
        }, {
            Header: 'Description',
            accessor: 'description',
        }, {
            Header: 'Time In MilliSeconds',
            accessor: 'timeInMilliSeconds',
        }];

        return (
            <div id={this.props.name}>
                <h1>{this.props.name}</h1>
                <ReactTable
                    data={this.props.data}
                    columns={columns}
                    resolveData={data => data.map(row => row)} // But you can break immutability here because `resolveData` runs when the `data` prop changes!
                    defaultPageSize={5}
                    showPagination={false}
                />
            </div>
        );
    }
}

class ElasticSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: '',
            className: '',
            maxLog: [],
            minLog: []

        };

        this.onSearch = this.onSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    componentDidMount() {
        this.httpServices = new HttpServices();
    }

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    onSearch(e) {
        if (this.state.time.trim().length > 0 && this.state.className.trim().length > 0) {
            this.updateResults();
        }
        else {
            alert("Please enter valid classname and time.");
        }

    }

    updateResults() {
        const criteria = {
            time: this.state.time,
            className: this.state.className
        }
        this.httpServices.search(criteria).then(result => {
            this.setState({
                maxLog: result.max,
                minLog: result.min,
            })
        });
    }
    render() {
        return (
            <fieldset>
                <legend>Elastic Search:</legend>
                <SearchBar onSearch={this.onSearch} time={this.state.time} className={this.state.className}
                    handleChange={this.handleChange} />
                <div className="row">
                    <div className="column"><DataTable data={this.state.maxLog} name="Max" /></div>
                    <div className="column"><DataTable data={this.state.minLog} name="Min   " /></div>
                </div>
            </fieldset>
        );
    }
}

export default ElasticSearch;

