
import React, { useEffect, useState } from "react"
import "./Friends.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { query, collection, getDocs, where, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Navbar from "./components/navbar"

// Loading UI while data is retrieved
function havePatience(show, loadId, divID) {
    const loader = document.getElementById(loadId);
    const messageDiv = document.getElementById(divID);
    if (show) {
        loader.style.display = "block";
        messageDiv.className = "pleasewait";
        messageDiv.textContent = "Searching...";
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

function friendPopup(id,close) {
    const modal = document.getElementById(id);
    const span = document.getElementsByClassName(close)[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
}
function searchFriend() {
    const input = document.getElementById("searchFriendInput");
    if (input){
        const searchFriendEmail = async() => {
            havePatience(true, "load", "addFriendResult");
            const auth = getAuth();
            const user = auth.currentUser;
            const filter = input.value.toLowerCase();
            const currentUserQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
            const getUserDoc = await getDocs(currentUserQuery);
            try {
                const q = query(collection(db, "users"), where("email".toLowerCase(), "==", filter));
                const querySnapshot = await getDocs(q);
                const userData = getUserDoc.docs[0].data();
                try {
                    const friendToAdd = querySnapshot.docs[0].data();
                    if (user.uid === friendToAdd.uid) {
                        resultMessage("addFriendResult", false, "Cannot add yourself as a friend!\nHave you got no friends? :(");
                    }
                    else if (userData.friends.includes(friendToAdd.uid)) {
                        resultMessage("addFriendResult", false, friendToAdd.name + " is already in your friends list.");
                    }
                    else {
                        // TODO: Add another interface instead of windows.confirm
                        if (window.confirm("Add " + friendToAdd.name + " as a friend?")) {
                            const userDocId = getUserDoc.docs[0].id;
                            addFriendToList(friendToAdd.uid, userDocId);
                            resultMessage("addFriendResult", true, "Successfully added " + friendToAdd.name + " as a friend!");
                            
                            const queryFriend = query(collection(db, "users"), where("uid", "==", friendToAdd.uid));
                            const friendDoc = await getDocs(queryFriend);
                            const friendData = friendDoc.docs[0].data();
                            addToTable(friendData);
                        }
                    }
                }
                catch (err) {
                    resultMessage("addFriendResult", false, "Failed to search for user with email " + input.value + ".");
                }
                
            } catch (err) {
                console.error(err);
            }
            input.value = "";
            havePatience(false, "load");
        };
        searchFriendEmail();
    } 
}

const addFriendToList = async(uid, userDocId) => {
    try {
        const userDoc = doc(db, "users", userDocId);
        await updateDoc(userDoc, {
            friends: arrayUnion(uid)
        });
    } catch (err) {
        console.error(err);
    }
}

// TODO: have a remove friend button for each friend row (instead of having to put email)
function callDeleteFriend() {
    const input = document.getElementById("removeFriendInput");
    const deleteFriend = async() => {
        if (input.value != "") {
            havePatience(true, "load1", "removeFriendResult");
            const auth = getAuth();
            const user = auth.currentUser;
            const currentUserQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
            const getUserDoc = await getDocs(currentUserQuery);
            const userDocId = getUserDoc.docs[0].id;
            try {
                const filter = input.value.toLowerCase();
                const queryFriend = query(collection(db, "users"), where("email".toLowerCase(), "==", filter));
                const friendDoc = await getDocs(queryFriend);
                const friendToAdd = friendDoc.docs[0].data();
                if (friendToAdd.uid === user?.uid) {
                    resultMessage("removeFriendResult", false, "Don't remove yourself! Learn self-love (●'◡'●)");
                }
                else {
                    const userDoc = doc(db, "users", userDocId);
                    await updateDoc(userDoc, {
                        friends: arrayRemove(friendToAdd.uid)
                    });
                    resultMessage("removeFriendResult", true, "Removed " + friendToAdd.name + " from friends list.");
                }

            } catch (err) {
                console.error(err);
                resultMessage("removeFriendResult", false, "Cannot find friend with email " + input.value + ".");
            }
            input.value = "";
            havePatience(false, "load1");
        }
        else {
            resultMessage("removeFriendResult", false, "Please enter an email.");
        }
    };
    deleteFriend();
}

function addToTable(friend) {
    var table = document.getElementById("friendTable");
    const tbodyEl = document.querySelector("tbody");
    var x = table.rows.length-1;

    tbodyEl.innerHTML += `<tr>
    <td>${friend.name}</td>
    <td>${friend.email}</td>
    <td>${friend.phone}</td>
    <td>${friend.address}</td>
    </tr>
    `;
}

function Friends() {
    const [friends, setFriends] = useState([]);
    const [user, loading] = useAuthState(auth);
    const fetchFriendData = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        // friends contains an array of friend uids
        setFriends(data.friends);
        for (let i=0; i<friends.length; i++) {
            const queryFriend = query(collection(db, "users"), where("uid", "==", friends[i]));
            const friendDoc = await getDocs(queryFriend);
            const friendData = friendDoc.docs[0].data();
            var table = document.getElementById("friendTable");
            var x = table.rows.length-1;
            if (friends.length > x) {
                addToTable(friendData);
            }
        }
        
    } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
        if (loading) return;
        fetchFriendData();
    }, [user, loading])

    return (
        <div>
        <Navbar />
        <center>
        <div className="friends">
            {/* TODO: TEMPORARY SOLUTION to calling the table data
            setting a setTimeout produces incorrect data to the table*/}
            {/* <div className="refreshButton">
                <button onClick={window.onload = function(){fetchFriendData()}}>Show Friend List</button>
            </div> */}
            <div className="title">
                Friends
            </div>
            <Table striped bordered hover id="friendTable">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </Table>
            <button class="button" id="addfriendbtn" onClick={window.onload = function(){friendPopup("addfriendpopup", "close")}}> Add Friend </button>
            <div id="addfriendpopup" class="addfriend">
                <div class="addfriend-content">
                    <span class="close">&times;</span>
                    <input type="text" id="searchFriendInput" placeholder="Enter your friend's email address"></input>
                    {/* TODO: Should be "send friend request button" instead of adding friend right away */}
                    <button class="btn btn-outline-primary btn-sm" id="searchfriendbtn" onClick={window.onload = function(){searchFriend()}}>add to friends</button>
                    <div id="addFriendResult"></div>
                    <div class="loader" id="load"></div>
                </div>
            </div>
            <button class="button-remove" id="removefriendbtn" onClick={window.onload = function(){friendPopup("removefriendpopup", "close1")}}> Remove friend by email </button>
            <div id="removefriendpopup" class="removefriend">
                <div class="removefriend-content">
                    <span class="close1">&times;</span>
                    <input type="text" id="removeFriendInput" placeholder="Enter email address of friend to remove"></input>
                    <button class="btn btn-outline-primary btn-sm" id="searchfriendbtn" onClick={window.onload = function(){callDeleteFriend()}}>remove friend</button>
                    <div id="removeFriendResult"></div>
                    <div class="loader" id="load1"></div>
                </div>
            </div>
            <div className="refreshButton">
                <button onClick={window.onload = function(){fetchFriendData()}}>Show Friend List</button>
            </div>
        </div>
        </center>
        </div>
    );
}

export default Friends;