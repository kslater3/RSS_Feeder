
import { useState } from 'react';

import './FeedScroller.css';

import FeedContainer from '../feed_container/FeedContainer';


function ConditionalScroller(props) {
    if(props.loadingRSS) {
        return (
            <div id="spinner">
            </div>
        );
    }

    return(
        <div>
            <div className="sidescroller">
                {props.stubs.length ? props.stubs : <h1>Select a Link Above</h1>}
            </div>
        </div>
    );
}



function FeedScroller(props) {
    const [displayArticle, setDisplayArticle] = useState('');

    let stubs = [];

    if(props.rssData && props.rssData.items) {
        stubs = props.rssData.items.map((entry) => {
            return (
                <div className="feed_wrapper">
                    <FeedContainer
                        displayArticle={displayArticle}

                        setDisplayArticle={(articleLink) => {
                            for(let i = 0; i < props.rssData.items.length; i++) {
                                if(props.rssData.items[i].link == articleLink) {
                                    setDisplayArticle(props.rssData.items[i].content);
                                }
                            }
                        }}

                        item={entry}
                    ></FeedContainer>
                </div>
            );
        });
    }


    return (
        <div id="FeedScroller_Base">
            {(props.rssData && props.rssData.image && props.rssData.image.url)
                ?
                <div className="feed_img_container">
                    <img
                        src={props.rssData.image.url}
                        alt="Image Error"
                        className="feed_img"
                    />
                </div>
                :
                <div></div>
            }

            {props.currentLink
                ?
                <div className="feed_title">
                    <h3>{props.currentLink.label}</h3>
                </div>
                :
                <div></div>
            }

            <ConditionalScroller
                isLoading={props.loadingRSS}
                stubs={stubs}

                currentLink={props.currentLink}
            >
            </ConditionalScroller>

            {displayArticle.length
                ?
                <div className="article_container">
                    <article dangerouslySetInnerHTML={{ __html: displayArticle }}>

                    </article>
                </div>
                :
                <p>Select an Article Above</p>
            }
        </div>
    );
}

export default FeedScroller;
