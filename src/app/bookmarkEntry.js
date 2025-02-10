import { setBookDisplay } from "@/pages/[...app]";
import style from "./bookmarkEntry.module.css"
export default function BookmarkEntry(props) {
    console.log(props.cacheData);

    const data = props.cacheData;
    
    return (
        <>
            <div className={style.bookmarkListEntryBackground}
                onDoubleClick={() => {
                    setBookDisplay(props.cacheData.bookId)
                }}>
                <h3>{data.bookName}</h3>
            </div>
        </>
    )
}