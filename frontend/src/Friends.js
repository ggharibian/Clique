import React from "react";
import "./Friends.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

import { db } from "./firebase";
import { getAuth } from "firebase/auth";
import { query, collection, getDocs, where, doc, updateDoc, arrayUnion } from "firebase/firestore";

function searchFriendPopup() {
    const modal = document.getElementById("addfriendpopup");
    const button = document.getElementById("addfriendbtn");
    const span = document.getElementsByClassName("close")[0];
    button.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
}

const input = document.getElementById("searchFriendInput");
if (input){
    const button = document.getElementById("searchfriendbtn");
    button.onclick = function() {searchFriendEmail()};
    
    const searchFriendEmail = async() => {
        const filter = input.value.toLowerCase();
        try {
            const q = query(collection(db, "users"), where("email".toLowerCase(), "==", filter));
            const querySnapshot = await getDocs(q);
            try {
                const friendToAdd = querySnapshot.docs[0].data();
                const auth = getAuth();
                const user = auth.currentUser;
                const currentUserQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
                const getUserDoc = await getDocs(currentUserQuery);
                
                // TODO: (Not urgent) Add better UI for popup boxes instead of alerts and windows confirm
                if (user.uid == friendToAdd.uid) {
                    alert("Cannot add yourself as a friend!\nHave you got no friends? :(");
                }
                const userData = getUserDoc.docs[0].data();
                if (userData.friends.includes(friendToAdd.uid)) {
                    alert(friendToAdd.name + " is already in your friends list.")
                }
                else {
                    // add to table
                    if (window.confirm("Add " + friendToAdd.name + " as a friend?")) {
                        const userDocId = getUserDoc.docs[0].id;
                        addFriendToList(friendToAdd.uid, userDocId);
                        alert("Successfully added " + friendToAdd.name + " as a friend!");
                    }
                }
            }
            catch (err) {
                alert(err.message + "\nUser with email " + input.value + " may not exist");
            }

          } catch (err) {
            console.error(err);
            // alert(err.message);
          }
          input.value = "";
    };
}

const addFriendToList = async(uid, userDocId) => {
    try {
        const userDoc = doc(db, "users", userDocId);
        await updateDoc(userDoc, {
            friends: arrayUnion(uid)
        });
    } catch (err) {
        console.error(err);
        alert("Adding friend unsuccessful.\n" + err.message);
    }
}

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
            <button class="button" id="addfriendbtn"> Add Friend </button>
            <div id="addfriendpopup" class="addfriend">
                <div class="addfriend-content">
                    <span class="close">&times;</span>
                    <input type="text" id="searchFriendInput" placeholder="Enter your friend's email address"></input>
                    {/* TODO: Should be "send friend request button" instead of adding friend right away */}
                    <button class = "addfriend-sendbutton" id="searchfriendbtn" onclick="searchFriendEmail()">add to friends</button>
                </div>
            </div>
            {window.onload = function(){searchFriendPopup()}}
        </div>
        </center>
    );
}

export default Friends;