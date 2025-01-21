import Header from "@/app/header"
import style from "./request.module.css"
import { useEffect } from "react"
import { getVoiceOptions } from "@/app/global";
export default function RequestPage(props) {
    const placeholderMap = {
        "wikipedia": "https://en.wikipedia.org/wiki/Lucid_Dream"
    }
    useEffect(() => {
        const cloneVoiceSelection = document.getElementById(style.cloneVoiceSelection);
        
        if (cloneVoiceSelection != null) {
            getVoiceOptions().then(data => {
                if (data != null) {
                    data.voices.forEach(element => {
                        var option = document.createElement("option")
    
                        option.value = element
                        option.textContent = element
                        
                        cloneVoiceSelection.appendChild(option);
                        cloneVoiceSelection.removeAttribute("disabled")
                    });
                } else {
                    var option = document.createElement("option")
                    option.textContent = "Failed to fetch voices"
                    cloneVoiceSelection.appendChild(option);
                }
            })
        }
        
    }, []);

    const onWebsiteTypeChanged = (event) => {
        const selectionBox = document.getElementById(style.siteTypeSelection);
        const siteLinkInput = document.getElementById(style.siteLinkInput);

        if (selectionBox == null || siteLinkInput == null) {
            return;
        }

        const currentOption = selectionBox.options[selectionBox.selectedIndex].value;

        siteLinkInput.removeAttribute("disabled");

        if (currentOption in placeholderMap) {
            siteLinkInput.placeholder = placeholderMap[currentOption];
        } else {
            siteLinkInput.placeholder = "";
        }
        
    }
    return (
        <>
            <div className={style.requestBackground}>
                <Header/>
                <div className={style.formContainer}>
                    <form id={style.trackRequestForm}>
                        <label className={style.siteTypeLabel}>Article Type</label>
                        <select id={style.siteTypeSelection} name="site_type" onChange={onWebsiteTypeChanged}>
                            <option value="none" selected disabled hidden>Select an Option</option>
                            <option value="wikipedia">Wikipedia Article</option>
                        </select>

                        
                        <label className={style.cloneVoiceLabel}>Cloned Voice</label>
                        <select disabled id={style.cloneVoiceSelection} name="clone_voice"></select>

                        <label className={style.siteLinkLabel}>Website Link</label>
                        <input disabled id={style.siteLinkInput} name="site_link" type="text"></input>

                    </form>
                </div>
            </div>
        </>
    )
}