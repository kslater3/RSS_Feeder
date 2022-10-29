
import './FeedContainer.css';



function extract_img_src(content) {
    let imgsrc = '';

    if(!content || content.length == 0) {
        return imgsrc;
    }

    let imgrx = /<img.*?src="(.*?)"/;
    let imgmatch = imgrx.exec(content);

    if(imgmatch) {
        // index 1 contains the group within the "" which is the url for the img
        imgsrc = imgmatch[1];
    }

    return imgsrc;
}



function FeedContainer(props) {
    let rssImg = (
        <div className="TEMPIMG"></div>
    );

    let imgsrc = extract_img_src(props.item.content);


    return (
        <a href={props.item.link} target="_blank" id="FeedContainer_Link">
            <div id="FeedContainer_Base">
                <div className="img_container">
                    <img
                        src={imgsrc}
                        className="rss_img"
                        onError={() => {
                            return (
                                {rssImg}
                            );
                        }}
                    />
                </div>

                <div id="info_container">
                    {props.item.title &&
                        <div className="detail_container">
                            <b>Title:</b> {props.item.title}
                        </div>
                    }

                    {props.item.pubDate &&
                        <div className="detail_container">
                            <b>Published:</b> {props.item.pubDate}
                        </div>
                    }

                    {props.item.author &&
                        <div className="detail_container">
                            <b>Author:</b> {props.item.author}
                        </div>
                    }

                    {props.item.contentSnippet &&
                        <div className="detail_container">
                            <b>Snippet:</b> {props.item.contentSnippet}
                        </div>
                    }
                </div>
            </div>
        </a>
    );
}

export default FeedContainer;
