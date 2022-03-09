import React, { useEffect, useState } from "react";
import "./Groups.css";
import checkPage from "./CheckPage";

import 'bootstrap/dist/css/bootstrap.min.css';

import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { query, collection, getDocs, where, doc, updateDoc, arrayUnion, arrayRemove, addDoc } from "firebase/firestore";

import Navbar from "./components/navbar"


// Modal/popup when first "Create a group" button is clicked
function createGroupPopup() {
    const modal = document.getElementById("creategroup-popup");
    const span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
}

// Modal/popup when "Join a group" button is clicked
function joinGroupPopup() {
    const modal = document.getElementById("joingroup-popup");
    const span = document.getElementsByClassName("close1")[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
}

// Modal/popup when "Leave a group" button is clicked
function leaveGroupPopup() {
    const modal = document.getElementById("leavegroup-popup");
    const span = document.getElementsByClassName("close2")[0];
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

        // note: await in query is ineffective..
        if (groupId.value != "" && groupName.value != "") {
            showLoader(true, "load");
            const auth = getAuth();
            const user = auth.currentUser;
            const currentUserQuery = await query(collection(db, "users"), where("uid", "==", user?.uid));
            const getUserDoc = await getDocs(currentUserQuery);
            const userDocId = getUserDoc.docs[0].id;

            // check if gid is already in use
            const groupQuery = await query(collection(db, "groups"), where("gid", "==", groupId.value));
            const groupSnapshot = await getDocs(groupQuery);
            if (groupSnapshot.docs.length > 0) {
                alert("Group ID already exists. Please use another ID.");
            }
            else {
                try {
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

                    alert("You've created the group \"" + groupName.value + "\" with group ID: " + groupId.value);
                    const thisGroupQuery = await query(collection(db, "groups"), where("gid", "==", groupId.value));
                    const thisGroupDoc = await getDocs(thisGroupQuery);
                    addGroupCard(thisGroupDoc.docs[0].data());
                    
                    groupName.value = "";
                    groupId.value = "";

                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            }
            showLoader(false, "load");
        }
        else {
            alert("Please put a valid group name/id");
        }
    };
    createGroup();
}

// Join a group in a database
function callJoinGroup() {
    const joinGroup = async() => {
        const groupId = document.getElementById("joingroupid");
        // note: await in query is ineffective..
        if (groupId) {
            showLoader(true, "load1");
            const auth = getAuth();
            const user = auth.currentUser;
            const currentUserQuery = await query(collection(db, "users"), where("uid", "==", user?.uid));
            const getUserDoc = await getDocs(currentUserQuery);
            const userDocId = getUserDoc.docs[0].id;

            // check if gid is a valid id
            const groupQuery = await query(collection(db, "groups"), where("gid", "==", groupId.value));
            const groupSnapshot = await getDocs(groupQuery);
            if (groupSnapshot.docs.length === 0) {
                alert("Group ID does not exist.");
            }
            else {
                try {
                    // check if user is already in the group
                    const userGroups = getUserDoc.docs[0].data().groups;
                    if (userGroups.includes(groupId.value)) {
                        alert("You are already in this group.");
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

                            alert("You've joined the group \"" + groupSnapshot.docs[0].data().name + "\"!");
                            addGroupCard(groupSnapshot.docs[0].data());
                        } catch (err) {
                            console.error(err);
                            alert(err.message);
                        }
                    }
                    groupId.value = "";
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            }
            showLoader(false, "load1");
        }
    };
    joinGroup();
}

// Leave a group
// TODO: have a leave group button for each group card (instead of having to put gid)
// TODO: have a loading symbol to indicate in the process of leaving
function callLeaveGroup() {
    const leaveGroup = async() => {
        const groupId = document.getElementById("leavegroupid");
        if (groupId.value != "") {
            showLoader(true, "load2");
            const auth = getAuth();
            const user = auth.currentUser;
            const currentUserQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
            const getUserDoc = await getDocs(currentUserQuery);
            const userDocId = getUserDoc.docs[0].id;
            const userData = getUserDoc.docs[0].data();

            // check if gid is in user's group\
            const groupQuery = query(collection(db, "groups"), where("gid", "==", groupId.value));
            const groupSnapshot = await getDocs(groupQuery);
            if (!userData.groups.includes(groupId.value)) {
                alert("Group ID does not exist.");
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

                    alert("You've left the group \"" + groupSnapshot.docs[0].data().name + "\"");
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
                groupId.value = "";
            }
            showLoader(false, "load2");
        }
    };
    leaveGroup();
}

// These were put when a request button was clicked, but after response is returned
// the popups became unresponsive.
// function addLoader() {
//     var content = document.getElementById("groups");
//     content.innerHTML = `
//     <div class="loader" id="load"></div>
//     `;
// }
// function removeLoader() {
//     var loader = document.getElementById("load");
//     loader.remove();
// }
function showLoader(show, id) {
    const loader = document.getElementById(id);
    if (show) {
        loader.style.display = "block";
    }
    else{
        loader.style.display = "none";
    }
}

// Create card for each group user is in
function addGroupCard(group) {
    var flexbox = document.getElementById("flexbox");
    flexbox.innerHTML += `
    <div class="col-lg-4 mb-3">
        <div class="groupTextContainer">
            <div class="groupText">
            <h3>Group Name: ${group.name}</h3>
            <div>GID: ${group.gid}</div>
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

    // TODO: add loading icon while this runs so user knows it's loading
    setTimeout(() => {fetchGroupData();}, 500);

    return (
        <center>
        <Navbar />
        <div className="groups" id="groups">
            <div className="groupTitle">My Friend Groups</div>
            <br />
            <div className="user-info">
                <text>
                    You are part of {groups.length} friend groups <br />
                </text>
            </div>
            <br />
            <button class="btn btn-outline-primary btn-sm" id="createGroupPopupBtn" onClick={window.onload = function(){createGroupPopup()}}> Create a group </button>
            <div id="creategroup-popup" class="creategroup">
                <div class="creategroup-content">
                    <span class="close">&times;</span>
                    <div>Group Name: {'\n'}
                        <input type="text" id="groupname"></input>
                    </div>
                    <div>Group ID: {'\n'}
                        <input type="text" id="groupid"></input>
                    </div>
                    <br/>
                    <button class="btn btn-outline-primary btn-sm" onClick={window.onload = function(){callCreateGroup()}}>Confirm Group</button>
                    <div class="loader" id="load"></div>
                </div>
            </div>
            <br />
            <button class="btn btn-outline-primary btn-sm" id="joinGroupBtn" onClick={window.onload = function(){joinGroupPopup()}}> Join a group </button>
            <div id="joingroup-popup" class="joingroup">
                <div class="joingroup-content">
                    <span class="close1">&times;</span>
                    <div>Group ID: {'\n'}
                        <input type="text" id="joingroupid"></input>
                    </div>
                    <br/>
                    <button class="btn btn-outline-primary btn-sm" onClick={window.onload = function(){callJoinGroup()}}>Join</button>
                    <div class="loader" id="load1"></div>
                </div>
            </div>
            <br />
            <button class="btn btn-outline-primary btn-sm" id="leavegroupbtn" onClick={window.onload = function(){leaveGroupPopup()}}>Leave a group</button>
            <div id="leavegroup-popup" class="leavegroup">
                <div id="leavegroup-content" class="leavegroup-content">
                    <span class="close2">&times;</span>
                    <div>Group ID: {'\n'}
                        <input type="text" id="leavegroupid" placeholder="ID of group to leave"></input>
                    </div>
                    <br/>
                    <button class="btn btn-outline-primary btn-sm" onClick={window.onload = function(){callLeaveGroup()}}>Leave group</button>
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