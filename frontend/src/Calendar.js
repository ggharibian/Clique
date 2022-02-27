import React from "react";
import "./Calendar.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

function Calendar() {
    return (
        <div className="calendar">
        
        <div className="text">
            Sample of the table that will be produced
        </div>

        <Table striped bordered hover>
            <thead>
                <tr>
                <th>Group</th>
                <th>Date</th>
                <th>Time</th>
                <th>Address</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>Group-3</td>
                <td>February 28</td>
                <td>2pm</td>
                <td>UCLA The Study at Hedrick</td>
                </tr>
                <tr>
                <td>Group-2</td>
                <td>March 2</td>
                <td>1pm</td>
                <td>Hammer Museum</td>
                </tr>
                <tr>
                <td>Group-4</td>
                <td>March 5</td>
                <td>8am</td>
                <td>Pauley Pavilion</td>
                </tr>
                <tr>
                <td>Group-1</td>
                <td>March 13</td>
                <td>8pm</td>
                <td>Powell Library</td>
                </tr>
            </tbody>
            </Table>
        </div>
    );
}

export default Calendar;