

import './FeedContainer.css';



function FeedContainer(props) {

    return (
        <div id="FeedContainer_Base">
            <div className="buttons_container">
                <a href={props.item.link} target="_blank">
                    <img
                        src="images/external_link_icon.png"
                        className="external_link_icon"
                        alt="Image Error"
                    />
                </a>

                <button
                    className="read_button"

                    onClick={() => {
                        props.setDisplayArticle(props.item.link);
                    }}
                >
                    Read
                </button>
            </div>

            {props.item.title &&
                <p>
                    <b>Title:</b> {props.item.title}
                </p>
            }

            {props.item.pubDate &&
                <p>
                    <b>Published:</b> {props.item.pubDate}
                </p>
            }

            {props.item.author &&
                <p>
                    <b>Author:</b> {props.item.author}
                </p>
            }

            {props.item.contentSnippet &&
                <p>
                    <b>Snippet:</b> {props.item.contentSnippet}
                </p>
            }
        </div>
    );
}

export default FeedContainer;
