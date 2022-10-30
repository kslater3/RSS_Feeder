
import './FeedContainer.css';



function FeedContainer(props) {
    let rssImg = (
        <div className="TEMPIMG"></div>
    );

    let imgsrc = 'images/rss_icon.png';


    return (
        <a href={props.item.link} target="_blank" id="FeedContainer_Link">
            <div id="FeedContainer_Base">
                <div className="img_container">
                    <img
                        src={imgsrc}
                        className="rss_img"
                        alt="No Image"
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
