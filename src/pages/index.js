import { useRouter } from "next/router"
import style from "./index.module.css"
import { useEffect } from "react";
import App from "./[...app]";

export default function Index() { // still a bit unsure on the default thing
    return <App fromIndex={true}/>
}