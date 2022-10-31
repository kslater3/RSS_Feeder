
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
            {props.currentLink &&
                <div id="feed_title">
                    <h2>{props.currentLink.label}</h2>
                </div>
            }

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
