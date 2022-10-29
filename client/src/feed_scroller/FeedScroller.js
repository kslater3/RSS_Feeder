
import { useState } from 'react';

import './FeedScroller.css';

import FeedContainer from '../feed_container/FeedContainer';


function fetchRSS(url) {
    return new Promise(async (resolve, reject) => {
        let feed = {};

        if(!url || !url.includes('http')) {
            reject(new Error('Invalid URL passed to fetchRSS: ' + url));

            return;
        }

        let parser = new window.RSSParser();

        try {
            let rssResults = await parser.parseURL(window.location.origin + '/corsproxy/' + url);

            resolve(rssResults);
        }catch(e) {
            reject(e);

            return;
        }
    });
}



function FeedScroller(props) {
    const [stubs, setStubs] = useState([]);


    async function updateStubs(url) {

        let feed = await fetchRSS(url);

        if(feed && feed.items) {
            let tempStubs = feed.items.map((entry) => {
                return (
                    <div className="feed_wrapper">
                        <FeedContainer item={entry}></FeedContainer>
                    </div>
                );
            });

            setStubs([...tempStubs]);
        }
    }


    return (
        <div id="FeedScroller_Base">
            <div>
                <button
                    onClick={() => {
                        updateStubs('https://www.reddit.com/.rss');
                    }}
                >
                    Reddit RSS
                </button>
            </div>

            <div>
                <button
                    onClick={() => {
                        updateStubs('http://rss.cnn.com/rss/cnn_topstories.rss');
                    }}
                >
                    CNN RSS
                </button>
            </div>

            <div className="domain_container">
                <div className="sidescroller">
                    {stubs.length ? stubs : <h1>WOW, Such Empty</h1>}
                </div>
            </div>
        </div>
    );
}

export default FeedScroller;
