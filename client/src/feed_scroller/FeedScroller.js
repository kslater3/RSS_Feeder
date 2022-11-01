
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

    const [articleAudioURL, setArticleAudioURL] = useState('');
    const [articleAudio, setArticleAudio] = useState(undefined);
    const [isPaused, setIsPaused] = useState(true);


    if(articleAudioURL && !articleAudio) {
        let newAudio = new Audio(articleAudioURL);

        setArticleAudio(newAudio);
    }

    let stubs = [];

    if(props.rssData && props.rssData.items) {
        stubs = props.rssData.items.map((entry) => {
            return (
                <div className="feed_wrapper">
                    <FeedContainer
                        displayArticle={displayArticle}

                        setDisplayArticle={(articleTitle) => {
                            if(articleAudio) {
                                articleAudio.pause();

                                setArticleAudio(undefined);

                                setArticleAudioURL('');

                                setIsPaused(true);
                            }

                            for(let i = 0; i < props.rssData.items.length; i++) {
                                if(props.rssData.items[i].title == articleTitle) {
                                    setDisplayArticle(props.rssData.items[i].content);

                                    if(props.rssData.items[i].enclosure && props.rssData.items[i].enclosure.type.toLowerCase().includes('audio')) {
                                        try {
                                            let newAudioURL = props.rssData.items[i].enclosure.url;

                                            setArticleAudioURL(newAudioURL);
                                        }catch(e) {
                                            console.error(e);
                                        }
                                    }


                                    return;
                                }
                            }

                            // If we didn't hit a match and return, then make the article empty
                            setDisplayArticle('Article Not Found');
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
                    <a href={props.rssData.image.link}>
                        <img
                            src={props.rssData.image.url}
                            alt="Image Error"
                            className="feed_img"
                        />
                    </a>
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
                    {articleAudio
                        ?
                            <div className="audio_button_container">
                                {isPaused
                                    ?
                                    <img
                                        src="images/play_icon.png"
                                        className="audio_button"
                                        onClick={() => {
                                            articleAudio.play();

                                            setIsPaused(false);
                                        }}
                                        alt="Image Error"
                                    />
                                    :
                                    <img
                                        src="images/pause_icon.png"
                                        className="audio_button"
                                        onClick={() => {
                                            articleAudio.pause();

                                            setIsPaused(true);
                                        }}
                                        alt="Image Error"
                                    />

                                }
                            </div>
                        :
                        <div></div>
                    }

                    <div dangerouslySetInnerHTML={{ __html: displayArticle }}>

                    </div>
                </div>
                :
                <p>Select an Article Above</p>
            }
        </div>
    );
}

export default FeedScroller;
