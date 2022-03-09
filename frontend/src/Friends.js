
import React, { useEffect, useState } from "react"
import "./Friends.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { query, collection, getDocs, where, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import Navbar from "./components/navbar"

let friendlist = [];

function EachFriend(id, n, em, phone, addr) {
    var obj = {
        id: id,
        name: n,
        email: em,
        phone: phone,
        address: addr
    };
    return obj;
}

function searchFriendPopup() {
    const modal = document.getElementById("addfriendpopup");
    // const button = document.getElementById("addfriendbtn");
    const span = document.getElementsByClassName("close")[0];
    // button.onclick = function() {
    //     modal.style.display = "block";
    // }
    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    }
}
function searchFriend() {
    const input = document.getElementById("searchFriendInput");
    if (input){
        const button = document.getElementById("searchfriendbtn");
        button.onclick = function() {searchFriendEmail()};
    
        const searchFriendEmail = async() => {
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
                    // TODO: (Not urgent) Add better UI for popup boxes instead of alerts and windows confirm
                    if (user.uid == friendToAdd.uid) {
                        alert("Cannot add yourself as a friend!\nHave you got no friends? :(");
                    }
                    else if (userData.friends.includes(friendToAdd.uid)) {
                        alert(friendToAdd.name + " is already in your friends list.")
                    }
                    else {
                        if (window.confirm("Add " + friendToAdd.name + " as a friend?")) {
                            const userDocId = getUserDoc.docs[0].id;
                            addFriendToList(friendToAdd.uid, userDocId);
                            alert("Successfully added " + friendToAdd.name + " as a friend!");
                            
                            const queryFriend = query(collection(db, "users"), where("uid", "==", friendToAdd.uid));
                            const friendDoc = await getDocs(queryFriend);
                            const friendData = friendDoc.docs[0].data();
                            addToTable(friendData);
                        }
                    }
                }
                catch (err) {
                    alert(err.message + "\nUser with email " + input.value + " may not exist");
                }
                
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
            input.value = "";
        };
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
        alert("Adding friend unsuccessful.\n" + err.message);
    }
}

function deleteFriend(friend) {
    // if (!e.target.classList.contains("deleteBtn")) {
    //     return;
}

// TODO: add remove friend feature
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
    // <td><button id = "searchfriendbtn" class = "deleteBtn"}>Remove Friend</button></td>
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
            const currFriend =  new EachFriend(friends[i] ,friendData.name, friendData.email, friendData.phone,friendData.address);
            if (!friendlist.includes(currFriend)) {
                friendlist.push(currFriend);
                var table = document.getElementById("friendTable");
                var x = table.rows.length-1;
                if (friends.length > x) {
                    addToTable(currFriend);
                }
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
                <button onClick={window.onload = function(){fetchFriendData()}}>Refresh Friend List</button>
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
            <button class="button" id="addfriendbtn" onClick={window.onload = function(){searchFriendPopup()}}> Add Friend </button>
            <div id="addfriendpopup" class="addfriend">
                <div class="addfriend-content">
                    <span class="close">&times;</span>
                    <input type="text" id="searchFriendInput" placeholder="Enter your friend's email address"></input>
                    {/* TODO: Should be "send friend request button" instead of adding friend right away */}
                    <button class="addfriend-sendbutton" id="searchfriendbtn" onClick={window.onload = function(){searchFriend()}}>add to friends</button>
                </div>
            </div>
            <div className="refreshButton">
                <button onClick={window.onload = function(){fetchFriendData()}}>Refresh Friend List</button>
            </div>
        </div>
        </center>
        </div>
    );
}

export default Friends;