import React, {useEffect} from "react";
import "./Groups.css";
import checkPage from "./CheckPage";

import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Navbar from "./components/navbar"

function Groups() {
    useEffect(() => {    
        checkPage();
      }, [checkPage]);

    return (
        <center>
        <Navbar />
        <div className="groups">
            <div className="title">My Friend Groups</div>
            <br />

            <div className="user-info">
                {/* ADD IN OTHER USER INFO HERE BELOW : PLACEHOLDER TEXT */}
                <text>
                    *** placeholder text *** <br />
                    Part of # friend groups <br />
                    will have a card for every group
                </text>
            </div>
            <br />
            <div class="groupContainer">
                <div class="row">
                    <div class="col-lg-4 mb-3">
                        <Card classname="card" display="flex">
                            <img class="card-img-top" src="" alt=""/>
                            <div class="groupText">
                                <h3>Group Name 1</h3>
                                <p>there are # people in this friend group and # upcoming events with them</p>
                                <a href="../groupname-1" class="btn btn-outline-primary btn-sm">
                                    see groupname-1
                                </a>
                            </div>
                        </Card>
                    </div>
                    <div class="col-lg-4 mb-3">
                        <div class="card" display="flex">
                            <img class="card-img-top" src="" alt=""/>
                            <div class="groupText">
                            <h3>Group Name 2</h3>
                                <p>there are # people in this friend group and # upcoming events with them</p>
                                <a href="../groupname-2" class="btn btn-outline-primary btn-sm">
                                    see groupname-2
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-3">
                        <div class="card" display="flex">
                            <img class="card-img-top" src="" alt=""/>
                            <div class="groupText">
                            <h3>Group Name 3</h3>
                                <p>there are # people in this friend group and # upcoming events with them</p>
                                <a href="../groupname-3" class="btn btn-outline-primary btn-sm">
                                    see groupname-3
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-4 mb-3">
                        <Card classname="card" display="flex">
                            <img class="card-img-top" src="" alt=""/>
                            <div class="groupText">
                                <h3>Group Name 4</h3>
                                <p>there are # people in this friend group and # upcoming events with them</p>
                                <a href="../groupname-4" class="btn btn-outline-primary btn-sm">
                                    see groupname-4
                                </a>
                            </div>
                        </Card>
                    </div>
                    <div class="col-lg-4 mb-3">
                        <div class="card" display="flex">
                            <img class="card-img-top" src="" alt=""/>
                            <div class="groupText">
                            <h3>Group Name 5</h3>
                                <p>there are # people in this friend group and # upcoming events with them</p>
                                <a href="../groupname-5" class="btn btn-outline-primary btn-sm">
                                    see groupname-5
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-3">
                        <div class="card" display="flex">
                            <img class="card-img-top" src="" alt=""/>
                            <div class="groupText">
                            <h3>Group Name 6</h3>
                                <p>there are # people in this friend group and # upcoming events with them</p>
                                <a href="../groupname-6" class="btn btn-outline-primary btn-sm">
                                    see groupname-6
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </center>
    );
}

export default Groups;