import style from "./header.module.css"
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { checkLogin, getDisplayName, logout } from "./global";
import { getSessionId, getUsername } from "./global";

export default function Header(props) {
    const router = useRouter();


    const onSignInClicked = () => {
        router.push("/signin");
    }

    const onRequestClicked = () => {
        router.push("/request");
    }

    useEffect(() => {
        // console.log("I EXIST");
        var user_text = document.getElementById(style.username);
        var button = document.getElementById(style.button);
        var requestButton = document.getElementById(style.requestButton);
        var signoutButton = document.getElementById(style.logout);
        button.style.display = "none";
        user_text.style.display = "none";

        checkLogin().then(res => {
            // console.log("NOW IM HERE", res);
            if (res) {
                button.style.display = "none";
                user_text.style.display = "block";
                user_text.textContent = getDisplayName();
                requestButton.style.display = "block";
                signoutButton.style.display = "block";
            } else {
                button.style.display = "block";
            }
        });

    }, []);
    
    const onSearchBar = (ev) => {
        ev.preventDefault()
        var form = ev.target;
        var formData = new FormData(form);
        
        if (props.onSearchBarSubmit) {
            props.onSearchBarSubmit(formData.get("searchContent"));
        }
    }

    const logOutClicked = () => {
        logout()
    }

    return (
        <>
            <div className={style.header}>
                <button id={style.button} onClick={onSignInClicked}>Sign In</button>
                <p id={style.username}></p>
                {props.searchBar &&
                <div id={style.searchBarContainer}>
                    <form onSubmit={onSearchBar} id={style.searchBar}>
                        <input type="text"  name="searchContent"></input>
                        <input type="submit" id={style.submit}></input>
                    </form>
                </div>
                }
                <div className={style.rightDiv}>
                    <button id={style.logout} onClick={logOutClicked}>Sign Out</button>
                    <button id={style.requestButton} onClick={onRequestClicked}>Request</button>
                </div>
            </div>
        </>
    )
}