import React from "react";
import "./Friends.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

function Friends() {
    return (
        <center>
        <div className="friends">
        
            <div className="text">
                Sample of the table that will be produced
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Advit</td>
                    <td>Deepak</td>
                    <td>advit@clique.com</td>
                    <td>UCLA</td>
                    </tr>
                    <tr>
                    <td>Anna</td>
                    <td>Tong</td>
                    <td>anna@clique.com</td>
                    <td>UCLA-1</td>
                    </tr>
                    <tr>
                    <td>Garni</td>
                    <td>Gharibian</td>
                    <td>garni@clique.com</td>
                    <td>UCLA-2</td>
                    </tr>
                    <tr>
                    <td>Selina</td>
                    <td>Huynh</td>
                    <td>seliina@clique.com</td>
                    <td>UCLA-3</td>
                    </tr>
                    <tr>
                    <td>Stephanie</td>
                    <td>Wei</td>
                    <td>stephanie@clique.com</td>
                    <td>UCLA-4</td>
                    </tr>
                </tbody>
            </Table>
        </div>
        </center>
    );
}

export default Friends;