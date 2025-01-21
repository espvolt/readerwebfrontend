import style from "./contextMenu.module.css"
import { useEffect, useState } from "react"

export default function ContextMenu(props) {
    const [extensionElements, setExtensionElements] = useState([]);

    useEffect(() => {
        const menuList = document.getElementById(style.contextMenuList);
        const menuBody = document.getElementById(style.contextMenuBackground);
        var auxilaryContextKeys = [];
        
        const defaultEnterCallback = () => [
            auxilaryContextKeys.forEach(key => {
                const domElement = document.getElementById(key);

                if (domElement != null) {
                    domElement.style.display = "none";
                }
            })
        ]
        props.data.forEach(element => {
            if (element.type == "button") {
                var newButton = document.createElement("button");
                newButton.className = style.contextMenuButton;
                newButton.textContent = element.text;
                newButton.onclick = element.callback;
                menuList.appendChild(newButton);
                newButton.onmouseover = defaultEnterCallback;

            } else if (element.type == "extension") {
                var extensionDiv = document.createElement("div");
                var left = document.createElement("p");
                var right = document.createElement("p");

                left.textContent = element.text;
                right.textContent = ">";

                extensionDiv.appendChild(left);
                extensionDiv.appendChild(right);
                extensionDiv.className = style.contextMenuExtension;
                
                menuList.appendChild(extensionDiv);
                
                var position = {x: 0, y: 0};
                var boundingBox = menuBody.getBoundingClientRect();
                var extensionDivBox = extensionDiv.getBoundingClientRect();
                var key = (position.x + 1) * (position.y + 1) * (position.y + 1);
                
                var keyString = "_" + key
                position.x = props.menuPosition.x + boundingBox.right - 5;
                position.y = props.menuPosition.y + extensionDivBox.top;
                console.log(position);
                var element = <ContextMenu key={key} data={element.data} menuPosition={position} keyStr={keyString} makeHidden={true}/>
                setExtensionElements(v => [...v, element]);

                extensionDiv.onmouseover = () => {
                    const domElement = document.getElementById(keyString);
                    
                    if (domElement != null) {
                        domElement.style.display = "flex";
                        // extensionDivBox.backgroundColor = "rgb(60, 60, 60);"
                    }
                }
                
                // extensionDiv.onmouseleave = () => {
                //     const domElement = document.getElementById(keyString);

                //     if (domElement != null) {
                //         domElement.style.display = "none";
                //     }
                // }

                auxilaryContextKeys.push(keyString);

            }

        });

        menuBody.style.left = props.menuPosition.x + "px";
        menuBody.style.top = props.menuPosition.y + "px";
    }, []);
    
    return (
        <div style={{"display": props.makeHidden ? "none" : "block"}} id={props.keyStr}>
            {extensionElements}
            <div id={style.contextMenuBackground}>
                <ul id={style.contextMenuList}>

                </ul>
            </div>
        </div>
    )
}