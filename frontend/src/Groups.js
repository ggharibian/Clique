import React, { useEffect, useState } from "react";
import "./Groups.css";
import checkPage from "./CheckPage";

import 'bootstrap/dist/css/bootstrap.min.css';

import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { query, collection, getDocs, where, doc, updateDoc, arrayUnion, arrayRemove, addDoc } from "firebase/firestore";

import Navbar from "./components/navbar"

// Tell user to wait
function havePatience(show, loadId, divID) {
    const loader = document.getElementById(loadId);
    const messageDiv = document.getElementById(divID);
    if (show) {
        loader.style.display = "block";
        messageDiv.className = "pleasewait";
        messageDiv.textContent = "Please wait. This may take a while...";
    }
    else{
        loader.style.display = "none";
    }
}

// Output message to user depending on result
function resultMessage(divID, success, message){
    const messageDiv = document.getElementById(divID);
    if (success) {
        messageDiv.className = "confirmText";
    }
    else {
        messageDiv.className = "failText";
    }
    messageDiv.textContent = message;

    setTimeout(() => {messageDiv.textContent = "";}, 5000);
}

// Modal/popup
function groupPopup(id, close) {
    const modal = document.getElementById(id);
    const span = document.getElementsByClassName(close)[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
}

// Add the created group to database
function callCreateGroup() {
    const createGroup = async() => {
        const groupName = document.getElementById("groupname");
        const groupId = document.getElementById("groupid");

        if (groupId.value != "" && groupName.value != "") {
            havePatience(true, "load", "createGroupResult");
            const auth = getAuth();
            const user = auth.currentUser;
            const currentUserQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
            const getUserDoc = await getDocs(currentUserQuery);
            const userDocId = getUserDoc.docs[0].id;

            // check if gid is already in use
            const groupQuery = query(collection(db, "groups"), where("gid", "==", groupId.value));
            const groupSnapshot = await getDocs(groupQuery);
            if (groupSnapshot.docs.length > 0) {
                resultMessage("createGroupResult", false, "Clique ID already exists. Please use another ID.");
            }
            else {
                try {
                    const messageDiv = document.getElementById("createGroupResult");
                    messageDiv.textContent = "Please wait. This may take a while...";
                    // add group id to user's group list
                    const userDoc = doc(db, "users", userDocId);
                    await updateDoc(userDoc, {
                        groups: arrayUnion(groupId.value)
                    });
    
                    // create group in database, add user to list of members
                    await addDoc(collection(db, "groups"), {
                        AvgHangoutTimePerWeek: 0,
                        Events: [],
                        TotalHoursSpentHangingOut: 0,
                        gid: groupId.value,
                        name: groupName.value,
                        people: arrayUnion(user.uid)
                    });

                    const thisGroupQuery = query(collection(db, "groups"), where("gid", "==", groupId.value));
                    const thisGroupDoc = await getDocs(thisGroupQuery);
                    addGroupCard(thisGroupDoc.docs[0].data());
                    resultMessage("createGroupResult", true, 
                    "You've created the Clique \"" + groupName.value + "\" with Clique ID: " + groupId.value + "\"!");
                    
                    groupName.value = "";
                    groupId.value = "";

                } catch (err) {
                    console.error(err);
                }
            }
            havePatience(false, "load");
        }
        else {
            resultMessage("createGroupResult", false, "Please put a valid Clique name/id.");
        }
    };
    createGroup();
}

// Join a group in a database
function callJoinGroup() {
    const joinGroup = async() => {
        const groupId = document.getElementById("joingroupid");
        
        if (groupId.value!="") {
            havePatience(true, "load1","joinGroupResult");
            const auth = getAuth();
            const user = auth.currentUser;
            const currentUserQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
            const getUserDoc = await getDocs(currentUserQuery);
            const userDocId = getUserDoc.docs[0].id;

            // check if gid is a valid id
            const groupQuery = query(collection(db, "groups"), where("gid", "==", groupId.value));
            const groupSnapshot = await getDocs(groupQuery);
            if (groupSnapshot.docs.length === 0) {
                resultMessage("joinGroupResult", false, "Group ID does not exist.");
            }
            else {
                try {
                    // check if user is already in the group
                    const userGroups = getUserDoc.docs[0].data().groups;
                    if (userGroups.includes(groupId.value)) {
                        resultMessage("joinGroupResult", false, "You are already in this Clique.");
                    }
                    // if not in group, proceed to add
                    else {
                        try {
                            // add user to list of members in the group doc
                            const groupDocId = groupSnapshot.docs[0].id;
                            const groupDoc = doc(db, "groups", groupDocId);
                            await updateDoc(groupDoc, {
                                people: arrayUnion(user.uid)
                            });

                            // add group id to user's group list
                            const userDoc = doc(db, "users", userDocId);
                            await updateDoc(userDoc, {
                                groups: arrayUnion(groupId.value)
                            });

                            resultMessage("joinGroupResult", true, 
                            "You've joined the Clique \"" + groupSnapshot.docs[0].data().name 
                            + "\"!");
                            addGroupCard(groupSnapshot.docs[0].data());
                        } catch (err) {
                            console.error(err);
                        }
                    }
                    groupId.value = "";
                } catch (err) {
                    console.error(err);
                }
            }
            havePatience(false, "load1");
        }
        else {
            resultMessage("joinGroupResult", false, "Please enter a Clique ID.");
        }
    };
    joinGroup();
}

// Leave a group
// TODO: have a leave group button for each group card (instead of having to put gid)
function callLeaveGroup() {
    const leaveGroup = async() => {
        const groupId = document.getElementById("leavegroupid");
        if (groupId.value != "") {
            havePatience(true, "load2", "leaveGroupResult");
            const auth = getAuth();
            const user = auth.currentUser;
            const currentUserQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
            const getUserDoc = await getDocs(currentUserQuery);
            const userDocId = getUserDoc.docs[0].id;
            const userData = getUserDoc.docs[0].data();

            // check if gid is in user's group
            const groupQuery = query(collection(db, "groups"), where("gid", "==", groupId.value));
            const groupSnapshot = await getDocs(groupQuery);
            if (!userData.groups.includes(groupId.value)) {
                resultMessage("leaveGroupResult", false, "Group ID does not exist.");
            }
            else {
                try {
                    // remove user from list of members in the group doc
                    const groupDocId = groupSnapshot.docs[0].id;
                    const groupDoc = doc(db, "groups", groupDocId);
                    await updateDoc(groupDoc, {
                        people: arrayRemove(user.uid)
                    });

                    // remove group id from user's group list
                    const userDoc = doc(db, "users", userDocId);
                    await updateDoc(userDoc, {
                        groups: arrayRemove(groupId.value)
                    });

                    resultMessage("leaveGroupResult", true, 
                    "You've left the Clique \"" + groupSnapshot.docs[0].data().name + "\"!");
                } catch (err) {
                    console.error(err);
                }
                groupId.value = "";
            }
            havePatience(false, "load2");
        }
    };
    leaveGroup();
}

// Create card for each group user is in
function addGroupCard(group) {
    var flexbox = document.getElementById("flexbox");
    flexbox.innerHTML += `
    <div class="col-lg-4 mb-3">
        <div class="groupTextContainer">
            <div class="groupText">
            <h3>Clique Name: ${group.name}</h3>
            <div>Clique ID: ${group.gid}</div>
            <p>there are ${group.people.length} people in this friend group and ${group.Events.length} upcoming events with them</p>
            <a href="../calendar" class="btn btn-outline-primary btn-sm">
            see events for ${group.name}
            </a>
            </div>
        </div>
    </div>
    `;
}

function Groups() {
    const [groups, setGroups] = useState([]);
    const [user, loading] = useAuthState(auth);
    const fetchGroupData = async () => {
      try {
        // retrieve documents (groups) that contain user in the people array (user is in group)
        const userGroupsQuery = query(collection(db, "groups"), where("people", "array-contains", user?.uid));
        const userGroups = await getDocs(userGroupsQuery);
        setGroups(userGroups.docs);
        
        var groupContainer = document.getElementById("flexbox");
        const cards = groupContainer.childElementCount;
        if(groups.length != 0 && groups.length > cards) {
            userGroups.docs.map(doc => 
                {addGroupCard(doc.data())}
            )
        }

    } catch (err) {
        console.error(err);
      }
    };
    useEffect(() => {
        if (loading) return;
        fetchGroupData();
    }, [user, loading])

    setTimeout(() => {fetchGroupData();}, 500);

    return (
        <center>
        <Navbar />
        <div className="groups" id="groups">
            <div className="groupTitle">My Cliques</div>
            <br />
            <div className="user-info">
                <text>
                    You are part of {groups.length} Cliques <br />
                </text>
            </div>
            <br />
            <button class="btn btn-outline-primary btn-sm" id="createGroupPopupBtn" onClick={window.onload = function(){groupPopup("creategroup-popup", "close")}}> Create a Clique </button>
            <div id="creategroup-popup" class="creategroup">
                <div class="creategroup-content">
                    <span class="close">&times;</span>
                    <div>Clique Name: {'\n'}
                        <input type="text" id="groupname"></input>
                    </div>
                    <div>Clique ID: {'\n'}
                        <input type="text" id="groupid" placeholder="Clique IDs are case-sensitive"></input>
                    </div>
                    <br/>
                    <button class="btn btn-outline-primary btn-sm" onClick={window.onload = function(){callCreateGroup()}}>Confirm Clique</button>
                    <br/>
                    <div id="createGroupResult"></div>
                    <div class="loader" id="load"></div>
                </div>
            </div>
            <br />
            <button class="btn btn-outline-primary btn-sm" id="joinGroupBtn" onClick={window.onload = function(){groupPopup("joingroup-popup", "close1")}}> Join a Clique </button>
            <div id="joingroup-popup" class="joingroup">
                <div class="joingroup-content">
                    <span class="close1">&times;</span>
                    <div>Clique ID: {'\n'}
                        <input type="text" id="joingroupid"></input>
                    </div>
                    <br/>
                    <button class="btn btn-outline-primary btn-sm" onClick={window.onload = function(){callJoinGroup()}}>Join Clique</button>
                    <br/>
                    <div id="joinGroupResult"></div>
                    <div class="loader" id="load1"></div>
                </div>
            </div>
            <br />
            <button class="btn btn-outline-primary btn-sm" id="leavegroupbtn" onClick={window.onload = function(){groupPopup("leavegroup-popup", "close2")}}>Leave a Clique</button>
            <div id="leavegroup-popup" class="leavegroup">
                <div id="leavegroup-content" class="leavegroup-content">
                    <span class="close2">&times;</span>
                    <div>Clique ID: {'\n'}
                        <input type="text" id="leavegroupid" placeholder="Clique ID of clique to leave"></input>
                    </div>
                    <br/>
                    <button class="btn btn-outline-primary btn-sm" onClick={window.onload = function(){callLeaveGroup()}}>Leave Clique</button>
                    <br/>
                    <div id="leaveGroupResult"></div>
                    <div class="loader" id="load2"></div>
                </div>
            </div>
            <br />
            <div class="groupContainer" id="groupContainer">
                <div class="row" id="flexbox">
                </div>
            </div>
        </div>
        </center>
    );
}

export default Groups;