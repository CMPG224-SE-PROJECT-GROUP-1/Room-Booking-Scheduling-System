import { useEffect, useState } from "react";

export function LikeButton(){
    const [likeCount, setLikeCount] = useState(0);

    

    return (
        <button onClick={() => setLikeCount(likeCount + 1)}> [{likeCount}] - LIKE</button>
    );
}