import styles from "./signin.module.css"
import _styles from "./index.module.css"
import Header from "@/app/header"
import {SERVER_IP, process_session_info} from "@/app/global.js"
import { useRouter } from 'next/router';

export default function SignIn() {
    var currentErrorElement = null;
    const router = useRouter();

    const onFormSubmit = async (event) => {
        event.preventDefault();
        
        var form = event.target;
        var formData = new FormData(form);

        var resp = await fetch(form.action, {
            method: 'post', // Default is 'get'
            body: JSON.stringify(Object.fromEntries(formData)),
            mode: 'cors',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
        })
  
        var data = await resp.json();

        if (data == null) {
            return;
        } else {
            process_session_info(data);
            router.push("/search"); // TODO why doesnt this load index and then route to /search??
        }
    }

    return (
        <>
            <div className={_styles.appcontainer}>
                <Header />
                <div className={styles.main}>
                    <form action={SERVER_IP + "/signin"} method="post" onSubmit={onFormSubmit}>
                        <div className={styles.signin}>
                            <label id={styles.ul}>Username</label>
                            <input type="text" id={styles.username} name="username"></input>
                            <label id={styles.pl}>Password</label>
                            <input type="text" id={styles.password} name="password"></input>
                            <input type="submit" id={styles.submit} value="Submit"></input>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}